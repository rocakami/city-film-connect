import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users, Building2, Clock, UserX, Download, Plus, Search,
  Eye, Pencil, MoreVertical, Filter, RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveLocation, filterByLocation } from "@/lib/store";
import { MEMBERS, type Status } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/members")({
  component: MembersPage,
});

function MembersPage() {
  const { locationId } = useActiveLocation();
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const scoped = filterByLocation(MEMBERS, locationId);

  const counts = useMemo(() => ({
    total: scoped.length,
    active: scoped.filter((m) => m.status === "active").length,
    pending: scoped.filter((m) => m.status === "pending").length,
    inactive: scoped.filter((m) => m.status === "inactive").length,
  }), [scoped]);

  const filtered = scoped.filter((m) => {
    if (tab !== "all" && m.status !== tab) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (planFilter !== "all" && m.plan !== planFilter) return false;
    if (search && !`${m.name} ${m.email} ${m.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Members"
        subtitle="Manage and view all registered members in the Cinema Cities Network."
        actions={
          <>
            <Button variant="outline"><Download className="size-4 mr-2" /> Export</Button>
            <Button><Plus className="size-4 mr-2" /> Add Member</Button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-6">
          {[
            { v: "all", label: "All Members" },
            { v: "active", label: "Active Members" },
            { v: "inactive", label: "Inactive Members" },
            { v: "pending", label: "Pending Approval" },
            { v: "blocked", label: "Blocked Members" },
          ].map((t) => (
            <TabsTrigger key={t.v} value={t.v}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent px-0 pb-3 text-sm font-medium">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Members" value={counts.total.toLocaleString()} icon={Users} tone="violet"
          delta={{ value: "12.5%", direction: "up" }} />
        <StatCard label="Active Members" value={counts.active.toLocaleString()} icon={Building2} tone="green"
          delta={{ value: "10.3%", direction: "up" }} />
        <StatCard label="Pending Approval" value={counts.pending} icon={Clock} tone="amber"
          delta={{ value: "5.6%", direction: "up" }} />
        <StatCard label="Inactive Members" value={counts.inactive} icon={UserX} tone="red"
          delta={{ value: "3.1%", direction: "down" }} />
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, email or ID…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Membership Plans" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Membership Plans</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Individual">Individual</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Organization">Organization</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline"><Filter className="size-4 mr-2" /> Filter</Button>
        <Button variant="ghost" className="text-primary"
          onClick={() => { setSearch(""); setPlanFilter("all"); setStatusFilter("all"); setTab("all"); }}>
          <RotateCcw className="size-4 mr-2" /> Reset
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3 w-10"><input type="checkbox" /></th>
                <th className="px-4 py-3 text-left font-semibold">Member</th>
                <th className="px-4 py-3 text-left font-semibold">Membership Plan</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Country</th>
                <th className="px-4 py-3 text-left font-semibold">Joined On</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-semibold">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {m.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{m.plan}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                  <td className="px-4 py-3"><span className="mr-2">{m.flag}</span>{m.country}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.joinedOn}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-8"><Eye className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="size-8"><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="size-8"><MoreVertical className="size-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-sm text-muted-foreground py-12">No members match the filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {scoped.length} members</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="default" size="sm" className="size-8 p-0">1</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-rose-100 text-rose-700",
    pending: "bg-amber-100 text-amber-700",
    blocked: "bg-zinc-200 text-zinc-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status]}`}>
      {status}
    </span>
  );
}
