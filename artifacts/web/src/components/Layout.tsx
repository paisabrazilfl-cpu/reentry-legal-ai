import { Link, useLocation } from "wouter";
import { useAuth, SignOutButton } from "@clerk/react";
import { Scale, MessageSquare, History, BookOpen, MapPin, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isSignedIn } = useAuth();
  const isHome = location === "/" || location.startsWith("/chat/");
  const isAuthPage = location.startsWith("/sign-in") || location.startsWith("/sign-up");

  const navItems = [
    { href: "/", label: "Ask", icon: MessageSquare },
    { href: "/history", label: "History", icon: History },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/50-states", label: "50 States", icon: MapPin },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      {/* Header with gradient background when on home */}
      <header className={cn(
        "sticky top-0 z-50 w-full",
        isHome ? "bg-[#0f172a]" : "bg-white border-b border-[#e2e8f0]"
      )}>
        <div className="max-w-6xl mx-auto flex h-16 items-center px-6">
          <Link href="/" className={cn(
            "flex items-center gap-3 mr-8",
            isHome ? "text-white" : "text-[#0f172a]"
          )}>
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              isHome ? "bg-white" : "bg-[#0f172a]"
            )}>
              <Scale className={cn(
                "w-5 h-5",
                isHome ? "text-[#0f172a]" : "text-white"
              )} />
            </div>
            <span className="font-bold text-lg tracking-tight">ReEntry Legal AI</span>
          </Link>
          <nav className="flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (location.startsWith("/chat/") && item.href === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    isHome
                      ? (isActive
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10")
                      : (isActive
                        ? "bg-[#0f172a] text-white"
                        : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]")
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <SignOutButton redirectUrl="/">
                <button className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                  isHome
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                )}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </SignOutButton>
            ) : (
              !isAuthPage && (
                <Link
                  href="/sign-in"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    isHome
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-[#0f172a] text-white hover:bg-[#1e293b]"
                  )}
                >
                  Sign in
                </Link>
              )
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-[#e2e8f0] py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[#94a3b8] max-w-2xl mx-auto">
            This is legal information, not legal advice. Consult a licensed attorney for representation in your specific case.
          </p>
        </div>
      </footer>
    </div>
  );
}
