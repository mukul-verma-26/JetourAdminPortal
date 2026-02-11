export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const VEHICLE_MODELS = [
  { id: 'VH-002', name: 'JETOUR X70 Plus' },
  { id: 'VH-003', name: 'JETOUR Dashing' },
  { id: 'VH-004', name: 'JETOUR X50' },
  { id: 'VH-005', name: 'JETOUR T2' },
  { id: 'VH-006', name: 'JETOUR X60 Plus' },
];

export const PACKAGE_DETAIL_OPTIONS = [
  { id: 'oil_change', label: 'Engine oil change' },
  { id: 'filter_replacement', label: 'Oil filter replacement' },
  { id: 'tire_check', label: 'Tire pressure check' },
  { id: 'vehicle_inspection', label: 'Basic vehicle inspection' },
];

function createEmptyPricingRow() {
  const prices = {};
  VEHICLE_MODELS.forEach((v) => { prices[v.name] = ''; });
  return { mileage: '', prices };
}

export const INITIAL_SERVICE_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Service',
    description: 'Customize features and pricing',
    status: 'active',
    details: ['oil_change', 'filter_replacement'],
    pricingMatrix: [{ mileage: '10000', prices: { 'JETOUR X70 Plus': '45', 'JETOUR Dashing': '45', 'JETOUR X50': '45', 'JETOUR T2': '45', 'JETOUR X60 Plus': '45' } }],
  },
  {
    id: 'standard',
    name: 'Standard Service',
    description: 'Customize features and pricing',
    status: 'active',
    details: ['oil_change', 'filter_replacement', 'tire_check'],
    pricingMatrix: [{ mileage: '10000', prices: { 'JETOUR X70 Plus': '70', 'JETOUR Dashing': '70', 'JETOUR X50': '70', 'JETOUR T2': '75', 'JETOUR X60 Plus': '70' } }],
  },
  {
    id: 'premium',
    name: 'Premium Service',
    description: 'Customize features and pricing',
    status: 'active',
    details: ['oil_change', 'filter_replacement', 'tire_check', 'vehicle_inspection'],
    pricingMatrix: [{ mileage: '10000', prices: { 'JETOUR X70 Plus': '140', 'JETOUR Dashing': '140', 'JETOUR X50': '140', 'JETOUR T2': '145', 'JETOUR X60 Plus': '140' } }],
  },
];

export { createEmptyPricingRow };
