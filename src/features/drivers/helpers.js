export function parseContactToDigits(contact) {
  if (!contact) return '';
  const digits = contact.replace(/\D/g, '');
  return digits.slice(0, 15);
}

export function validateCivilId(civilId) {
  if (!civilId || !civilId.trim()) return false;
  const trimmed = civilId.trim();
  return /^\d{10,12}$/.test(trimmed);
}

export function getRatingVal(val) {
  if (val === '' || val === undefined || val === null) return 0;
  const num = parseInt(String(val), 10);
  return Number.isNaN(num) ? 0 : Math.min(5, Math.max(0, num));
}
