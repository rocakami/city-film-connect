import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Clapperboard, CircleCheck, CircleX, Users, Download, Plus, Search,
  Eye, Pencil, MoreVertical, Filter, RotateCcw, Clock,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveLocation, filterByLocation } from "@/lib/store";
import { FILMS, FILM_CATEGORIES, type FilmSubmission } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/films")({
  component: FilmsPage,
});

function FilmsPage() {
  const { locationId } = useActiveLocation();
  const scoped = filterByLocation(FILMS, locationId);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const counts = {
    total: scoped.length,
    review: scoped.filter((f) => f.status === "Under Review").length,
    accepted: scoped.filter((f) => f.status === "Accepted").length,
    rejected: scoped.filter((f) => f.status === "Rejected").length,
  };

  const filtered = scoped.filter((f) => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
    if (search && !`${f.title} ${f.director} ${f.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Film Submissions"
        subtitle="Manage and review all film submissions."
        actions={
          <>
            <Button variant="outline"><Download className="size-4 mr-2" /> Export</Button>
            <Button><Plus className="size-4 mr-2" /> Add Submission</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Submissions" value={counts.total} icon={Clapperboard} tone="violet" delta={{ value: "15.6%", direction: "up" }} />
        <StatCard label="Under Review" value={counts.review} icon={Clock} tone="green" delta={{ value: "40.2%", direction: "up" }} />
        <StatCard label="Accepted" value={counts.accepted} icon={CircleCheck} tone="amber" delta={{ value: "21.0%", direction: "up" }} />
        <StatCard label="Rejected" value={counts.rejected} icon={CircleX} tone="red" delta={{ value: "20.0%", direction: "up" }} />
        <StatCard label="Categories" value={FILM_CATEGORIES.length} icon={Users} tone="blue" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title, director or ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {FILM_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline"><Filter className="size-4 mr-2" /> Filter</Button>
        <Button variant="ghost" className="text-primary"
          onClick={() => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all"); }}>
          <RotateCcw className="size-4 mr-2" /> Reset
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-semibold">Film</th>
                <th className="px-4 py-3 text-left font-semibold">Director</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Country</th>
                <th className="px-4 py-3 text-left font-semibold">Submitted On</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 w-9 rounded-md bg-gradient-to-br from-primary to-indigo-400 grid place-items-center text-white text-xs font-bold">
                        {f.title.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{f.title}</p>
                        <p className="text-xs text-muted-foreground">ID: {f.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{f.director}</td>
                  <td className="px-4 py-3">{f.category}</td>
                  <td className="px-4 py-3"><span className="mr-2">{f.flag}</span>{f.country}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.submittedOn}</td>
                  <td className="px-4 py-3"><FilmStatusBadge status={f.status} /></td>
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
                <tr><td colSpan={7} className="text-center text-sm text-muted-foreground py-12">No films match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function FilmStatusBadge({ status }: { status: FilmSubmission["status"] }) {
  const map: Record<FilmSubmission["status"], string> = {
    "Under Review": "bg-indigo-100 text-indigo-700",
    Accepted: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
    Withdrawn: "bg-zinc-200 text-zinc-700",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>{status}</span>;
}
