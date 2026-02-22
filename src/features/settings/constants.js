export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const VEHICLE_MODELS = [
  { id: 'VH-001', name: 'JETOUR T1' },
  { id: 'VH-002', name: 'JETOUR T2' },
  { id: 'VH-003', name: 'JETOUR Dashing' },
  { id: 'VH-004', name: 'JETOUR X70' },
  { id: 'VH-005', name: 'JETOUR T2 i-DM' },
  { id: 'VH-006', name: 'JETOUR X70 Plus' },
  { id: 'VH-007', name: 'JETOUR G700' },
];

function createEmptyPricingRow() {
  const prices = {};
  VEHICLE_MODELS.forEach((v) => { prices[v.name] = ''; });
  return { mileage: '', prices };
}

export { createEmptyPricingRow };
