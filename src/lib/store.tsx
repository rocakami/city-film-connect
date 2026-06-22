import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CCN_LOCATIONS, getLocationById, type CCNLocation } from "./locations";

export type Role = "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  primaryLocationId: string;
  phone?: string;
  country?: string;
  bio?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  activeLocationId: string; // "all" only valid for admin
  signup: (input: Omit<User, "id" | "role"> & { password: string; role?: Role }) => User;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  setActiveLocation: (locationId: string) => void;
  updateUser: (patch: Partial<User>) => void;
}

const KEY_USER = "ccn.user";
const KEY_LOC = "ccn.activeLocation";
const KEY_USERS = "ccn.users";

// Seed default admin
const seedUsers = (): Record<string, User & { password: string }> => {
  const raw = localStorage.getItem(KEY_USERS);
  if (raw) return JSON.parse(raw);
  const seeded = {
    "admin@ccn.org": {
      id: "u-admin",
      name: "Admin",
      email: "admin@ccn.org",
      role: "admin" as Role,
      primaryLocationId: "miami",
      password: "admin123",
      avatarUrl: "",
    },
    "member@ccn.org": {
      id: "u-member-1",
      name: "Sarah Johnson",
      email: "member@ccn.org",
      role: "member" as Role,
      primaryLocationId: "miami",
      password: "member123",
      avatarUrl: "",
    },
  };
  localStorage.setItem(KEY_USERS, JSON.stringify(seeded));
  return seeded;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeLocationId, setActiveLocationIdState] = useState<string>("miami");
  const [, setTick] = useState(0);

  useEffect(() => {
    seedUsers();
    const rawU = localStorage.getItem(KEY_USER);
    if (rawU) {
      const u = JSON.parse(rawU) as User;
      setUser(u);
      const loc = localStorage.getItem(KEY_LOC) ?? u.primaryLocationId;
      setActiveLocationIdState(loc);
    }
  }, []);

  const persistUser = (u: User | null) => {
    if (u) localStorage.setItem(KEY_USER, JSON.stringify(u));
    else localStorage.removeItem(KEY_USER);
    setUser(u);
  };

  const setActiveLocation = (id: string) => {
    setActiveLocationIdState(id);
    localStorage.setItem(KEY_LOC, id);
    setTick((t) => t + 1);
  };

  const signup: AuthState["signup"] = (input) => {
    const users = seedUsers();
    const id = `u-${Date.now()}`;
    const role: Role = input.role ?? "member";
    const newUser: User & { password: string } = {
      id,
      name: input.name,
      email: input.email.toLowerCase(),
      role,
      primaryLocationId: input.primaryLocationId,
      phone: input.phone,
      country: input.country,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      password: input.password,
    };
    users[newUser.email] = newUser;
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    const { password: _pw, ...safe } = newUser;
    persistUser(safe);
    setActiveLocation(safe.primaryLocationId);
    return safe;
  };

  const login: AuthState["login"] = (email, password) => {
    const users = seedUsers();
    const u = users[email.toLowerCase()];
    if (!u || u.password !== password) return null;
    const { password: _pw, ...safe } = u;
    persistUser(safe);
    setActiveLocation(safe.role === "admin" ? "all" : safe.primaryLocationId);
    return safe;
  };

  const logout = () => {
    persistUser(null);
    localStorage.removeItem(KEY_LOC);
  };

  const updateUser: AuthState["updateUser"] = (patch) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    persistUser(updated);
    const users = seedUsers();
    const stored = users[user.email];
    if (stored) {
      users[user.email] = { ...stored, ...patch };
      localStorage.setItem(KEY_USERS, JSON.stringify(users));
    }
  };

  return (
    <AuthCtx.Provider
      value={{ user, activeLocationId, signup, login, logout, setActiveLocation, updateUser }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function useActiveLocation(): { location: CCNLocation | null; isAll: boolean; locationId: string } {
  const { activeLocationId, user } = useAuth();
  if (user?.role === "admin" && activeLocationId === "all") {
    return { location: null, isAll: true, locationId: "all" };
  }
  return { location: getLocationById(activeLocationId), isAll: false, locationId: activeLocationId };
}

export function filterByLocation<T extends { locationId: string }>(items: T[], locationId: string): T[] {
  if (locationId === "all") return items;
  return items.filter((i) => i.locationId === locationId);
}

export { CCN_LOCATIONS };
