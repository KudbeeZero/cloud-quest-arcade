const MASTERED_KEY = "arcade_flashcards_mastered";

export function getMasteredIds(): string[] {
  try {
    const raw = localStorage.getItem(MASTERED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function markMastered(id: string): void {
  try {
    const current = getMasteredIds();
    if (!current.includes(id)) {
      localStorage.setItem(MASTERED_KEY, JSON.stringify([...current, id]));
    }
  } catch {
    // localStorage may be unavailable in some environments
  }
}
