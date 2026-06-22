import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, CCN_LOCATIONS } from "@/lib/store";
import { FILM_CATEGORIES, EVENT_CATEGORIES } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateUser } = useAuth();
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

      <Tabs defaultValue="general">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-6 mb-6">
          {(isAdmin
            ? ["general", "profile", "categories", "locations", "notifications", "security"]
            : ["profile", "notifications", "security"]
          ).map((v) => (
            <TabsTrigger key={v} value={v}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none bg-transparent px-0 pb-3 text-sm font-medium capitalize">
              {v}
            </TabsTrigger>
          ))}
        </TabsList>

        {isAdmin && (
          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="General Settings" desc="Manage your organization's basic information and preferences.">
                <Field label="Organization Name"><Input defaultValue="Cinema Cities Network" /></Field>
                <Field label="Tagline"><Input defaultValue="Global Unity Through Storytelling" /></Field>
                <Field label="Description"><Textarea rows={4} defaultValue="Cinema Cities Network (CCN) is a global platform dedicated to uniting filmmakers, storytellers, and audiences through the power of film, technology, and the human voice." /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Default Timezone">
                    <Select defaultValue="est"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">(UTC-05:00) Eastern Time</SelectItem>
                        <SelectItem value="pst">(UTC-08:00) Pacific Time</SelectItem>
                        <SelectItem value="gmt">(UTC+00:00) GMT</SelectItem>
                        <SelectItem value="cet">(UTC+01:00) CET</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Currency">
                    <Select defaultValue="usd"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                        <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                        <SelectItem value="gbp">GBP - Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Button onClick={() => toast.success("General settings saved")}><Save className="size-4 mr-2" /> Save Changes</Button>
              </Card>

              <Card title="Site Settings" desc="Configure your website and system preferences.">
                <ToggleRow label="Enable Public Registration" desc="Allow new users to register on the platform" defaultChecked />
                <ToggleRow label="Enable Email Notifications" desc="Send system notifications via email" defaultChecked />
                <ToggleRow label="Enable SMS Notifications" desc="Send important alerts via SMS" />
                <ToggleRow label="Enable Maintenance Mode" desc="Temporarily disable public access to the site" />
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="profile">
          <Card title="My Profile" desc="Update your personal information.">
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
                  {CCN_LOCATIONS.map((l) => <SelectItem key={l.id} value={l.id}>{l.flag} {l.city} — {l.country}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Bio"><Textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></Field>
            <Button onClick={() => { updateUser(profile); toast.success("Profile updated"); }}>
              <Save className="size-4 mr-2" /> Save Profile
            </Button>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Film Categories" desc="Categories used when submitting and reviewing films.">
                <CategoryList items={filmCats} onRemove={(c) => setFilmCats(filmCats.filter((x) => x !== c))} />
                <div className="flex gap-2">
                  <Input placeholder="New category…" value={newFilmCat} onChange={(e) => setNewFilmCat(e.target.value)} />
                  <Button onClick={() => { if (newFilmCat.trim()) { setFilmCats([...filmCats, newFilmCat.trim()]); setNewFilmCat(""); toast.success("Added"); } }}>
                    <Plus className="size-4 mr-1" /> Add
                  </Button>
                </div>
              </Card>
              <Card title="Event Categories" desc="Categories used when creating events.">
                <CategoryList items={eventCats} onRemove={(c) => setEventCats(eventCats.filter((x) => x !== c))} />
                <div className="flex gap-2">
                  <Input placeholder="New category…" value={newEventCat} onChange={(e) => setNewEventCat(e.target.value)} />
                  <Button onClick={() => { if (newEventCat.trim()) { setEventCats([...eventCats, newEventCat.trim()]); setNewEventCat(""); toast.success("Added"); } }}>
                    <Plus className="size-4 mr-1" /> Add
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="locations">
            <Card title="CCN Locations" desc="Cities in the Cinema Cities Network partnership development pipeline.">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CCN_LOCATIONS.map((l) => (
                  <div key={l.id} className="border border-border rounded-xl p-4">
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
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="notifications">
          <Card title="Notification Preferences" desc="Control how you receive updates.">
            <ToggleRow label="Email — New events in my location" defaultChecked />
            <ToggleRow label="Email — Film submission decisions" defaultChecked />
            <ToggleRow label="Email — Sponsor announcements" />
            <ToggleRow label="In-app — All activity" defaultChecked />
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card title="Security" desc="Manage password and sessions.">
            <Field label="Current Password"><Input type="password" /></Field>
            <Field label="New Password"><Input type="password" /></Field>
            <Field label="Confirm New Password"><Input type="password" /></Field>
            <Button onClick={() => toast.success("Password updated")}>Update Password</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
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
