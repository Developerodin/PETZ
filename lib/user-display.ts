export function getInitials(name?: string | null, email?: string | null) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase();
  const local = String(email || "").split("@")[0];
  if (local) return local.slice(0, 2).toUpperCase();
  return "P";
}

export function formatMemberSince(date?: Date | string | null) {
  if (!date) return "";
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return value.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
