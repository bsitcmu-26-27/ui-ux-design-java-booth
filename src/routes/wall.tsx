import { createFileRoute } from "@tanstack/react-router";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WallBrowser } from "@/components/freedom-wall/wall-browser";
import { useWall } from "@/components/freedom-wall/wall-provider";
export const Route = createFileRoute("/wall")({ head: () => ({ meta: [{ title: "The Wall — CMU Freedom Wall" }, { name: "description", content: "Browse, search, filter, and react to CMU student notes and community updates." }] }) });
function WallPage() { const { setComposerOpen } = useWall(); return <main><section className="border-b bg-primary py-12 text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-8"><div><p className="text-xs font-bold uppercase tracking-widest text-gold">The community board</p><h1 className="mt-2 font-display text-4xl md:text-6xl">What’s on your mind?</h1><p className="mt-3 max-w-xl text-primary-foreground/75">Read the campus mood, send a little love, or leave something for the next person.</p></div><Button size="lg" onClick={() => setComposerOpen(true)} className="bg-gold text-gold-foreground hover:bg-gold/90"><MessageSquarePlus /> Add your note</Button></div></section><WallBrowser /></main>; }
