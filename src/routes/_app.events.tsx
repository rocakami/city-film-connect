import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar, Users, Ticket, Plus, Search, Filter, MapPin, Check,
  ChevronLeft, ChevronRight, Pencil, Trash2, ExternalLink, X,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useActiveLocation, useAuth } from "@/lib/store";
import { useLocations, useEventsStore, type EventRecord } from "@/lib/data-stores";
import { EVENT_CATEGORIES } from "@/lib/mock-data";
import { useEventRegistrations } from "@/lib/registrations";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/events")({
  component: EventsRoute,
});

function EventsRoute() {
  const { user } = useAuth();
  if (user?.role === "member") return <EventsCardsPage mode="member" />;
  return <EventsCardsPage mode="admin" />;
}

function EventsCardsPage({ mode }: { mode: "admin" | "member" }) {
  const { user } = useAuth();
  const { locationId } = useActiveLocation();
  const { events, add, update, remove } = useEventsStore();
  const { locations, getById } = useLocations();
  const { toggle, isRegistered } = useEventRegistrations(user?.id);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [editing, setEditing] = useState<EventRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<EventRecord | null>(null);

  // Scope: admin sees by active location (all => everything), members see everything
  const scoped = mode === "admin"
    ? (locationId === "all" ? events : events.filter((e) => e.locationId === locationId))
    : events;

  const filtered = scoped.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (location !== "all" && e.locationId !== location) return false;
    if (search && !`${e.name} ${e.venue} ${e.city}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const upcoming = scoped.filter((e) => e.status === "Upcoming");
  const myRegs = upcoming.filter((e) => isRegistered(e.id)).length;
  const cities = new Set(scoped.map((e) => e.city)).size;

  return (
    <>
      <PageHeader
        title="Events"
        subtitle={mode === "admin"
          ? "Create, manage and publish events across the Cinema Cities Network."
          : "Discover and register for events hosted by Cinema Cities Network."}
        actions={mode === "admin" ? (
          <Button onClick={() => setCreating(true)}><Plus className="size-4 mr-2" /> Add Event</Button>
        ) : null}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Upcoming Events" value={upcoming.length} caption={mode === "member" ? `Registered for ${myRegs}` : "Open for registration"} icon={Calendar} tone="blue" />
        <StatCard label={mode === "member" ? "Events Registered" : "Total Events"} value={mode === "member" ? myRegs : scoped.length} caption={mode === "member" ? "View My Registrations" : "All published"} icon={Users} tone="green" />
        <StatCard label="Tickets" value={mode === "member" ? myRegs : scoped.reduce((s, e) => s + e.registrations, 0).toLocaleString()} caption={mode === "member" ? "View My Tickets" : "Total registrations"} icon={Ticket} tone="amber" />
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
                {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.flag} {l.city}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline"><Filter className="size-4 mr-2" /> Filter</Button>
          </div>

          <ul className="divide-y divide-border">
            {filtered.map((e) => {
              const loc = getById(e.locationId);
              const registered = isRegistered(e.id);
              return (
                <li key={e.id} className="p-5 flex flex-col md:flex-row gap-5">
                  <div
                    className="w-full md:w-44 h-32 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 grid place-items-center text-white text-xs font-bold shrink-0 bg-cover bg-center"
                    style={e.imageUrl ? { backgroundImage: `url(${e.imageUrl})` } : undefined}
                  >
                    {!e.imageUrl && e.city}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 mb-1.5">
                      {e.category}
                    </span>
                    <p className="text-lg font-bold">{e.name}</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Calendar className="size-4" /> {e.startDate || e.date}{e.endDate && e.endDate !== e.startDate ? ` – ${e.endDate}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="size-4" /> {e.venue}, {e.city} <span className="text-xs">({loc.flag} {loc.city})</span>
                    </p>
                    {e.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>}
                  </div>
                  <div className="flex flex-col gap-2 md:w-44 shrink-0">
                    {mode === "member" ? (
                      registered ? (
                        <>
                          <span className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md bg-emerald-100 text-emerald-700">
                            <Check className="size-3.5" /> Registered
                          </span>
                          <Button variant="outline" onClick={() => { toggle(e.id); toast.success("Registration cancelled"); }}>
                            <X className="size-4 mr-2" /> Cancel Registration
                          </Button>
                        </>
                      ) : e.status === "Upcoming" ? (
                        <Button onClick={() => { toggle(e.id); toast.success(`Registered for ${e.name}`); }}>
                          <Ticket className="size-4 mr-2" /> Register
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold px-3 py-2 rounded-md bg-secondary text-muted-foreground text-center">
                          {e.status}
                        </span>
                      )
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => setEditing(e)}>
                          <Pencil className="size-4 mr-2" /> Edit
                        </Button>
                        <Button variant="outline" className="text-rose-600 hover:text-rose-700" onClick={() => setConfirmDelete(e)}>
                          <Trash2 className="size-4 mr-2" /> Delete
                        </Button>
                      </>
                    )}
                    {e.registrationLink && (
                      <a href={e.registrationLink} target="_blank" rel="noreferrer"
                        className="text-xs text-primary inline-flex items-center justify-center gap-1">
                        Registration link <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
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
                    <p className="text-[10px] font-bold text-rose-500">{(e.startDate || e.date).slice(0, 3).toUpperCase()}</p>
                    <p className="text-lg font-bold leading-none">{(e.startDate || e.date).match(/\d+/)?.[0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{e.city}</p>
                    <p className="text-xs text-muted-foreground">{e.startDate || e.date}</p>
                  </div>
                </li>
              ))}
              {upcoming.length === 0 && <li className="text-xs text-muted-foreground">No upcoming events.</li>}
            </ul>
          </div>

          <MiniCalendar registeredCount={myRegs} />
        </aside>
      </div>

      {/* Add / Edit dialog */}
      <EventFormDialog
        open={creating || !!editing}
        initial={editing ?? undefined}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSave={(data) => {
          if (editing) { update(editing.id, data); toast.success("Event updated"); }
          else { add(data); toast.success("Event added"); }
          setCreating(false); setEditing(null);
        }}
      />

      {/* Delete confirmation */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete event?</DialogTitle>
            <DialogDescription>
              {confirmDelete?.name} will be removed permanently. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (confirmDelete) { remove(confirmDelete.id); toast.success("Event deleted"); }
              setConfirmDelete(null);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          const day = i - 2;
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
        <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> Open</span>
      </div>
    </div>
  );
}

function EventFormDialog({
  open, initial, onClose, onSave,
}: {
  open: boolean;
  initial?: EventRecord;
  onClose: () => void;
  onSave: (data: Partial<EventRecord>) => void;
}) {
  const { locations } = useLocations();
  const [form, setForm] = useState<Partial<EventRecord>>(initial ?? {
    name: "", startDate: "", endDate: "", venue: "", city: "",
    locationId: locations[0]?.id, category: EVENT_CATEGORIES[0],
    registrationLink: "", description: "", imageUrl: "",
    status: "Upcoming", capacity: 100, registrations: 0,
  });

  // Re-sync when initial changes
  if (open && initial && form !== initial && form.id !== initial.id) {
    setForm(initial);
  }

  const handleImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit event" : "Add event"}</DialogTitle>
          <DialogDescription>
            All fields are visible to members on their Events page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Event Image</Label>
            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-32 h-20 rounded-lg bg-secondary bg-cover bg-center border border-border"
                style={form.imageUrl ? { backgroundImage: `url(${form.imageUrl})` } : undefined}
              />
              <Input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
            </div>
          </div>
          <div>
            <Label>Name *</Label>
            <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start date</Label><Input placeholder="Jun 15, 2024" value={form.startDate ?? ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div><Label>End date</Label><Input placeholder="Jun 20, 2024" value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Venue</Label><Input value={form.venue ?? ""} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
            <div><Label>City</Label><Input value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CCN Location</Label>
              <Select value={form.locationId} onValueChange={(v) => setForm({ ...form, locationId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.flag} {l.city}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EVENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Registration link</Label>
            <Input placeholder="https://…" value={form.registrationLink ?? ""} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })} />
          </div>
          <div>
            <Label>Short description</Label>
            <Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            if (!form.name) { toast.error("Name is required"); return; }
            onSave({
              ...form,
              date: `${form.startDate ?? ""}${form.endDate && form.endDate !== form.startDate ? ` – ${form.endDate}` : ""}`,
            });
          }}>{initial ? "Save changes" : "Add event"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
