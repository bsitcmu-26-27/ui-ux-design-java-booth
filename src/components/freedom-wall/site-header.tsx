import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, MessageSquarePlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useWall } from "./wall-provider";
const links = [
  { to: "/", label: "Home" },
  { to: "/wall", label: "Wall" },
  { to: "/canvas", label: "Canvas" },
  { to: "/about", label: "About" },
  { to: "/booth", label: "Booth Mode" },
] as const;
export function SiteHeader() {
  const { setComposerOpen } = useWall();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname === "/booth") return null;
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Freedom Wall home">
          <span className="grid size-10 place-items-center rounded-sm bg-primary font-display text-xl text-primary-foreground">
            F
          </span>
          <span>
            <span className="block font-display text-lg leading-none">Freedom Wall</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
              Central Mindanao University
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="ml-1 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent"
          >
            <ShieldCheck className="size-3.5" />{" "}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={() => setComposerOpen(true)} className="hidden sm:inline-flex">
            <MessageSquarePlus /> Share Your Thought
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[88%]">
              <SheetHeader>
                <SheetTitle className="font-display text-left text-2xl">Freedom Wall</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-2">
                {links.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="rounded-md px-3 py-3 text-lg font-medium hover:bg-accent"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    to="/admin"
                    className="rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-accent"
                  >
                    Admin Demo
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Button onClick={() => setComposerOpen(true)} size="lg" className="mt-4">
                    <MessageSquarePlus /> Share Your Thought
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
