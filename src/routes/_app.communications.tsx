import { createFileRoute } from "@tanstack/react-router";
import { Mail, Megaphone, Bell } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/communications")({
  component: CommunicationsPage,
});

const MESSAGES = [
  { icon: Megaphone, from: "CCN HQ", subject: "Welcome to Global Film Festival 2024", date: "2 days ago", preview: "Your registration is confirmed. Here's what to expect at the festival…" },
  { icon: Mail, from: "Programming Team", subject: "Your film 'City Lights' moved to review", date: "5 days ago", preview: "Our jury has begun review of your short film. Decisions by mid-June." },
  { icon: Bell, from: "Membership", subject: "Premium membership renewed", date: "1 week ago", preview: "Thank you for renewing — your Premium benefits are active through Dec 31, 2024." },
];

function CommunicationsPage() {
  return (
    <>
      <PageHeader title="My Communications" subtitle="Messages, announcements, and updates from Cinema Cities Network." />
      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {MESSAGES.map((m, i) => (
          <div key={i} className="p-5 flex gap-4 hover:bg-secondary/40 transition-colors cursor-pointer">
            <div className="size-10 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0">
              <m.icon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold truncate">{m.subject}</p>
                <p className="text-xs text-muted-foreground shrink-0">{m.date}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{m.from}</p>
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{m.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
