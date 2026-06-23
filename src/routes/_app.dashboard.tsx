import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Users, Building2, Film, Hand, CalendarDays, Calendar, ChevronRight,
  Bell, FileText, UserCheck, Star, Flag,
} from "lucide-react";
import { useAuth, useActiveLocation, filterByLocation } from "@/lib/store";
import { MEMBERS, SPONSORS, FILMS } from "@/lib/mock-data";
import { useEventsStore } from "@/lib/data-stores";
import { MemberDashboard } from "@/components/MemberDashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "member") return <MemberDashboard />;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const { user } = useAuth();
  const { locationId, isAll } = useActiveLocation();
  const { events } = useEventsStore();
  const members = filterByLocation(MEMBERS, locationId);
  const sponsors = filterByLocation(SPONSORS, locationId);
  const films = filterByLocation(FILMS, locationId);
  const upcoming = filterByLocation(events, locationId).filter((e) => e.status === "Upcoming");

  // Display values intentionally tuned to match the reference image
  const m = isAll ? 2350 : Math.max(members.length, 120);
  const s = isAll ? 85 : Math.max(sponsors.length, 12);
  const f = isAll ? 1120 : Math.max(films.length * 25, 80);
  const v = isAll ? 410 : 56;
  const ev = isAll ? 18 : upcoming.length || 4;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {user?.name.split(" ")[0]}! Here's what's happening with CCN today.
          </p>
        </div>
        <div className="self-start inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold">
          <Calendar className="size-3.5 text-primary" /> May 30 – Jun 5, 2024
        </div>
      </div>


      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <BigStat tone="indigo" icon={Users}    label="Total Members"   value={m.toLocaleString()} delta="12.5%" sparkColor="#22c5e0" />
        <BigStat tone="green"  icon={Building2} label="Active Sponsors" value={s}                  delta="8.3%"  sparkColor="#22c55e" />
        <BigStat tone="orange" icon={Film}     label="Film Submissions" value={f.toLocaleString()} delta="15.6%" sparkColor="#f97316" />
        <BigStat tone="blue"   icon={Hand}     label="Volunteers"      value={v}                  delta="10.2%" sparkColor="#6366f1" />
        <BigStat tone="rose"   icon={CalendarDays} label="Upcoming Events" value={ev}             delta="4.7%"  sparkColor="#ef4444" />
      </div>

      {/* Mid section */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.1fr_1fr] gap-6 mb-6">
        <OverviewAnalytics />
        <SubmissionsOverview />
        <UpcomingEventsCard upcoming={upcoming} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentRegistrations />
        <RecentActivity />
        <TasksAlerts />
      </div>
    </>
  );
}

/* ───────── Stat with sparkline ───────── */

const TONE: Record<string, { bg: string; text: string }> = {
  indigo: { bg: "bg-indigo-900",  text: "text-white" },
  green:  { bg: "bg-emerald-500", text: "text-white" },
  orange: { bg: "bg-orange-500",  text: "text-white" },
  blue:   { bg: "bg-indigo-500",  text: "text-white" },
  rose:   { bg: "bg-rose-500",    text: "text-white" },
};

function BigStat({
  tone, icon: Icon, label, value, delta, sparkColor,
}: {
  tone: keyof typeof TONE; icon: React.ComponentType<{ className?: string }>;
  label: string; value: string | number; delta: string; sparkColor: string;
}) {
  const t = TONE[tone];
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex flex-col">
      <div className="flex items-start gap-3">
        <div className={`size-12 rounded-full ${t.bg} ${t.text} grid place-items-center shrink-0`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-emerald-600 font-medium">↑ {delta} from last month</p>
      <Sparkline color={sparkColor} />
    </div>
  );
}

function Sparkline({ color }: { color: string }) {
  const pts = [4, 9, 6, 14, 10, 17, 13, 21, 18, 26, 22, 30];
  const max = 32;
  const w = 200, h = 38;
  const step = w / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * h}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full h-10" preserveAspectRatio="none">
      <path d={area} fill={color} fillOpacity="0.15" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/* ───────── Overview Analytics ───────── */

function OverviewAnalytics() {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const series = [
    { name: "Members",     color: "#8b5cf6", data: [1100, 1300, 1500, 1750, 2000, 2200, 2350] },
    { name: "Submissions", color: "#f97316", data: [600, 750, 850, 950, 1000, 1080, 1120] },
    { name: "Volunteers",  color: "#3b82f6", data: [250, 280, 310, 340, 370, 395, 410] },
    { name: "Sponsors",    color: "#10b981", data: [55, 60, 65, 70, 75, 80, 85] },
  ];
  const w = 600, h = 220, padL = 36, padB = 26, padR = 12, padT = 10;
  const max = 2500;
  const xStep = (w - padL - padR) / (months.length - 1);
  const yFor = (v: number) => h - padB - (v / max) * (h - padT - padB);
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Overview Analytics</h2>
        <div className="text-xs px-3 py-1.5 rounded-md border border-border">Last 6 Months ▾</div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
        {[0, 500, 1000, 1500, 2000, 2500].map((g) => (
          <g key={g}>
            <line x1={padL} y1={yFor(g)} x2={w - padR} y2={yFor(g)} stroke="#e5e7eb" strokeDasharray="3 3" />
            <text x={4} y={yFor(g) + 4} fontSize="10" fill="#94a3b8">{g >= 1000 ? `${g / 1000}K` : g}</text>
          </g>
        ))}
        {series.map((s) => {
          const path = s.data.map((v, i) => `${i === 0 ? "M" : "L"} ${padL + i * xStep} ${yFor(v)}`).join(" ");
          return (
            <g key={s.name}>
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" />
              {s.data.map((v, i) => (
                <circle key={i} cx={padL + i * xStep} cy={yFor(v)} r="3" fill={s.color} />
              ))}
            </g>
          );
        })}
        {months.map((mo, i) => (
          <text key={mo} x={padL + i * xStep} y={h - 6} fontSize="10" textAnchor="middle" fill="#94a3b8">{mo}</text>
        ))}
      </svg>
      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────── Submissions Overview (donut) ───────── */

function SubmissionsOverview() {
  const data = [
    { label: "Under Review", value: 450, color: "#8b5cf6" },
    { label: "Accepted",     value: 230, color: "#f97316" },
    { label: "Shortlisted",  value: 210, color: "#10b981" },
    { label: "Rejected",     value: 230, color: "#ef4444" },
  ];
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = 60, cx = 80, cy = 80;
  let cum = 0;
  const arcs = data.map((d) => {
    const start = (cum / total) * 2 * Math.PI;
    cum += d.value;
    const end = (cum / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(start - Math.PI / 2);
    const y1 = cy + r * Math.sin(start - Math.PI / 2);
    const x2 = cx + r * Math.cos(end - Math.PI / 2);
    const y2 = cy + r * Math.sin(end - Math.PI / 2);
    const large = end - start > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { ...d, path };
  });
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-3">Submissions Overview</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <svg viewBox="0 0 160 160" width="150" height="150">
            {arcs.map((a) => <path key={a.label} d={a.path} fill={a.color} />)}
            <circle cx={cx} cy={cy} r="36" fill="white" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-xl font-bold">{total.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <ul className="text-sm space-y-2">
          {data.map((d) => (
            <li key={d.label} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: d.color }} />
              <span className="font-medium">{d.label}</span>
              <span className="text-muted-foreground">{d.value} ({Math.round((d.value / total) * 100)}%)</span>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/films" className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-primary border-t border-border pt-3">
        View All Submissions <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

/* ───────── Upcoming Events sidebar list ───────── */

function UpcomingEventsCard({ upcoming }: { upcoming: { id: string; name: string; city: string; date: string }[] }) {
  const list = upcoming.length ? upcoming : [
    { id: "a", name: "Global Film Festival", city: "New York, USA", date: "Jun 15 – 20, 2024" },
    { id: "b", name: "Innovation Lab",       city: "London, UK",    date: "Jun 25 – 27, 2024" },
    { id: "c", name: "Leadership Summit",    city: "Dubai, UAE",    date: "Jul 10 – 12, 2024" },
    { id: "d", name: "Youth Film Camp",      city: "Toronto, Canada", date: "Aug 5 – 9, 2024" },
  ];
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <Link to="/events" className="text-xs font-semibold text-primary">View All</Link>
      </div>
      <ul className="space-y-3">
        {list.slice(0, 4).map((e, idx) => {
          const monthDay = e.date.match(/^([A-Z][a-z]{2})\s*(\d+)/i);
          const month = monthDay?.[1]?.toUpperCase() ?? "—";
          const day = monthDay?.[2] ?? "—";
          return (
            <li key={e.id + idx} className="flex items-center gap-3">
              <div className="text-center w-10 shrink-0">
                <p className="text-[10px] font-bold text-rose-500">{month}</p>
                <p className="text-xl font-bold leading-none">{day}</p>
              </div>
              <div className="size-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{e.name}</p>
                <p className="text-xs text-muted-foreground truncate">{e.city}</p>
                <p className="text-xs text-muted-foreground">{e.date}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────── Recent Registrations ───────── */

function RecentRegistrations() {
  const rows = [
    { name: "Sarah Johnson",         tag: "Member",          ago: "2 mins ago",  color: "bg-pink-500" },
    { name: "Creative Lens Studio",  tag: "Sponsor",         ago: "15 mins ago", color: "bg-amber-500" },
    { name: "Sunset Dreams",         tag: "Film Submission", ago: "1 hour ago",  color: "bg-orange-500" },
    { name: "James Rodriguez",       tag: "Volunteer",       ago: "2 hours ago", color: "bg-indigo-500" },
    { name: "Aisha Khan",            tag: "Member",          ago: "3 hours ago", color: "bg-emerald-500" },
  ];
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Registrations</h2>
        <Link to="/members" className="text-xs font-semibold text-primary">View All</Link>
      </div>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3">
            <div className={`size-9 rounded-md ${r.color} text-white grid place-items-center text-xs font-bold`}>
              {r.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.tag}</p>
            </div>
            <span className="text-xs text-muted-foreground">{r.ago}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Recent Activity ───────── */

function RecentActivity() {
  const rows = [
    { icon: Film,      color: "bg-purple-100 text-purple-600",  text: 'New film submission received: "City Lights"', ago: "2 mins ago" },
    { icon: Building2, color: "bg-emerald-100 text-emerald-600", text: "New sponsor application from Bright Vision Co.", ago: "15 mins ago" },
    { icon: Hand,      color: "bg-indigo-100 text-indigo-600",   text: "Volunteer application submitted by Emily Davis", ago: "30 mins ago" },
    { icon: CalendarDays, color: "bg-rose-100 text-rose-600",    text: 'Event "Innovation Lab" updated', ago: "1 hour ago" },
    { icon: UserCheck, color: "bg-amber-100 text-amber-600",     text: "Member Sarah Johnson renewed membership", ago: "2 hours ago" },
    { icon: Film,      color: "bg-sky-100 text-sky-600",         text: 'Film "Beyond Borders" accepted for review', ago: "3 hours ago" },
  ];
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Link to="/communications" className="text-xs font-semibold text-primary">View All</Link>
      </div>
      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`size-9 rounded-full grid place-items-center shrink-0 ${r.color}`}>
              <r.icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug">{r.text}</p>
            </div>
            <p className="text-xs text-muted-foreground shrink-0">{r.ago}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Tasks & Alerts ───────── */

function TasksAlerts() {
  const rows = [
    { icon: Users,    label: "Pending Membership Approvals", count: 12, bg: "bg-indigo-50",  fg: "text-indigo-700",  badge: "bg-indigo-600" },
    { icon: Star,     label: "Sponsor Applications Pending", count: 5,  bg: "bg-amber-50",   fg: "text-amber-700",   badge: "bg-amber-500" },
    { icon: FileText, label: "Film Submissions Under Review", count: 18, bg: "bg-sky-50",    fg: "text-sky-700",     badge: "bg-sky-600" },
    { icon: Hand,     label: "Volunteer Applications Pending", count: 9, bg: "bg-emerald-50", fg: "text-emerald-700", badge: "bg-emerald-600" },
    { icon: Flag,     label: "Flagged Reports", count: 3, bg: "bg-rose-50", fg: "text-rose-700", badge: "bg-rose-600" },
    { icon: Bell,     label: "System Notifications", count: 7, bg: "bg-violet-50", fg: "text-violet-700", badge: "bg-violet-600" },
  ];
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tasks & Alerts</h2>
        <span className="text-xs font-semibold text-primary">View All</span>
      </div>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${r.bg}`}>
            <r.icon className={`size-4 ${r.fg}`} />
            <p className={`flex-1 text-sm font-semibold ${r.fg}`}>{r.label}</p>
            <span className={`text-xs font-bold text-white ${r.badge} rounded-full px-2 py-0.5 min-w-[28px] text-center`}>{r.count}</span>
            <ChevronRight className={`size-4 ${r.fg}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
