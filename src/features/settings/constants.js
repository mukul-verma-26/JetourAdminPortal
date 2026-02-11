export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const PACKAGE_DETAIL_OPTIONS = [
  { id: 'oil_change', label: 'Engine oil change' },
  { id: 'filter_replacement', label: 'Oil filter replacement' },
  { id: 'tire_check', label: 'Tire pressure check' },
  { id: 'vehicle_inspection', label: 'Basic vehicle inspection' },
];

export const INITIAL_SERVICE_PACKAGES = [
  { id: 'basic', name: 'Basic Service', description: 'Customize features and pricing', status: 'active', details: ['oil_change', 'filter_replacement'] },
  { id: 'standard', name: 'Standard Service', description: 'Customize features and pricing', status: 'active', details: ['oil_change', 'filter_replacement', 'tire_check'] },
  { id: 'premium', name: 'Premium Service', description: 'Customize features and pricing', status: 'active', details: ['oil_change', 'filter_replacement', 'tire_check', 'vehicle_inspection'] },
];
