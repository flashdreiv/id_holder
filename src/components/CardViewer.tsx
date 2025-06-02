import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SwitchCameraIcon,
  Calendar,
  ArrowLeft,
  Trash2,
  Loader2,
  PencilIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ICard } from "@/lib/db";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface CardViewerProps {
  card: ICard;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function CardViewer({
  card,
  onDelete,
  onEdit,
  isDeleting = false,
}: CardViewerProps) {
  const [imageType, setImageType] = useState<"front" | "back">("front");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(card.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{card.name}</CardTitle>
              <CardDescription className="mt-1.5">{card.id}</CardDescription>
            </div>
            {card.logo && (
              <img
                src={card.logo}
                alt={`${card.name} Logo`}
                className="size-16 object-contain"
              />
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <div className="relative aspect-[1.586] w-full overflow-hidden rounded-lg bg-muted cursor-pointer hover:opacity-95 transition-opacity">
                  <div
                    key={imageType}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-300",
                      imageType === "front" ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {card.frontPicture && (
                      <img
                        src={card.frontPicture}
                        alt="Front of the card"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div
                    key={`${imageType}-back`}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-300",
                      imageType === "back" ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {card.backPicture && (
                      <img
                        src={card.backPicture}
                        alt="Back of the card"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] h-[85vh] p-0 overflow-hidden">
                <div className="relative w-full h-full bg-black/95 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
                    onClick={() => setIsPreviewOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <img
                    src={
                      imageType === "front"
                        ? card.frontPicture
                        : card.backPicture
                    }
                    alt={`${
                      imageType === "front" ? "Front" : "Back"
                    } of the card`}
                    className="max-w-full max-h-full w-auto h-auto object-contain rotate-90 transform-gpu"
                    style={{
                      maxHeight: "95vw",
                      maxWidth: "85vh",
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() =>
                  setImageType(imageType === "front" ? "back" : "front")
                }
                disabled={!card.backPicture}
              >
                <SwitchCameraIcon className="h-4 w-4 mr-2" />
                {imageType === "front" ? "Show Back" : "Show Front"}
              </Button>
            </div>

            <Separator />

            <div className="grid gap-4">
              {card.validUntil && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valid Until</span>
                  </div>
                  <span className="text-sm">
                    {new Date(card.validUntil).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {card.type}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  ID: {card.id}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
