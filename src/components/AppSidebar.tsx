import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  LogOut,
} from "lucide-react";
import logoAsset from "@/assets/ccn-logo-full.png.asset.json";
import skylineAsset from "@/assets/ccn-skyline.png.asset.json";
import { useAuth } from "@/lib/store";
import { useLocations, usePermissions, type ModuleKey } from "@/lib/data-stores";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  { to: "/events", label: "Events", icon: Calendar, mod: "events" },
  { to: "/communications", label: "My Communications", icon: Megaphone, mod: "communications" },
  { to: "/membership", label: "My Membership", icon: BadgeCheck, mod: "membership" },
  { to: "/resources", label: "Resources", icon: BookOpen, mod: "resources" },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, activeLocationId, setActiveLocation, logout } = useAuth();
  const { locations, getById } = useLocations();
  const { perms } = usePermissions();
  const navigate = useNavigate();
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const activeLoc = activeLocationId === "all" ? null : getById(activeLocationId);

  return (
    <aside className="w-72 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center border-b border-sidebar-border">
        <img src={logoAsset.url} alt="Cinema Cities Network" className="w-full max-w-[200px] object-contain" />
        <p className="mt-3 text-[10px] font-semibold tracking-[0.18em] text-sidebar-foreground/90">
          GLOBAL UNITY THROUGH STORYTELLING
        </p>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">
          FILM. TECHNOLOGY. THE HUMAN VOICE.
        </p>
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
            {locations.map((l) => (
              <DropdownMenuItem key={l.id} onClick={() => setActiveLocation(l.id)}>
                <span className="mr-2">{l.flag}</span>
                <span>{l.city}</span>
                <span className="ml-1 text-xs text-muted-foreground">{l.country}</span>
                {activeLocationId === l.id && <Check className="size-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
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

      {/* Promo card */}
      <div className="px-4 pb-3">
        <div className="relative rounded-xl border border-sidebar-border bg-sidebar-border/30 p-4 overflow-hidden">
          <p className="text-sm font-semibold leading-snug">
            Global unity<br />through storytelling.
          </p>
          <p className="mt-2 text-xs bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent font-medium">
            Film. Technology.<br />The Human Voice.
          </p>
          <svg viewBox="0 0 200 60" className="mt-3 w-full h-12 opacity-70" fill="none">
            <path d="M0 55 L10 40 L20 50 L30 30 L40 45 L55 20 L70 40 L85 15 L100 35 L115 10 L130 30 L145 25 L160 40 L175 18 L190 38 L200 28 L200 60 L0 60 Z" fill="url(#sg)" />
            <defs>
              <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 pb-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-sidebar-border bg-sidebar-border/30 hover:bg-sidebar-border/60 transition-colors text-left">
            <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-sidebar-muted capitalize">{user.role}</p>
            </div>
            <ChevronDown className="size-4 text-sidebar-muted" />
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
      </div>
    </aside>
  );
}
