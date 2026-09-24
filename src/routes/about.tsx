import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Lightbulb, ShieldCheck } from "lucide-react";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CMU Freedom Wall" },
      {
        name: "description",
        content: "Learn about the CISC student booth project behind CMU's digital Freedom Wall.",
      },
      { property: "og:title", content: "About the CMU Freedom Wall" },
      {
        property: "og:description",
        content: "A student-built CISC booth project for expression, empathy, and community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});
function AboutPage() {
  return (
    <main>
      <section className="border-b bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Behind the wall</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight md:text-7xl">
            A campus space made to feel a little more human.
          </h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[1.15fr_.85fr] md:px-8 md:py-24">
        <div>
          <h2 className="font-display text-3xl">A CISC booth project</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Freedom Wall — Digital Edition is a prototype created by Central Mindanao University IT
            students. It reimagines the familiar campus freedom wall as an open, playful digital
            space for stories, encouragement, ideas, and everyday student life.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The goal is simple: make room for honest expression while keeping the experience
            respectful, approachable, and safe for the community.
          </p>
        </div>
        <div className="space-y-4">
          {[
            {
              icon: HeartHandshake,
              title: "Express with empathy",
              text: "Speak honestly without putting someone else down.",
            },
            {
              icon: Lightbulb,
              title: "Share what matters",
              text: "From small laughs to big ideas, every voice can add something.",
            },
            {
              icon: ShieldCheck,
              title: "Prototype privacy",
              text: "Everything stays in this browser. Real deployment needs secure moderation.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 border-b border-border py-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-accent text-primary">
                <item.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
