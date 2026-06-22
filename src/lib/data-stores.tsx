import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CCN_LOCATIONS, type CCNLocation } from "./locations";
import { EVENTS as SEED_EVENTS, type CCNEvent } from "./mock-data";

/* ───────────────────────── Locations ───────────────────────── */

export interface LocationDetails extends CCNLocation {
  startDate?: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
}

const LOC_KEY = "ccn.locations.v1";

const SEED_LOC_DETAILS: LocationDetails[] = CCN_LOCATIONS.map((l) => ({
  ...l,
  startDate: l.status === "selected" ? "Jan 1, 2023" : l.status === "in_development" ? "—" : "TBD",
  address: `${l.city} Cultural Center, ${l.country}`,
  phone: "+1 (555) 000-0000",
  email: `${l.id}@ccn.org`,
  contactPerson: `${l.city} Program Lead`,
}));

interface LocationsCtx {
  locations: LocationDetails[];
  publicLocations: LocationDetails[]; // selectable on signup (no in_development)
  getById: (id: string) => LocationDetails;
  add: (l: Omit<LocationDetails, "id"> & { id?: string }) => void;
  update: (id: string, patch: Partial<LocationDetails>) => void;
  remove: (id: string) => void;
}

const LocCtx = createContext<LocationsCtx | null>(null);

/* ───────────────────────── Events ───────────────────────── */

export interface EventRecord extends CCNEvent {
  startDate?: string;
  endDate?: string;
  registrationLink?: string;
  description?: string;
  imageUrl?: string;
}

const EVT_KEY = "ccn.events.v1";

const SEED_EVT: EventRecord[] = SEED_EVENTS.map((e) => ({
  ...e,
  startDate: e.date.split("–")[0]?.trim() ?? e.date,
  endDate: e.date.split("–")[1]?.trim() ?? e.date,
  registrationLink: `https://ccn.org/events/${e.id.toLowerCase()}`,
  description: `Join us for ${e.name} — a flagship ${e.category.toLowerCase()} in ${e.city}.`,
  imageUrl: "",
}));

interface EventsCtx {
  events: EventRecord[];
  getById: (id: string) => EventRecord | undefined;
  add: (e: Omit<EventRecord, "id"> & { id?: string }) => EventRecord;
  update: (id: string, patch: Partial<EventRecord>) => void;
  remove: (id: string) => void;
}

const EvtCtx = createContext<EventsCtx | null>(null);

/* ───────────────────────── Permissions ───────────────────────── */

export const MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "members", label: "Members" },
  { key: "sponsors", label: "Sponsors" },
  { key: "films", label: "Submitted Films" },
  { key: "events", label: "Events" },
  { key: "settings", label: "Settings" },
  { key: "communications", label: "Communications" },
  { key: "membership", label: "Membership" },
  { key: "resources", label: "Resources" },
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];
export type RolePerms = Record<ModuleKey, boolean>;

const PERMS_KEY = "ccn.permissions.v1";

const SEED_PERMS: { admin: RolePerms; member: RolePerms } = {
  admin: Object.fromEntries(MODULES.map((m) => [m.key, true])) as RolePerms,
  member: {
    dashboard: true, members: false, sponsors: false, films: true,
    events: true, settings: true, communications: true, membership: true, resources: true,
  },
};

interface PermsCtx {
  perms: { admin: RolePerms; member: RolePerms };
  setPerm: (role: "admin" | "member", key: ModuleKey, value: boolean) => void;
}

const PermCtx = createContext<PermsCtx | null>(null);

/* ───────────────────────── Provider ───────────────────────── */

function loadLS<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed;
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

export function DataStoresProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<LocationDetails[]>(SEED_LOC_DETAILS);
  const [events, setEvents] = useState<EventRecord[]>(SEED_EVT);
  const [perms, setPerms] = useState(SEED_PERMS);

  useEffect(() => {
    setLocations(loadLS(LOC_KEY, SEED_LOC_DETAILS));
    setEvents(loadLS(EVT_KEY, SEED_EVT));
    setPerms(loadLS(PERMS_KEY, SEED_PERMS));
  }, []);

  const persistLoc = (next: LocationDetails[]) => {
    setLocations(next);
    localStorage.setItem(LOC_KEY, JSON.stringify(next));
  };
  const persistEvt = (next: EventRecord[]) => {
    setEvents(next);
    localStorage.setItem(EVT_KEY, JSON.stringify(next));
  };
  const persistPerms = (next: typeof SEED_PERMS) => {
    setPerms(next);
    localStorage.setItem(PERMS_KEY, JSON.stringify(next));
  };

  const locCtx: LocationsCtx = {
    locations,
    publicLocations: locations.filter((l) => l.status !== "in_development"),
    getById: (id) => locations.find((l) => l.id === id) ?? locations[0],
    add: (l) => {
      const id = l.id ?? `loc-${Date.now()}`;
      persistLoc([...locations, { ...l, id } as LocationDetails]);
    },
    update: (id, patch) => persistLoc(locations.map((l) => (l.id === id ? { ...l, ...patch } : l))),
    remove: (id) => persistLoc(locations.filter((l) => l.id !== id)),
  };

  const evtCtx: EventsCtx = {
    events,
    getById: (id) => events.find((e) => e.id === id),
    add: (e) => {
      const id = e.id ?? `EVT-${Date.now()}`;
      const rec: EventRecord = {
        registrations: 0, capacity: 100, status: "Upcoming", category: "Film Festival",
        date: `${e.startDate ?? ""} – ${e.endDate ?? ""}`,
        venue: "TBD", city: "TBD",
        ...e, id,
      } as EventRecord;
      persistEvt([rec, ...events]);
      return rec;
    },
    update: (id, patch) => persistEvt(events.map((e) => (e.id === id ? { ...e, ...patch } : e))),
    remove: (id) => persistEvt(events.filter((e) => e.id !== id)),
  };

  const permsCtx: PermsCtx = {
    perms,
    setPerm: (role, key, value) =>
      persistPerms({ ...perms, [role]: { ...perms[role], [key]: value } }),
  };

  return (
    <LocCtx.Provider value={locCtx}>
      <EvtCtx.Provider value={evtCtx}>
        <PermCtx.Provider value={permsCtx}>{children}</PermCtx.Provider>
      </EvtCtx.Provider>
    </LocCtx.Provider>
  );
}

export function useLocations() {
  const c = useContext(LocCtx);
  if (!c) throw new Error("useLocations outside provider");
  return c;
}
export function useEventsStore() {
  const c = useContext(EvtCtx);
  if (!c) throw new Error("useEventsStore outside provider");
  return c;
}
export function usePermissions() {
  const c = useContext(PermCtx);
  if (!c) throw new Error("usePermissions outside provider");
  return c;
}
