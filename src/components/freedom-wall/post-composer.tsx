import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Check, ImagePlus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories, noteColors, type CategoryId, type Media, type NoteColor } from "@/lib/freedom-wall";
import { cn } from "@/lib/utils";
import { useWall } from "./wall-provider";

const MAX_FILE = 2 * 1024 * 1024;
export function PostComposer() {
  const { composerOpen, setComposerOpen, addPost } = useWall();
  const [message, setMessage] = useState(""); const [author, setAuthor] = useState("");
  const [captchaToken, setCaptchaToken] - useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
	  (window as any).onTurnstileVerify = (token: string) => setCaptchaToken(token)
	  (window as any).turnstile?.render(turnstileRef.current, {
		  sitekey: "0x4AAAAAAFBq5Kl9pidQBdYC";
		  callback: "onTurnstileVerify",
	  });
  }, []);

  const [category, setCategory] = useState<CategoryId>("random"); const [color, setColor] = useState<NoteColor>("yellow");
  const [media, setMedia] = useState<Media>(); const fileRef = useRef<HTMLInputElement>(null);
  const reset = () => { setMessage(""); setAuthor(""); setPasscode(""); setCategory("random"); setColor("yellow"); setMedia(undefined); };
  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Choose an image"); return; }
    if (file.size > MAX_FILE) { toast.error("Please choose a file under 2 MB for this prototype."); return; }
    const reader = new FileReader(); reader.onload = () => setMedia({ type: "image", dataUrl: String(reader.result), name: file.name }); reader.readAsDataURL(file);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!passcode.trim()) { toast.error("Enter the booth passcode to post."); return; }
    const result = await addPost({ message, author, category, color, ...(media ? { media } : {}) }, passcode.trim());
    if (!result.ok) { toast.error(result.error); return; }
    setComposerOpen(false); reset();
    if (result.status === "pending") toast("Your note is safe with us", { description: "It needs a quick review before appearing on the wall." });
    else toast.success("Your thought is on the wall!", { description: "Thanks for making this space more human." });
  };
  return (
    <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-2xl">
        <DialogHeader><DialogTitle className="font-display text-2xl">Share your thought</DialogTitle><DialogDescription>Leave a kind, honest note for the CMU community.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="thought">Your message</Label><span className={cn("text-xs text-muted-foreground", message.length > 450 && "text-destructive")}>{message.length}/500</span></div><Textarea id="thought" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={5} placeholder="What’s on your mind?" className="min-h-32 resize-none bg-surface" /></div>
          <fieldset className="space-y-2"><legend className="text-sm font-medium">Pick a note color</legend><div className="flex flex-wrap gap-3">{noteColors.map((item) => <button key={item.id} type="button" onClick={() => setColor(item.id)} aria-label={item.label} aria-pressed={color === item.id} className={cn("flex size-10 items-center justify-center rounded-full border-2 border-transparent shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", item.className, color === item.id && "border-primary")}>{color === item.id && <Check className="size-4 text-note-ink" />}</button>)}</div></fieldset>
          <div className="space-y-2"><Label htmlFor="category">Category <span className="font-normal text-muted-foreground">(optional)</span></Label><select id="category" value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className="h-10 w-full rounded-md border border-input bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{categories.map((item) => <option value={item.id} key={item.id}>{item.emoji} {item.label}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="name">Display name <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id="name" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={40} placeholder="Anonymous yarn?" className="bg-surface" /></div>
          <div className="space-y-2"><Label>Photo or video <span className="font-normal text-muted-foreground">(optional, max 2 MB)</span></Label><input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="sr-only" />{media ? <div className="flex items-center gap-3 rounded-md border bg-surface p-3"><div className="size-14 overflow-hidden rounded bg-muted">{media.type === "image" ? <img src={media.dataUrl} alt="Upload preview" className="h-full w-full object-cover" /> : <video src={media.dataUrl} className="h-full w-full object-cover" />}</div><span className="min-w-0 flex-1 truncate text-sm">{media.name}</span><Button type="button" variant="ghost" size="icon" onClick={() => setMedia(undefined)} aria-label="Remove attachment"><Trash2 /></Button></div> : <Button type="button" variant="outline" className="w-full border-dashed bg-surface" onClick={() => fileRef.current?.click()}><ImagePlus /> Add from your device</Button>}</div>
          <div className="flex gap-3 rounded-md bg-accent/60 p-3 text-sm text-accent-foreground"><Sparkles className="mt-0.5 size-4 shrink-0" /><p><strong>Keep it kind.</strong> No names, bullying, threats, or private information. Some notes may pause for review.</p></div>
          <div className="space-y-2">
            <Label htmlFor="passcode">Booth passcode</Label>
            <Input id="passcode" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Ask a volunteer at the booth" className="bg-surface" />
          </div>
          <Button type="submit" size="lg" className="w-full">Pin it to the wall</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
