import { createFileRoute } from "@tanstack/react-router";
import { CanvasBoard } from "@/components/freedom-wall/canvas-board";
export const Route = createFileRoute("/canvas")({
  head: () => ({
    meta: [
      { title: "Canvas — CMU Freedom Wall" },
      {
        name: "description",
        content: "Explore CMU student notes across an interactive digital corkboard.",
      },
      { property: "og:title", content: "Interactive Canvas — CMU Freedom Wall" },
      {
        property: "og:description",
        content: "Pan, zoom, and explore student voices on the digital corkboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CanvasPage,
});
function CanvasPage() {
  return (
    <main>
      <CanvasBoard />
    </main>
  );
}
