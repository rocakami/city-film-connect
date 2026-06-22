import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users, Building2, Award, DollarSign, TrendingUp, Download, Plus, Search, Filter,
  Eye, Pencil, MoreVertical, Gem, Medal, Shield,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActiveLocation, filterByLocation } from "@/lib/store";
import { SPONSORS, type Sponsor } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/sponsors")({
  component: SponsorsPage,
});

const TIER_STYLES: Record<Sponsor["tier"], string> = {
  Platinum: "bg-indigo-100 text-indigo-700",
  Gold: "bg-amber-100 text-amber-700",
  Silver: "bg-zinc-200 text-zinc-700",
  Bronze: "bg-orange-100 text-orange-700",
};

const PACKAGES = [
  { tier: "Platinum", price: "$25,000", desc: "Premier visibility and exclusive benefits.", count: 5, icon: Gem, color: "text-indigo-600 bg-indigo-50" },
  { tier: "Gold", price: "$15,000", desc: "High visibility and enhanced benefits.", count: 22, icon: Award, color: "text-amber-600 bg-amber-50" },
  { tier: "Silver", price: "$7,500", desc: "Standard visibility and benefits.", count: 28, icon: Medal, color: "text-zinc-600 bg-zinc-100" },
  { tier: "Bronze", price: "$3,000", desc: "Basic visibility and recognition.", count: 18, icon: Shield, color: "text-orange-600 bg-orange-50" },
];

function SponsorsPage() {
  const { locationId } = useActiveLocation();
  const scoped = filterByLocation(SPONSORS, locationId);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const filtered = scoped.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (tierFilter !== "all" && s.tier !== tierFilter) return false;
    if (search && !`${s.name} ${s.email} ${s.contactName}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Sponsors"
        subtitle="Manage and engage with sponsors of the Cinema Cities Network."
        actions={
          <>
            <Button variant="outline"><Download className="size-4 mr-2" /> Export</Button>
            <Button><Plus className="size-4 mr-2" /> Add Sponsor</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Sponsors" value={scoped.length} icon={Users} tone="violet" delta={{ value: "8.3%", direction: "up" }} />
        <StatCard label="Active" value={scoped.filter((s) => s.status === "active").length} icon={Building2} tone="green" delta={{ value: "7.6%", direction: "up" }} />
        <StatCard label="Pending" value={scoped.filter((s) => s.status === "pending").length} icon={Award} tone="amber" delta={{ value: "13.2%", direction: "up" }} />
        <StatCard label="Sponsorship Value" value="$512,450" icon={DollarSign} tone="blue" delta={{ value: "15.4%", direction: "up" }} />
        <StatCard label="Revenue This Year" value="$248,750" icon={TrendingUp} tone="red" delta={{ value: "18.7%", direction: "up" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sponsor Directory</h2>
          </div>
          <div className="p-4 flex flex-wrap items-center gap-3 border-b border-border">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search sponsors…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Tiers" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Filter className="size-4 mr-2" /> Filter</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-semibold">Sponsor</th>
                  <th className="px-4 py-3 text-left font-semibold">Contact</th>
                  <th className="px-4 py-3 text-left font-semibold">Tier</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
                          {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{s.contactName}</p>
                      <p className="text-xs text-muted-foreground">{s.contactRole}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${TIER_STYLES[s.tier]}`}>{s.tier}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        s.status === "active" ? "bg-emerald-100 text-emerald-700" :
                        s.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-zinc-200 text-zinc-700"
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.joinedOn}</td>
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
                  <tr><td colSpan={6} className="text-center text-sm text-muted-foreground py-12">No sponsors match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4">Sponsorship Packages</h2>
          <ul className="space-y-3">
            {PACKAGES.map((p) => (
              <li key={p.tier} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <div className={`size-12 rounded-xl grid place-items-center ${p.color}`}>
                  <p.icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{p.tier} Sponsor</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.desc}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.count} Sponsors</p>
                </div>
                <p className="font-bold text-primary">{p.price}</p>
              </li>
            ))}
          </ul>
          <Button variant="ghost" className="w-full mt-3 text-primary">Manage Packages →</Button>
        </div>
      </div>
    </>
  );
}
