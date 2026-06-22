import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Film,
  Calendar,
  Settings,
  ChevronDown,
  Check,
  MapPin,
  User,
  Megaphone,
  BadgeCheck,
  BookOpen,
} from "lucide-react";
import logoAsset from "@/assets/ccn-logo-user.png.asset.json";
import { useAuth } from "@/lib/store";
import { useLocations } from "@/lib/data-stores";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePermissions, type ModuleKey } from "@/lib/data-stores";

const ADMIN_NAV: { to: string; label: string; icon: typeof LayoutDashboard; mod: ModuleKey }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, mod: "dashboard" },
  { to: "/members", label: "Members", icon: Users, mod: "members" },
  { to: "/sponsors", label: "Sponsors", icon: Handshake, mod: "sponsors" },
  { to: "/films", label: "Submitted Films", icon: Film, mod: "films" },
  { to: "/events", label: "Events", icon: Calendar, mod: "events" },
  { to: "/settings", label: "Settings", icon: Settings, mod: "settings" },
];

const MEMBER_NAV: { to: string; label: string; icon: typeof LayoutDashboard; mod: ModuleKey }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, mod: "dashboard" },
  { to: "/settings", label: "My Profile", icon: User, mod: "settings" },
  { to: "/films", label: "My Submissions", icon: Film, mod: "films" },
  { to: "/events", label: "My Events", icon: Calendar, mod: "events" },
  { to: "/communications", label: "My Communications", icon: Megaphone, mod: "communications" },
  { to: "/membership", label: "My Membership", icon: BadgeCheck, mod: "membership" },
  { to: "/resources", label: "Resources", icon: BookOpen, mod: "resources" },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, activeLocationId, setActiveLocation } = useAuth();
  const { locations, getById } = useLocations();
  const { perms } = usePermissions();
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const activeLoc = activeLocationId === "all" ? null : getById(activeLocationId);

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center border-b border-sidebar-border">
        <img src={logoAsset.url} alt="Cinema Cities Network" className="w-full max-w-[180px] object-contain" />
      </div>


      {/* Location switcher */}
      <div className="px-4 pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sidebar-border/40 hover:bg-sidebar-border/70 transition-colors text-left">
            <MapPin className="size-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-sidebar-muted">Location</p>
              <p className="text-sm font-semibold truncate">
                {activeLoc ? `${activeLoc.flag} ${activeLoc.city}` : "🌐 All Locations"}
              </p>
            </div>
            <ChevronDown className="size-4 text-sidebar-muted" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
            {isAdmin && (
              <>
                <DropdownMenuItem onClick={() => setActiveLocation("all")}>
                  <span className="mr-2">🌐</span> All Locations
                  {activeLocationId === "all" && <Check className="size-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuLabel>CCN Locations</DropdownMenuLabel>
            {locations.map((l) => {
              const allowed = isAdmin || l.id === user.primaryLocationId || true;
              return (
                <DropdownMenuItem
                  key={l.id}
                  onClick={() => allowed && setActiveLocation(l.id)}
                  disabled={!allowed}
                >
                  <span className="mr-2">{l.flag}</span>
                  <span>{l.city}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{l.country}</span>
                  {activeLocationId === l.id && <Check className="size-4 ml-auto" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {(isAdmin ? ADMIN_NAV : MEMBER_NAV)
          .filter((n) => perms[user.role][n.mod])
          .map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-border/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
