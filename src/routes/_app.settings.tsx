import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save, Pencil, Mail, Phone, MapPin, User as UserIcon, Calendar } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/store";
import { useLocations, usePermissions, MODULES, type LocationDetails } from "@/lib/data-stores";
import { FILM_CATEGORIES, EVENT_CATEGORIES } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { locations, publicLocations } = useLocations();
  const isAdmin = user?.role === "admin";

  const [filmCats, setFilmCats] = useState<string[]>(FILM_CATEGORIES);
  const [eventCats, setEventCats] = useState<string[]>(EVENT_CATEGORIES);
  const [newFilmCat, setNewFilmCat] = useState("");
  const [newEventCat, setNewEventCat] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    country: user?.country ?? "",
    bio: user?.bio ?? "",
    primaryLocationId: user?.primaryLocationId ?? "miami",
  });

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your system preferences, configurations, and account settings." />

      <Tabs defaultValue={isAdmin ? "general" : "profile"}>
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-6 mb-6 flex-wrap">
          {(isAdmin
            ? ["general", "profile", "categories", "locations", "user-profile", "notifications", "security"]
            : ["profile", "notifications", "security"]
          ).map((v) => (
            <TabsTrigger key={v} value={v}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent px-0 pb-3 text-sm font-medium capitalize">
              {v.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        {isAdmin && (
          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SCard title="General Settings" desc="Manage your organization's basic information and preferences.">
                <Field label="Organization Name"><Input defaultValue="Cinema Cities Network" /></Field>
                <Field label="Tagline"><Input defaultValue="Global Unity Through Storytelling" /></Field>
                <Field label="Description"><Textarea rows={4} defaultValue="Cinema Cities Network (CCN) is a global platform dedicated to uniting filmmakers, storytellers, and audiences through the power of film, technology, and the human voice." /></Field>
                <Button onClick={() => toast.success("General settings saved")}><Save className="size-4 mr-2" /> Save Changes</Button>
              </SCard>
              <SCard title="Site Settings" desc="Configure your website and system preferences.">
                <ToggleRow label="Enable Public Registration" desc="Allow new users to register on the platform" defaultChecked />
                <ToggleRow label="Enable Email Notifications" desc="Send system notifications via email" defaultChecked />
                <ToggleRow label="Enable SMS Notifications" desc="Send important alerts via SMS" />
                <ToggleRow label="Enable Maintenance Mode" desc="Temporarily disable public access to the site" />
              </SCard>
            </div>
          </TabsContent>
        )}

        <TabsContent value="profile">
          <SCard title="My Profile" desc="Update your personal information.">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
              <Field label="Email"><Input value={profile.email} disabled /></Field>
              <Field label="Phone"><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></Field>
              <Field label="Country"><Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} /></Field>
            </div>
            <Field label="Primary CCN Location">
              <Select value={profile.primaryLocationId} onValueChange={(v) => setProfile({ ...profile, primaryLocationId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {(isAdmin ? locations : publicLocations).map((l) => <SelectItem key={l.id} value={l.id}>{l.flag} {l.city} — {l.country}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Bio"><Textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></Field>
            <Button onClick={() => { updateUser(profile); toast.success("Profile updated"); }}>
              <Save className="size-4 mr-2" /> Save Profile
            </Button>
          </SCard>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SCard title="Film Categories" desc="Categories used when submitting and reviewing films.">
                <CategoryList items={filmCats} onRemove={(c) => setFilmCats(filmCats.filter((x) => x !== c))} />
                <div className="flex gap-2">
                  <Input placeholder="New category…" value={newFilmCat} onChange={(e) => setNewFilmCat(e.target.value)} />
                  <Button onClick={() => { if (newFilmCat.trim()) { setFilmCats([...filmCats, newFilmCat.trim()]); setNewFilmCat(""); toast.success("Added"); } }}>
                    <Plus className="size-4 mr-1" /> Add
                  </Button>
                </div>
              </SCard>
              <SCard title="Event Categories" desc="Categories used when creating events.">
                <CategoryList items={eventCats} onRemove={(c) => setEventCats(eventCats.filter((x) => x !== c))} />
                <div className="flex gap-2">
                  <Input placeholder="New category…" value={newEventCat} onChange={(e) => setNewEventCat(e.target.value)} />
                  <Button onClick={() => { if (newEventCat.trim()) { setEventCats([...eventCats, newEventCat.trim()]); setNewEventCat(""); toast.success("Added"); } }}>
                    <Plus className="size-4 mr-1" /> Add
                  </Button>
                </div>
              </SCard>
            </div>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="locations">
            <LocationsManager />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="user-profile">
            <PermissionsManager />
          </TabsContent>
        )}

        <TabsContent value="notifications">
          <SCard title="Notification Preferences" desc="Control how you receive updates.">
            <ToggleRow label="Email — New events in my location" defaultChecked />
            <ToggleRow label="Email — Film submission decisions" defaultChecked />
            <ToggleRow label="Email — Sponsor announcements" />
            <ToggleRow label="In-app — All activity" defaultChecked />
          </SCard>
        </TabsContent>

        <TabsContent value="security">
          <SCard title="Security" desc="Manage password and sessions.">
            <Field label="Current Password"><Input type="password" /></Field>
            <Field label="New Password"><Input type="password" /></Field>
            <Field label="Confirm New Password"><Input type="password" /></Field>
            <Button onClick={() => toast.success("Password updated")}>Update Password</Button>
          </SCard>
        </TabsContent>
      </Tabs>
    </>
  );
}

/* ───────────── Locations Manager ───────────── */

function LocationsManager() {
  const { locations, add, update, remove } = useLocations();
  const [editing, setEditing] = useState<LocationDetails | null>(null);
  const [opening, setOpening] = useState<LocationDetails | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<LocationDetails | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">CCN Locations</h2>
            <p className="text-sm text-muted-foreground">Cities in the Cinema Cities Network partnership.
              Only <strong>Selected</strong> and <strong>Future</strong> locations show up on signup; <strong>In Development</strong> locations are hidden.</p>
          </div>
          <Button onClick={() => setCreating(true)}><Plus className="size-4 mr-2" /> Add Location</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {locations.map((l) => (
            <button
              key={l.id}
              onClick={() => setOpening(l)}
              className="text-left border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/40 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{l.country}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                  l.status === "selected" ? "bg-sky-100 text-sky-700" :
                  l.status === "in_development" ? "bg-amber-100 text-amber-700" :
                  "bg-zinc-200 text-zinc-700"
                }`}>
                  {l.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-xl font-bold tracking-tight uppercase">{l.flag} {l.city}</p>
              {l.contactPerson && <p className="text-xs text-muted-foreground mt-2 truncate"><UserIcon className="size-3 inline mr-1" />{l.contactPerson}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!opening} onOpenChange={(o) => !o && setOpening(null)}>
        <DialogContent>
          {opening && (
            <>
              <DialogHeader>
                <DialogTitle>{opening.flag} {opening.city} — {opening.country}</DialogTitle>
                <DialogDescription>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    opening.status === "selected" ? "bg-sky-100 text-sky-700" :
                    opening.status === "in_development" ? "bg-amber-100 text-amber-700" :
                    "bg-zinc-200 text-zinc-700"
                  }`}>{opening.status.replace("_", " ")}</span>
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><Calendar className="size-4 text-muted-foreground" /> Active since: <strong>{opening.startDate || "—"}</strong></li>
                <li className="flex gap-2"><MapPin className="size-4 text-muted-foreground" /> {opening.address || "—"}</li>
                <li className="flex gap-2"><Phone className="size-4 text-muted-foreground" /> {opening.phone || "—"}</li>
                <li className="flex gap-2"><Mail className="size-4 text-muted-foreground" /> {opening.email || "—"}</li>
                <li className="flex gap-2"><UserIcon className="size-4 text-muted-foreground" /> Contact: <strong>{opening.contactPerson || "—"}</strong></li>
              </ul>
              <DialogFooter>
                <Button variant="outline" className="text-rose-600" onClick={() => { setConfirmDelete(opening); setOpening(null); }}>
                  <Trash2 className="size-4 mr-2" /> Delete
                </Button>
                <Button onClick={() => { setEditing(opening); setOpening(null); }}>
                  <Pencil className="size-4 mr-2" /> Edit
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <LocationForm
        open={creating || !!editing}
        initial={editing ?? undefined}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSave={(data) => {
          if (editing) { update(editing.id, data); toast.success("Location updated"); }
          else { add(data as Omit<LocationDetails, "id">); toast.success("Location added"); }
          setCreating(false); setEditing(null);
        }}
      />

      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete location?</DialogTitle>
            <DialogDescription>
              {confirmDelete?.city} will be removed. Existing data tagged to it will keep its location ID but no longer match a known location.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (confirmDelete) { remove(confirmDelete.id); toast.success("Location deleted"); }
              setConfirmDelete(null);
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LocationForm({
  open, initial, onClose, onSave,
}: {
  open: boolean;
  initial?: LocationDetails;
  onClose: () => void;
  onSave: (data: Partial<LocationDetails>) => void;
}) {
  const [form, setForm] = useState<Partial<LocationDetails>>(initial ?? {
    city: "", country: "", flag: "🌐", status: "selected",
    startDate: "", address: "", phone: "", email: "", contactPerson: "",
  });
  if (open && initial && form.id !== initial.id) setForm(initial);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit location" : "Add location"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City *"><Input value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
          <Field label="Country *"><Input value={form.country ?? ""} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label="Flag emoji"><Input value={form.flag ?? ""} onChange={(e) => setForm({ ...form, flag: e.target.value })} /></Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LocationDetails["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="selected">Selected (live)</SelectItem>
                <SelectItem value="in_development">In Development (hidden on signup)</SelectItem>
                <SelectItem value="future">Future</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Start date"><Input placeholder="Jan 1, 2024" value={form.startDate ?? ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <div className="col-span-2"><Field label="Address"><Input value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field></div>
          <Field label="Email"><Input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Contact person"><Input value={form.contactPerson ?? ""} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            if (!form.city || !form.country) { toast.error("City and country are required"); return; }
            onSave(form);
          }}>{initial ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ───────────── Permissions Manager (User Profile tab) ───────────── */

function PermissionsManager() {
  const { perms, setPerm } = usePermissions();
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold">User Profile Permissions</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Choose which modules each role can access. Disabled modules will be hidden from the sidebar for that role.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Module</th>
              <th className="px-4 py-3 text-center">Admin</th>
              <th className="px-4 py-3 text-center">Member</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => (
              <tr key={m.key} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{m.label}</td>
                <td className="px-4 py-3 text-center">
                  <Switch checked={perms.admin[m.key]} onCheckedChange={(v) => setPerm("admin", m.key, v)} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Switch checked={perms.member[m.key]} onCheckedChange={(v) => setPerm("member", m.key, v)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────── helpers ───────────── */

function SCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, defaultChecked }: { label: string; desc?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div>
        <p className="font-medium text-sm">{label}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function CategoryList({ items, onRemove }: { items: string[]; onRemove: (c: string) => void }) {
  return (
    <ul className="space-y-2 mb-3">
      {items.map((c) => (
        <li key={c} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary">
          <span className="text-sm font-medium">{c}</span>
          <Button variant="ghost" size="icon" className="size-7" onClick={() => onRemove(c)}>
            <Trash2 className="size-4 text-rose-600" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
