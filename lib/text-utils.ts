export function stripDiacritics(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function stripPunctuation(text: string): string {
  return text.replace(/[.,!?;:'"]/g, "");
}
