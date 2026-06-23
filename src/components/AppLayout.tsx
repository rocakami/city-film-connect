import { Outlet, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Mail, Menu, Search, User } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/store";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/ccn-logo-full.png.asset.json";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-72 max-w-[85vw] border-r-0 bg-sidebar">
          <div onClick={() => setOpen(false)}>
            <AppSidebar />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 md:h-20 bg-background border-b border-border flex items-center gap-2 md:gap-4 px-3 md:px-8 sticky top-0 z-10">
          <button
            onClick={() => setOpen(true)}
            className="md:hidden size-10 rounded-full grid place-items-center hover:bg-secondary transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>


          <img src={logoAsset.url} alt="CCN" className="md:hidden h-8 object-contain" />

          <div className="hidden md:block flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search across the network…"
              className="w-full h-11 pl-11 pr-4 rounded-full bg-secondary border border-transparent focus:bg-card focus:border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          <div className="flex-1 md:hidden" />

          <button className="relative size-10 rounded-full grid place-items-center hover:bg-secondary transition-colors shrink-0">
            <Bell className="size-5 text-foreground" />
            <span className="absolute top-1 right-1 size-4 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center">
              12
            </span>
          </button>
          <button className="hidden sm:grid relative size-10 rounded-full place-items-center hover:bg-secondary transition-colors shrink-0">
            <Mail className="size-5 text-foreground" />
            <span className="absolute top-1 right-1 size-4 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center">
              7
            </span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 pr-2 py-1.5 rounded-full hover:bg-secondary transition-colors shrink-0">
              <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold leading-tight">Welcome, {user.name.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role === "admin" ? "Super Administrator" : "Member"}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <User className="size-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate({ to: "/auth" });
                }}
              >
                <LogOut className="size-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 px-4 md:px-8 py-4 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
