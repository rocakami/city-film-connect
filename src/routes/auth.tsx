import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/ccn-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, CCN_LOCATIONS } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [loginEmail, setLoginEmail] = useState("admin@ccn.org");
  const [loginPassword, setLoginPassword] = useState("admin123");

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    primaryLocationId: "miami",
    phone: "",
    country: "",
    bio: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(loginEmail, loginPassword);
    if (u) {
      toast.success(`Welcome back, ${u.name}`);
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast.error("Please fill all required fields");
      return;
    }
    signup({ ...signupForm });
    toast.success("Account created — welcome!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand side */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3">
          <img src={logo} alt="CCN" className="size-12" width={48} height={48} />
          <div>
            <p className="font-bold">Cinema Cities Network</p>
            <p className="text-[10px] tracking-[0.18em] text-sidebar-muted uppercase">
              Global Unity Through Storytelling
            </p>
          </div>
        </div>
        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Connect cities worldwide through the power of film.
          </h2>
          <p className="mt-4 text-sidebar-muted">
            Join festivals, innovation labs, leadership summits, and cultural exchanges across our
            global partner network.
          </p>
        </div>
        <p className="text-xs text-sidebar-muted">
          © {new Date().getFullYear()} Cinema Cities Network. Film. Technology. The Human Voice.
        </p>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center p-8 sm:p-12">
        <div className="lg:hidden mb-6 flex items-center gap-3">
          <img src={logo} alt="CCN" className="size-10" width={40} height={40} />
          <p className="font-bold">Cinema Cities Network</p>
        </div>
        <div className="w-full max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Sign in</Button>
                <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Demo accounts</p>
                  <p>Admin — admin@ccn.org / admin123</p>
                  <p>Member — member@ccn.org / member123</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Full name *</Label>
                    <Input id="name" value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input id="signup-email" type="email" value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input id="signup-password" type="password" value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} required />
                </div>
                <div>
                  <Label>Primary CCN Location *</Label>
                  <Select value={signupForm.primaryLocationId}
                    onValueChange={(v) => setSignupForm({ ...signupForm, primaryLocationId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {CCN_LOCATIONS.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.flag} {l.city} — <span className="text-muted-foreground">{l.country}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll see data tagged to this location. You can switch any time after signing in.
                  </p>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={signupForm.country}
                    onChange={(e) => setSignupForm({ ...signupForm, country: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={3} value={signupForm.bio}
                    onChange={(e) => setSignupForm({ ...signupForm, bio: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
