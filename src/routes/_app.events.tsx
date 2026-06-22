import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar, CalendarCheck, Users, Ticket, DollarSign, Download, Plus, Search, Filter,
  Eye, Pencil, MoreVertical,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveLocation, filterByLocation, useAuth } from "@/lib/store";
import { EVENTS, EVENT_CATEGORIES, type CCNEvent } from "@/lib/mock-data";
import { getLocationById } from "@/lib/locations";
import { CCN_LOCATIONS } from "@/lib/locations";

export const Route = createFileRoute("/_app/events")({
  component: EventsPage,
});

function EventsPage() {
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
