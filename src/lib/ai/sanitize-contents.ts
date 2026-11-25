/**
 * Normalizes contents for Google Gemini API:
 * 1. Drops any leading 'model' bubbles (welcome greetings, fallbacks)
 * 2. Merges consecutive messages of the same role
 * 3. Ensures contents strictly begins with 'user' and alternates user -> model -> user
 */
export function sanitizeGeminiContents(
  rawContents: Array<{ role: "user" | "model"; text: string }>
): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> {
  // Step 1: Drop leading model messages
  const startIdx = rawContents.findIndex((c) => c.role === "user");
  if (startIdx === -1) {
    return [];
  }
  const sliced = rawContents.slice(startIdx);

  // Step 2: Merge consecutive messages of the same role
  const merged: Array<{ role: "user" | "model"; text: string }> = [];
  for (const item of sliced) {
    const trimmed = item.text.trim();
    if (!trimmed) continue;

    if (merged.length > 0 && merged[merged.length - 1].role === item.role) {
      merged[merged.length - 1].text += `\n${trimmed}`;
    } else {
      merged.push({ role: item.role, text: trimmed });
    }
  }

  // Step 3: Format as Gemini parts
  return merged.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}
