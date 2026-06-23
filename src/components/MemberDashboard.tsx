import { Link } from "@tanstack/react-router";
import {
  Users, CircleCheck, Hourglass, Calendar, Ticket, ChevronRight,
  Film, BadgeCheck, Headphones, User as UserIcon, Megaphone,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/lib/store";
import { FILMS } from "@/lib/mock-data";
import { useEventsStore } from "@/lib/data-stores";
import { useEventRegistrations } from "@/lib/registrations";

export function MemberDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const myFilms = FILMS.filter((f) => f.submittedBy === user.email);
  const accepted = myFilms.filter((f) => f.status === "Accepted").length;
  const pending = myFilms.filter((f) => f.status === "Under Review").length;

  const { regs, isRegistered } = useEventRegistrations(user.id);
  const { events } = useEventsStore();
  const upcoming = events.filter((e) => e.status === "Upcoming");
  const myUpcoming = upcoming.filter((e) => regs.has(e.id));
  const recent = myFilms[0];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            Welcome back, {user.name.split(" ")[0]}! <span aria-hidden>👋</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="self-start text-xs font-semibold px-3 py-2 rounded-lg bg-card border border-border flex items-center gap-2">
          <Calendar className="size-3.5 text-primary" /> May 30 – Jun 5, 2024
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="My Submissions" value={myFilms.length} caption="Total Submissions"
          icon={Users} tone="violet" delta={{ value: "1 new this month", direction: "up" }} />
        <StatCard label="Accepted" value={accepted} caption="Submission Accepted"
          icon={CircleCheck} tone="green" delta={{ value: "100% from last month", direction: "up" }} />
        <StatCard label="Pending" value={pending} caption="Under Review"
          icon={Hourglass} tone="amber" delta={{ value: "33.3% from last month", direction: "down" }} />
        <StatCard label="Events Registered" value={myUpcoming.length} caption="Upcoming Events"
          icon={Calendar} tone="blue" delta={{ value: "1 new this month", direction: "up" }} />
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Membership Status</p>
              <p className="text-2xl font-bold mt-1">Active</p>
              <p className="text-xs text-muted-foreground mt-0.5">Premium Member</p>
            </div>
            <div className="size-11 rounded-full bg-rose-100 text-rose-600 grid place-items-center">
              <Ticket className="size-5" />
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-emerald-600">Valid until Dec 31, 2024</p>
        </div>
      </div>

      {/* Mid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-base font-semibold mb-4">Submission Status</p>
          <div className="flex items-center gap-6">
            <DonutChart total={myFilms.length} accepted={accepted} pending={pending} />
            <ul className="text-sm space-y-2 flex-1">
              <Row color="bg-indigo-500" label="Under Review" v={pending} total={myFilms.length} />
              <Row color="bg-emerald-500" label="Accepted" v={accepted} total={myFilms.length} />
              <Row color="bg-amber-500" label="Shortlisted" v={0} total={myFilms.length} />
              <Row color="bg-rose-500" label="Rejected" v={0} total={myFilms.length} />
            </ul>
          </div>
          <Link to="/films" className="mt-5 flex items-center justify-center gap-1 text-sm font-semibold text-primary border-t border-border pt-4">
            View My Submissions <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-base font-semibold mb-4">Recent Submission</p>
          {recent ? (
            <div className="flex gap-4">
              <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-indigo-700 to-slate-900 grid place-items-center text-white text-xs font-bold shrink-0">
                {recent.title}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{recent.title}</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {recent.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{recent.category}</p>
                <p className="text-xs text-muted-foreground mt-1">Submitted on {recent.submittedOn}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{recent.synopsis}</p>
                <Link to="/films" className="mt-3 inline-flex text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground">
                  View Details
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold">Upcoming Events</p>
            <Link to="/events" className="text-xs font-semibold text-primary">View All</Link>
          </div>
          <ul className="space-y-3">
            {upcoming.slice(0, 3).map((e) => (
              <li key={e.id} className="flex gap-3">
                <div className="text-center px-2">
                  <p className="text-[10px] font-bold text-rose-500">{e.date.slice(0, 3).toUpperCase()}</p>
                  <p className="text-lg font-bold leading-none">{e.date.match(/\d+/)?.[0]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.city}</p>
                  <p className="text-xs text-muted-foreground">{e.date}</p>
                  <p className={`mt-1 text-[10px] font-semibold ${isRegistered(e.id) ? "text-emerald-600" : "text-amber-600"}`}>
                    {isRegistered(e.id) ? "✓ Registered" : "○ Open"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Volunteer banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="size-12 rounded-xl bg-white/10 grid place-items-center shrink-0">
            <Megaphone className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold">Volunteer Opportunities Available!</p>
            <p className="text-sm text-white/70">Make a difference by volunteering at upcoming events.</p>
          </div>
        </div>
        <button className="shrink-0 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm font-semibold">
          View Opportunities
        </button>
      </div>


      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-base font-semibold mb-4">Membership Overview</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="size-11 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">
              <BadgeCheck className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Premium Member</p>
              <p className="text-xs text-muted-foreground">Valid until Dec 31, 2024</p>
            </div>
          </div>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
          <Link to="/membership" className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-primary border-t border-border pt-4">
            Manage Membership <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold">Recent Activity</p>
            <Link to="/communications" className="text-xs font-semibold text-primary">View All</Link>
          </div>
          <ul className="space-y-3 text-sm">
            <ActivityRow color="bg-indigo-100 text-indigo-600" icon={Film} text={`Your film "${recent?.title ?? "—"}" has been submitted successfully.`} time="2 days ago" />
            <ActivityRow color="bg-emerald-100 text-emerald-600" icon={BadgeCheck} text="Your membership has been renewed." time="5 days ago" />
            <ActivityRow color="bg-sky-100 text-sky-600" icon={Calendar} text="You registered for Global Film Festival 2024." time="1 week ago" />
            <ActivityRow color="bg-amber-100 text-amber-600" icon={UserIcon} text="Your profile information was updated." time="2 weeks ago" />
          </ul>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-base font-semibold mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction icon={Film} label="Submit a Film" to="/films" />
            <QuickAction icon={Calendar} label="Browse Events" to="/events" />
            <QuickAction icon={UserIcon} label="Update Profile" to="/settings" />
            <QuickAction icon={Headphones} label="Contact Support" to="/communications" />
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ color, label, v, total }: { color: string; label: string; v: number; total: number }) {
  const pct = total ? Math.round((v / total) * 1000) / 10 : 0;
  return (
    <li className="flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${color}`} />
      <span className="flex-1">{label}</span>
      <span className="font-semibold">{v}</span>
      <span className="text-xs text-muted-foreground w-14 text-right">({pct}%)</span>
    </li>
  );
}

function DonutChart({ total, accepted, pending }: { total: number; accepted: number; pending: number }) {
  const r = 40, c = 2 * Math.PI * r;
  const p = total || 1;
  const seg = (n: number) => (n / p) * c;
  return (
    <div className="relative">
      <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth="14" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(238 70% 60%)" strokeWidth="14"
          strokeDasharray={`${seg(pending)} ${c}`} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(150 60% 45%)" strokeWidth="14"
          strokeDasharray={`${seg(accepted)} ${c}`} strokeDashoffset={-seg(pending)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="text-2xl font-bold leading-none">{total}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
}

type IconCmp = React.ComponentType<{ className?: string }>;

function ActivityRow({ color, icon: Icon, text, time }: { color: string; icon: IconCmp; text: string; time: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className={`size-8 rounded-full grid place-items-center shrink-0 ${color}`}>
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="leading-snug">{text}</p>
      </div>
      <p className="text-xs text-muted-foreground shrink-0">{time}</p>
    </li>
  );
}

function QuickAction({ icon: Icon, label, to }: { icon: IconCmp; label: string; to: string }) {
  return (
    <Link to={to as never} className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
      <Icon className="size-4 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
