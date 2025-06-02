import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { updateCard, type ICard } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GOV_CARDS } from "@/constants";

const formSchema = z.object({
  name: z.string().min(1, "Card name is required"),
  id: z.string().min(1, "Card ID is required"),
  type: z.string().min(1, "Card type is required"),
  validUntil: z.string().optional(),
  frontPicture: z.string().min(1, "Front picture is required"),
  backPicture: z.string().optional(),
  logo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCardFormProps {
  card: ICard;
  onSuccess: () => void;
}

export function EditCardForm({ card, onSuccess }: EditCardFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: card.name,
      id: card.id,
      type: card.type,
      validUntil: card.validUntil || "",
      frontPicture: card.frontPicture || "",
      backPicture: card.backPicture || "",
      logo: card.logo || "",
    },
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "frontPicture" | "backPicture"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(field, reader.result as string, {
          shouldValidate: true,
          shouldDirty: true,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(`Failed to upload ${field}:`, error);
      form.setError(field, {
        type: "manual",
        message: "Failed to upload image",
      });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await updateCard(
        {
          ...data,
          logo: GOV_CARDS.find((c) => c.name === data.name)?.logo || "", // Update logo based on card name
        },
        card.id // Pass the original card ID
      );
      onSuccess();
      navigate(`/${data.id}`); // Navigate to the new ID
    } catch (error) {
      console.error("Failed to update card:", error);
      form.setError("root", {
        type: "manual",
        message: "Failed to update card. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Card</CardTitle>
        <CardDescription>
          Update your government ID card details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Driver's License" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., DL-123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Government ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frontPicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front Picture</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "frontPicture")}
                          className={cn(
                            "file:bg-transparent file:border-0",
                            "file:bg-primary file:text-primary-foreground",
                            "file:hover:bg-primary/90"
                          )}
                        />
                        {field.value && (
                          <div className="aspect-[1.586] w-full rounded overflow-hidden bg-muted">
                            <img
                              src={field.value}
                              alt="Front picture preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backPicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Back Picture (Optional)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "backPicture")}
                          className={cn(
                            "file:bg-transparent file:border-0",
                            "file:bg-primary file:text-primary-foreground",
                            "file:hover:bg-primary/90"
                          )}
                        />
                        {field.value && (
                          <div className="aspect-[1.586] w-full rounded overflow-hidden bg-muted">
                            <img
                              src={field.value}
                              alt="Back picture preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/${card.id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Card...
                  </>
                ) : (
                  "Update Card"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
