import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    navigate({ to: user ? "/dashboard" : "/auth", replace: true });
  }, [user, navigate]);
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="text-muted-foreground text-sm">Loading…</div>
    </div>
  );
}
