export const categories = [
  { id: "random", label: "Random Thoughts", emoji: "💭" },
  { id: "appreciation", label: "Appreciation", emoji: "❤️" },
  { id: "student-life", label: "Student Life", emoji: "🎓" },
  { id: "funny", label: "Funny", emoji: "😂" },
  { id: "dreams", label: "Dreams & Goals", emoji: "🌱" },
  { id: "ideas", label: "Ideas", emoji: "💡" },
  { id: "experiences", label: "Experiences", emoji: "📖" },
  { id: "other", label: "Other", emoji: "💬" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type NoteColor = "yellow" | "pink" | "blue" | "mint" | "peach" | "lilac";
export type PostStatus = "approved" | "pending" | "rejected";
export type Media = { type: "image" | "video"; dataUrl: string; name: string };
export type WallPost = {
  id: string;
  message: string;
  author: string;
  category: CategoryId;
  color: NoteColor;
  createdAt: string;
  reactions: number;
  status: PostStatus;
  isSeed: boolean;
  media?: Media;
  x: number;
  y: number;
};

export const noteColors: { id: NoteColor; label: string; className: string }[] = [
  { id: "yellow", label: "Sunshine", className: "bg-note-yellow" },
  { id: "pink", label: "Blush", className: "bg-note-pink" },
  { id: "blue", label: "Sky", className: "bg-note-blue" },
  { id: "mint", label: "Mint", className: "bg-note-mint" },
  { id: "peach", label: "Peach", className: "bg-note-peach" },
  { id: "lilac", label: "Lilac", className: "bg-note-lilac" },
];

const seed = [
  ["To whoever returned my flash drive at the CAS lobby — you saved my whole semester. Salamat kaayo!", "Mika, BSIT 2", "appreciation", "yellow", 28],
  ["Study tip: explain the lesson to a plant. If the plant looks confused, review chapter 3 again.", "Anonymous yarn?", "funny", "mint", 41],
  ["Manifesting a campus shuttle that arrives exactly when we leave the classroom. ✨", "Jules", "student-life", "blue", 34],
  ["Your pace is still progress. Rest is part of the work, not the opposite of it.", "A tired senior", "experiences", "lilac", 56],
  ["Shoutout to the kuya at the kiosk who remembers everyone’s usual order.", "Anonymous yarn?", "appreciation", "pink", 22],
  ["Proposal: more charging corners under shady trees. Group study, but make it presko.", "Ivy", "ideas", "peach", 37],
  ["The walk from Engineering to the next class is my daily cardio program.", "Late since 8:01", "funny", "yellow", 63],
  ["One day, I’ll build technology that helps Mindanao farmers make better decisions.", "Future dev", "dreams", "mint", 49],
  ["Found my people in a random lab group. College surprises you in kind ways.", "N", "experiences", "pink", 31],
  ["Reminder: save your file. Then save it again. Then email it to yourself.", "Your lab guardian", "student-life", "blue", 71],
  ["What song is carrying you through midterms? Mine is the printer startup sound.", "Anonymous yarn?", "random", "lilac", 18],
  ["I hope our orgs collaborate on a campus-wide creative tech day next semester.", "Kai", "ideas", "peach", 25],
  ["To everyone quietly trying their best: I see you. Padayon.", "Someone cheering", "appreciation", "yellow", 84],
  ["Dear future me: you made it through the thesis defense. Please buy present me coffee.", "BSIT 4", "dreams", "blue", 46],
] as const;

export const seedPosts: WallPost[] = seed.map((item, index) => ({
  id: `seed-${index + 1}`,
  message: item[0],
  author: item[1],
  category: item[2] as CategoryId,
  color: item[3] as NoteColor,
  reactions: item[4],
  status: "approved",
  isSeed: true,
  createdAt: new Date(Date.UTC(2026, 8, 15, 12, 0) - index * 1000 * 60 * 60 * 7).toISOString(),
  x: 130 + (index % 4) * 390 + ((index * 37) % 80),
  y: 100 + Math.floor(index / 4) * 340 + ((index * 53) % 90),
}));

export const STORAGE_KEY = "cmu-freedom-wall-posts-v1";
export const REACTIONS_KEY = "cmu-freedom-wall-reactions-v1";
export const LAST_POST_KEY = "cmu-freedom-wall-last-post-v1";
export const blockedKeywords = ["threat", "violence", "bully", "hate speech"];

export function categoryFor(id: CategoryId) {
  return categories.find((category) => category.id === id) ?? categories[categories.length - 1];
}

export function isCategoryId(value: unknown): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export function isNoteColor(value: unknown): value is NoteColor {
  return noteColors.some((color) => color.id === value);
}

export function isPostStatus(value: unknown): value is PostStatus {
  return value === "approved" || value === "pending" || value === "rejected";
}
