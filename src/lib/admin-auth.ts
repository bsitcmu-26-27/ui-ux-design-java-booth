// src/lib/admin-auth.ts
let adminKey = "";
export function setAdminKey(key: string) { adminKey = key; }
export function getAdminKey() { return adminKey; }
