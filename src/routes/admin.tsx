import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/components/freedom-wall/admin-panel";
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Demo — CMU Freedom Wall" },
      {
        name: "description",
        content: "Prototype moderation controls for the CMU Freedom Wall demo.",
      },
      { property: "og:title", content: "Admin Demo — CMU Freedom Wall" },
      {
        property: "og:description",
        content: "Review the prototype moderation workflow for student posts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});
function AdminPage() {
  return (
    <main>
      <AdminPanel />
    </main>
  );
}
