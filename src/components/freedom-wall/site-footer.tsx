import { Heart } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
export function SiteFooter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname === "/booth") return null;
  return (
    <footer className="border-t border-border bg-foreground py-10 text-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 text-sm md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-display text-xl">Freedom Wall</p>
          <p className="mt-1 text-background/65">
            A digital booth project by CMU BSIT students from House of Java.
          </p>
        </div>
        <div className="max-w-xl text-background/65">
          <p>Don’t share personal or sensitive information.</p>
          <p className="mt-2 flex items-center gap-1.5">
            {" "}
            <Heart className="size-3.5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
