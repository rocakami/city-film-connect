import { createFileRoute } from "@tanstack/react-router";
import { Users, Handshake, Film, Calendar, TrendingUp, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuth, useActiveLocation, filterByLocation } from "@/lib/store";
import { MEMBERS, SPONSORS, FILMS, EVENTS } from "@/lib/mock-data";
import { getLocationById } from "@/lib/locations";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { locationId, location, isAll } = useActiveLocation();

  const members = filterByLocation(MEMBERS, locationId);
  const sponsors = filterByLocation(SPONSORS, locationId);
  const films = filterByLocation(FILMS, locationId);
  const events = filterByLocation(EVENTS, locationId);

  const upcoming = events.filter((e) => e.status === "Upcoming");
  const recentFilms = films.slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        subtitle={
          isAll
            ? "Viewing all CCN locations across the global network."
            : `Viewing ${location?.flag} ${location?.city} — ${location?.country}`
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Members" value={members.length.toLocaleString()} icon={Users} tone="violet"
          delta={{ value: "12.5%", direction: "up" }} />
        <StatCard label="Sponsors" value={sponsors.length} icon={Handshake} tone="green"
          delta={{ value: "8.3%", direction: "up" }} />
        <StatCard label="Film Submissions" value={films.length} icon={Film} tone="amber"
          delta={{ value: "15.6%", direction: "up" }} />
        <StatCard label="Upcoming Events" value={upcoming.length} icon={Calendar} tone="blue"
          delta={{ value: "5.2%", direction: "up" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Badge variant="secondary"><TrendingUp className="size-3 mr-1" /> Live</Badge>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No upcoming events for this location.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.slice(0, 5).map((e) => (
                <li key={e.id} className="py-3 flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <Calendar className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.date} • {e.venue}, {e.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{e.registrations}</p>
                    <p className="text-xs text-muted-foreground">of {e.capacity}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Films</h2>
            <Activity className="size-4 text-muted-foreground" />
          </div>
          <ul className="space-y-3">
            {recentFilms.map((f) => (
              <li key={f.id} className="flex items-center gap-3">
                <div className="size-9 rounded-md bg-secondary grid place-items-center">
                  <Film className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.director} • {getLocationById(f.locationId).city}</p>
                </div>
                <StatusPill status={f.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Under Review": "bg-indigo-100 text-indigo-700",
    Accepted: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
    Withdrawn: "bg-zinc-200 text-zinc-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? "bg-secondary"}`}>
      {status}
    </span>
  );
}
