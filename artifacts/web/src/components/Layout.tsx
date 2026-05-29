import { Link, useLocation } from "wouter";
import { Scale, MessageSquare, History, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Ask", icon: MessageSquare },
    { href: "/history", label: "History", icon: History },
    { href: "/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 mr-6 text-primary">
            <Scale className="h-6 w-6" />
            <span className="font-serif font-bold text-lg hidden sm:inline-block">ReEntry Legal AI</span>
          </Link>
          <nav className="flex items-center gap-1 md:gap-4 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                  location === item.href || (location.startsWith("/chat/") && item.href === "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="max-w-2xl mx-auto">
            This is legal information, not legal advice. Consult a licensed attorney for representation in your specific case.
          </p>
        </div>
      </footer>
    </div>
  );
}
