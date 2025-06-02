import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { ICard } from "@/lib/db";
import { cn } from "@/lib/utils";

interface CardListProps {
  cards: ICard[];
}

export function CardList({ cards }: CardListProps) {
  if (!cards.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-primary">No cards found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Start by adding your first government ID card.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {cards.map((card) => (
        <Link key={card.id} to={`/${card.id}`} className="block">
          <Card
            className={cn(
              "transition-colors hover:bg-primary/5",
              "cursor-pointer group relative overflow-hidden border-primary/10"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg text-primary">
                  {card.name}
                </CardTitle>
                <CardDescription>{card.id}</CardDescription>
              </div>
              <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {card.validUntil && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    Valid until {new Date(card.validUntil).toLocaleDateString()}
                  </Badge>
                )}
                {card.type && (
                  <Badge variant="outline" className="border-primary/20">
                    {card.type}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
