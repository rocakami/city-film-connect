import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar, CalendarCheck, Users, Ticket, DollarSign, Download, Plus, Search, Filter,
  Eye, Pencil, MoreVertical, MapPin, Check, ChevronLeft, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveLocation, filterByLocation, useAuth } from "@/lib/store";
import { EVENTS, EVENT_CATEGORIES, type CCNEvent } from "@/lib/mock-data";
import { getLocationById, CCN_LOCATIONS } from "@/lib/locations";
import { useEventRegistrations } from "@/lib/registrations";

export const Route = createFileRoute("/_app/events")({
  component: EventsRoute,
});

function EventsRoute() {
  const { user } = useAuth();
  if (user?.role === "member") return <MemberEventsPage />;
  return <AdminEventsPage />;
}

/* ──────────────────────── Member view (image 2) ──────────────────────── */

function MemberEventsPage() {
  const { user } = useAuth();
  const { toggle, isRegistered } = useEventRegistrations(user?.id);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  const all = EVENTS;
  const filtered = all.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (location !== "all" && e.locationId !== location) return false;
    if (search && !`${e.name} ${e.venue} ${e.city}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const upcoming = all.filter((e) => e.status === "Upcoming");
  const myRegs = upcoming.filter((e) => isRegistered(e.id)).length;
  const cities = new Set(all.map((e) => e.city)).size;

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Discover and register for events hosted by Cinema Cities Network."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Upcoming Events" value={upcoming.length} caption={`Registered for ${myRegs}`} icon={Calendar} tone="blue" />
        <StatCard label="Events Registered" value={myRegs} caption="View My Registrations" icon={Users} tone="green" />
        <StatCard label="Tickets" value={myRegs} caption="View My Tickets" icon={Ticket} tone="amber" />
        <StatCard label="Cities" value={cities} caption="Events this year" icon={MapPin} tone="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-card border border-border rounded-2xl">
          <div className="p-5 border-b border-border">
            <p className="text-lg font-semibold">All Events</p>
          </div>
          <div className="p-4 flex flex-wrap items-center gap-3 border-b border-border">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search events…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[170px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EVENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Locations" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {CCN_LOCATIONS.map((l) => <SelectItem key={l.id} value={l.id}>{l.flag} {l.city}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline"><Filter className="size-4 mr-2" /> Filter</Button>
          </div>

          <ul className="divide-y divide-border">
            {filtered.map((e) => (
              <li key={e.id} className="p-5 flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-44 h-32 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 grid place-items-center text-white text-xs font-bold shrink-0">
                  {e.city}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 mb-1.5">
                    {e.category}
                  </span>
                  <p className="text-lg font-bold">{e.name}</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Calendar className="size-4" /> {e.date}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="size-4" /> {e.venue}, {e.city}
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:w-44 shrink-0">
                  {isRegistered(e.id) ? (
                    <span className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md bg-emerald-100 text-emerald-700">
                      <Check className="size-3.5" /> Registered
                    </span>
                  ) : e.status === "Upcoming" ? (
                    <Button onClick={() => toggle(e.id)}>
                      <Ticket className="size-4 mr-2" /> Register
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-2 rounded-md bg-secondary text-muted-foreground text-center">
                      {e.status}
                    </span>
                  )}
                  <Button variant="outline" size="sm">
                    View Details <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-12 text-center text-sm text-muted-foreground">No events match.</li>
            )}
          </ul>
        </div>

        <aside className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">Upcoming Events</p>
              <span className="text-xs font-semibold text-primary">View All</span>
            </div>
            <ul className="space-y-3">
              {upcoming.slice(0, 3).map((e) => (
                <li key={e.id} className="flex gap-3">
                  <div className="text-center w-10 shrink-0">
                    <p className="text-[10px] font-bold text-rose-500">{e.date.slice(0, 3).toUpperCase()}</p>
                    <p className="text-lg font-bold leading-none">{e.date.match(/\d+/)?.[0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{e.city}</p>
                    <p className="text-xs text-muted-foreground">{e.date}</p>
                    <p className={`mt-1 text-[10px] font-semibold ${isRegistered(e.id) ? "text-emerald-600" : "text-amber-600"}`}>
                      {isRegistered(e.id) ? "✓ Registered" : "○ Open"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <MiniCalendar registeredCount={myRegs} />

          <div className="rounded-2xl bg-slate-900 text-white p-5">
            <p className="font-semibold">Don't Miss Out!</p>
            <p className="text-sm text-white/70 mt-1">
              New events are added regularly. Check back often and be part of the global storytelling community.
            </p>
            <button className="mt-3 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm font-semibold">
              Explore Events
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function MiniCalendar({ registeredCount }: { registeredCount: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <button className="size-7 grid place-items-center rounded-md hover:bg-secondary"><ChevronLeft className="size-4" /></button>
        <p className="font-semibold text-sm">May 2024</p>
        <button className="size-7 grid place-items-center rounded-md hover:bg-secondary"><ChevronRight className="size-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted-foreground uppercase">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1 text-center text-xs">
        {Array.from({ length: 35 }).map((_, i) => {
          const day = i - 2; // start offset
          const isToday = day === 15;
          if (day < 1 || day > 31) return <div key={i} className="py-1.5 text-muted-foreground/50">{((day - 1 + 30) % 30) + 1}</div>;
          return (
            <div key={i} className={`py-1.5 rounded ${isToday ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-secondary"}`}>
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" /> Registered ({registeredCount})</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" /> Pending</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> Open</span>
      </div>
    </div>
  );
}

/* ──────────────────────── Admin view ──────────────────────── */

function AdminEventsPage() {
  const { locationId } = useActiveLocation();
  const { user } = useAuth();
  const scoped = filterByLocation(EVENTS, locationId);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = scoped.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    if (search && !`${e.name} ${e.venue} ${e.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const upcoming = scoped.filter((e) => e.status === "Upcoming").length;
  const totalReg = scoped.reduce((sum, e) => sum + e.registrations, 0);

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Create, manage, and monitor all events across the Cinema Cities Network."
        actions={
          <>
            <Button variant="outline"><Download className="size-4 mr-2" /> Export</Button>
            <Button><Plus className="size-4 mr-2" /> Add Event</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Events" value={scoped.length} icon={Calendar} tone="violet" delta={{ value: "15.3%", direction: "up" }} />
        <StatCard label="Upcoming Events" value={upcoming} icon={CalendarCheck} tone="green" delta={{ value: "12.7%", direction: "up" }} />
        <StatCard label="Total Registrations" value={totalReg.toLocaleString()} icon={Users} tone="amber" delta={{ value: "18.6%", direction: "up" }} />
        <StatCard label="Tickets Sold" value="2,950" icon={Ticket} tone="blue" delta={{ value: "14.2%", direction: "up" }} />
        <StatCard label="Total Revenue" value="$128,450" icon={DollarSign} tone="red" delta={{ value: "21.5%", direction: "up" }} />
      </div>

      <div className="bg-card border border-border rounded-2xl">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">Events List</h2>
        </div>
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-border">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search events by name, venue, or ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EVENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline"><Filter className="size-4 mr-2" /> Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-left font-semibold">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold">Venue</th>
                {user?.role === "admin" && <th className="px-4 py-3 text-left font-semibold">CCN Location</th>}
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Registrations</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const loc = getLocationById(e.locationId);
                return (
                  <tr key={e.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 w-12 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 grid place-items-center text-white text-xs font-bold">
                          {e.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{e.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                    <td className="px-4 py-3">
                      <p>{e.venue}</p>
                      <p className="text-xs text-muted-foreground">{e.city}</p>
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary">
                          {loc.flag} {loc.city}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3"><EventCategoryBadge category={e.category} /></td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{e.registrations.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">/ {e.capacity.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3"><EventStatusBadge status={e.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-8"><Eye className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="size-8"><Pencil className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="size-8"><MoreVertical className="size-4" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-sm text-muted-foreground py-12">No events match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {user?.role === "admin" && (
        <div className="mt-6 bg-card border border-border rounded-2xl p-5">
          <h3 className="text-base font-semibold mb-2">Admin: Tag events to CCN locations</h3>
          <p className="text-sm text-muted-foreground">
            When creating or editing an event, assign it to one of {CCN_LOCATIONS.length} CCN locations so
            members of that location see it on their dashboard.
          </p>
        </div>
      )}
    </>
  );
}

function EventStatusBadge({ status }: { status: CCNEvent["status"] }) {
  const map: Record<CCNEvent["status"], string> = {
    Upcoming: "bg-indigo-100 text-indigo-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-rose-100 text-rose-700",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>{status}</span>;
}

function EventCategoryBadge({ category }: { category: string }) {
  const map: Record<string, string> = {
    "Film Festival": "bg-indigo-100 text-indigo-700",
    "Workshop": "bg-orange-100 text-orange-700",
    "Networking": "bg-amber-100 text-amber-700",
    "Film Screening": "bg-sky-100 text-sky-700",
    "Conference": "bg-emerald-100 text-emerald-700",
    "Industry Event": "bg-emerald-100 text-emerald-700",
    "Panel Discussion": "bg-purple-100 text-purple-700",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${map[category] ?? "bg-secondary"}`}>{category}</span>;
}
