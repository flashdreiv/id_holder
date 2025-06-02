import { Button } from "./button";
import { PlusCircle, Search, ArrowLeft } from "lucide-react";
import { Input } from "./input";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  title?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  showBackButton?: boolean;
}

export function Layout({
  children,
  showSearch = true,
  title = "My Cards",
  searchQuery = "",
  onSearchChange,
  showBackButton = false,
}: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
              </Button>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              {title}
            </h1>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="container mt-20 max-w-screen-2xl mx-auto px-4">
        {showSearch && (
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search cards..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
            <Link to="/add">
              <Button className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </Link>
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
