/**
 * Package pricing helpers – pure logic, no React.
 */

export function normalizeDetailsToItems(details, optionLookup = {}) {
  if (!Array.isArray(details)) return [];
  return details.map((item) => {
    if (typeof item === 'string') {
      const label = optionLookup[item] ?? item;
      return { id: item, label, checked: true };
    }
    return {
      id: item.id ?? `detail-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: item.label ?? '',
      checked: item.checked !== false,
    };
  });
}

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
