/**
 * Package pricing helpers – pure logic, no React.
 */

export function parseMileage(value) {
  const cleaned = String(value).replace(/[^\d]/g, '');
  return cleaned;
}

export function parseCurrency(value) {
  const cleaned = String(value).replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  return cleaned;
}

export function formatCurrency(value) {
  if (value === '' || value == null) return '';
  const num = parseFloat(String(value));
  if (Number.isNaN(num)) return '';
  return num.toFixed(2);
}
