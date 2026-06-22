import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FileText, Video, Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/resources")({
  component: ResourcesPage,
});

const RESOURCES = [
  { icon: FileText, title: "Filmmaker's Handbook", desc: "Best practices, submission guidelines, and CCN standards." },
  { icon: Video, title: "Masterclass Library", desc: "Recorded talks from past festivals and industry leaders." },
  { icon: BookOpen, title: "Grant & Funding Guide", desc: "Curated programs and grants for independent filmmakers." },
  { icon: Download, title: "Brand & Press Kit", desc: "Logos, banners, and templates for CCN partners." },
];

function ResourcesPage() {
  return (
    <>
      <PageHeader title="Resources" subtitle="Tools, guides, and material curated for CCN members." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RESOURCES.map((r) => (
          <div key={r.title} className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
            <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
              <r.icon className="size-6" />
            </div>
            <div>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
