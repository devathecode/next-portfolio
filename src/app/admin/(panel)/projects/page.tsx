import { supabaseAdmin, type Project } from "@/lib/supabase";
import { PageHeader } from "../_components/ui";
import { ProjectList } from "../_components/ProjectList";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: openNew } = await searchParams;
  const { data } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Everything shown on your portfolio. Drag rows to change the order."
      />
      <ProjectList projects={(data ?? []) as Project[]} startOpen={openNew === "1"} />
    </div>
  );
}
