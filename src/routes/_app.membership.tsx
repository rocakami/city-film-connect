import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Calendar, CreditCard, Star } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store";

export const Route = createFileRoute("/_app/membership")({
  component: MembershipPage,
});

function MembershipPage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="My Membership" subtitle="Your CCN membership details and benefits." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center">
              <BadgeCheck className="size-7" />
            </div>
            <div>
              <p className="text-lg font-semibold">Premium Member</p>
              <p className="text-sm text-muted-foreground">Valid until Dec 31, 2024</p>
            </div>
            <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Member ID" value={user?.id ?? "—"} />
            <Info label="Email" value={user?.email ?? "—"} />
            <Info label="Plan" value="Premium" />
            <Info label="Renewal" value="Auto-renew on Dec 31, 2024" />
          </div>
          <div className="mt-6 flex gap-3">
            <Button><CreditCard className="size-4 mr-2" /> Manage Billing</Button>
            <Button variant="outline">Download Invoice</Button>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="font-semibold mb-3 flex items-center gap-2"><Star className="size-4 text-amber-500" /> Member Benefits</p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Priority film submissions</li>
            <li>• Free access to all CCN workshops</li>
            <li>• Network-wide event discounts</li>
            <li>• Annual print magazine</li>
            <li>• Voting rights at CCN summits</li>
          </ul>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5" /> Member since May 2023
          </div>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-medium mt-0.5">{value}</p>
    </div>
  );
}
