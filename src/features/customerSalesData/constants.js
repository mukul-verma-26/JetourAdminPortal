export const COLOR_SWATCH_MAP = {
  'Pearl White': '#f5f5f5',
  'Midnight Black': '#212121',
  'Titanium Silver': '#c0c0c0',
  'Ocean Blue': '#1976d2',
  'Crimson Red': '#c62828',
  'Graphite Grey': '#616161',
  'Ivory White': '#fff8e1',
  'Forest Green': '#2e7d32',
};

export const CUSTOMER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const TRANSMISSION_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];

export const FUEL_TYPE_OPTIONS = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
];

export const SALES_LABEL_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'company_sold', label: 'Company Sold' },
  { value: 'imported', label: 'Imported' },
  { value: 'outside_vehicle', label: 'Outside Vehicle' },
];

export function getModelYearOptions() {
  const currentYear = new Date().getFullYear();
  const startYear = 2015;
  return Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
    const year = currentYear - i;
    return { value: String(year), label: String(year) };
  });
}
