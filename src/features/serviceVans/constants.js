export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inactive', label: 'Inactive' },
];

export const INITIAL_SERVICE_VANS = [
  {
    id: 'KWT-001',
    vehicleModel: 'Mercedes Sprinter',
    mileage: 34567,
    lastService: '2026-01-10',
    status: 'active',
  },
  {
    id: 'KWT-002',
    vehicleModel: 'Mercedes Sprinter',
    mileage: 42890,
    lastService: '2026-01-15',
    status: 'active',
  },
  {
    id: 'KWT-003',
    vehicleModel: 'Ford Transit',
    mileage: 56234,
    lastService: '2025-12-20',
    status: 'maintenance',
  },
  {
    id: 'KWT-004',
    vehicleModel: 'Toyota Hiace',
    mileage: 28450,
    lastService: '2026-01-18',
    status: 'active',
  },
  {
    id: 'KWT-005',
    vehicleModel: 'Ford Transit',
    mileage: 67890,
    lastService: '2026-01-05',
    status: 'active',
  },
];
