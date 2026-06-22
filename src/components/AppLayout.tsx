import { Outlet, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Mail, Search, User } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/store";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-background border-b border-border flex items-center gap-4 px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search across the network…"
              className="w-full h-11 pl-11 pr-4 rounded-full bg-secondary border border-transparent focus:bg-card focus:border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <button className="relative size-10 rounded-full grid place-items-center hover:bg-secondary transition-colors">
            <Bell className="size-5 text-foreground" />
            <span className="absolute top-1 right-1 size-4 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center">
              12
            </span>
          </button>
          <button className="relative size-10 rounded-full grid place-items-center hover:bg-secondary transition-colors">
            <Mail className="size-5 text-foreground" />
            <span className="absolute top-1 right-1 size-4 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center">
              7
            </span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-secondary transition-colors">
              <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
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
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
