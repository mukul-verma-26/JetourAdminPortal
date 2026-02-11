export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const GENDER_OPTIONS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];

export const SERVICE_OPTIONS = [
  { id: 'PKG-001', name: 'Free Service', priceT2: '0', priceT1: '0' },
  { id: 'PKG-002', name: 'M1 - Basic Maintenance', priceT2: '45', priceT1: '45' },
  { id: 'PKG-003', name: 'M2 - Standard Maintenance', priceT2: '75', priceT1: '70' },
  { id: 'PKG-004', name: 'M3 - Intermediate Maintenance', priceT2: '45', priceT1: '45' },
  { id: 'PKG-005', name: 'M4 - Major Maintenance', priceT2: '80', priceT1: '75' },
  { id: 'PKG-006', name: 'M5 - Comprehensive Maintenance', priceT2: '145', priceT1: '140' },
];

export const VEHICLES = [
  { id: 'VH-002', name: 'JETOUR X70 Plus (2024)' },
  { id: 'VH-003', name: 'JETOUR Dashing (2025)' },
  { id: 'VH-004', name: 'JETOUR X50 (2024)' },
  { id: 'VH-005', name: 'JETOUR T2 (2026)' },
  { id: 'VH-006', name: 'JETOUR X60 Plus (2025)' },
];

export const VEHICLE_TIER = {
  'JETOUR X70 Plus (2024)': 'T1',
  'JETOUR Dashing (2025)': 'T1',
  'JETOUR X50 (2024)': 'T1',
  'JETOUR T2 (2026)': 'T2',
  'JETOUR X60 Plus (2025)': 'T1',
};

export const TECHNICIANS = [
  { id: 't12', name: 'Javed Khan' },
  { id: 't23', name: 'Umar Khalid' },
  { id: 't32', name: 'Zakir Khan' },
  { id: 't35', name: 'Abdul Zakir' },
];

export const DRIVERS = [
  { id: 'DRI-123', name: 'Hamza Ali' },
  { id: 'DRI-1', name: 'Ali Hassan' },
  { id: 'DRI-2', name: 'Fahad Khan' },
];

export const SERVICE_VANS = [
  { id: 'SV-1', name: 'Van 1' },
  { id: 'SV-2', name: 'Van 2' },
  { id: 'SV-3', name: 'Van 3' },
];

export const BOOKING_AMOUNT = 125;

function sortByBookingTime(bookings) {
  return [...bookings].sort((a, b) => {
    const timeA = a.booking_time || '00:00';
    const timeB = b.booking_time || '00:00';
    return timeB.localeCompare(timeA);
  });
}

export const INITIAL_BOOKINGS = sortByBookingTime([
  {
    id: '1',
    name: 'Mukul Verma',
    email: 'mukulverma.it@gmail.com',
    gender: 'M',
    phone: '55012345',
    governorate: 'Hawally',
    area: 'Jabriya',
    block: '5',
    street: '12',
    building_no: '34',
    floor_no: '2',
    flat_no: '8',
    paci_details: 'PACI-20260130-001',
    google_location: 'Jabriya, Block 5, Hawally Governorate, Kuwait',
    vehicle_model: 'JETOUR X70 Plus (2024)',
    vehicle_registration: 'KW-1234',
    vehicle_year: '2024',
    mileage: '45,200',
    service_package: {
      id: 'PKG-003',
      name: 'M2 - Standard Maintenance',
      amount: '75',
    },
    booking_time: '15:00',
    booking_date: '2026-01-30',
    status: 'confirmed',
    amount: '75',
    technician_detail: {
      id: 't12',
      name: 'Javed Khan',
    },
    driver_detail: {
      id: 'DRI-123',
      name: 'Hamza Ali',
    },
    service_van: {
      id: 'SV-1',
      name: 'Van 1',
    },
    additional_notes: 'Customer requested morning slot. Prefer same technician as last visit.',
  },
  {
    id: '2',
    name: 'Lorenzo Martinez',
    email: 'lorenzo.valorant@gmail.com',
    gender: 'M',
    phone: '66098765',
    governorate: 'Hawally',
    area: 'Salmiya',
    block: '10',
    street: '3',
    building_no: '56',
    floor_no: '1',
    flat_no: '3',
    paci_details: 'PACI-20260130-002',
    google_location: 'Al Soor Street, Salmiya, Hawally, Kuwait',
    vehicle_model: 'JETOUR X60 Plus (2025)',
    vehicle_registration: 'KW-5678',
    vehicle_year: '2025',
    mileage: '12,800',
    service_package: {
      id: 'PKG-002',
      name: 'M1 - Basic Maintenance',
      amount: '45',
    },
    booking_time: '18:00',
    booking_date: '2026-01-30',
    status: 'pending',
    amount: '45',
    technician_detail: {
      id: 't23',
      name: 'Umar Khalid',
    },
    driver_detail: {
      id: 'DRI-1',
      name: 'Ali Hassan',
    },
    service_van: {
      id: 'SV-2',
      name: 'Van 2',
    },
    additional_notes: '',
  },
  {
    id: '3',
    name: 'Sara Al-Mohammed',
    email: 'sara.mohammed@gmail.com',
    gender: 'F',
    phone: '97654321',
    governorate: 'Ahmadi',
    area: 'Fintas',
    block: '9',
    street: '7',
    building_no: '15',
    floor_no: 'G',
    flat_no: '1',
    paci_details: 'PACI-20260128-003',
    google_location: 'Fintas, Block 9, Ahmadi Governorate, Kuwait',
    vehicle_model: 'JETOUR X70 Plus (2024)',
    vehicle_registration: 'KW-9012',
    vehicle_year: '2023',
    mileage: '78,500',
    service_package: {
      id: 'PKG-006',
      name: 'M5 - Comprehensive Maintenance',
      amount: '140',
    },
    booking_time: '10:00',
    booking_date: '2026-01-28',
    status: 'completed',
    amount: '140',
    technician_detail: {
      id: 't32',
      name: 'Zakir Khan',
    },
    driver_detail: {
      id: 'DRI-2',
      name: 'Fahad Khan',
    },
    service_van: {
      id: 'SV-1',
      name: 'Van 1',
    },
    additional_notes: 'Gate code: 4521. Park in visitor bay.',
  },
  {
    id: '4',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.rashid@example.com',
    gender: 'M',
    phone: '50123456',
    governorate: 'Capital',
    area: 'Sharq',
    block: '3',
    street: '15',
    building_no: '22',
    floor_no: '5',
    flat_no: '12',
    paci_details: 'PACI-20260129-004',
    google_location: 'Ibn Khaldoun Street, Sharq, Kuwait City, Kuwait',
    vehicle_model: 'JETOUR Dashing (2025)',
    vehicle_registration: 'KW-3456',
    vehicle_year: '2025',
    mileage: '31,000',
    service_package: {
      id: 'PKG-005',
      name: 'M4 - Major Maintenance',
      amount: '75',
    },
    booking_time: '14:00',
    booking_date: '2026-01-29',
    status: 'in_progress',
    amount: '75',
    technician_detail: {
      id: 't35',
      name: 'Abdul Zakir',
    },
    driver_detail: {
      id: 'DRI-123',
      name: 'Hamza Ali',
    },
    service_van: {
      id: 'SV-3',
      name: 'Van 3',
    },
    additional_notes: 'Full interior detail requested.',
  },
  {
    id: '5',
    name: 'Fatima Khalil',
    email: 'fatima.khalil@example.com',
    gender: 'F',
    phone: '55567890',
    governorate: 'Ahmadi',
    area: 'Mangaf',
    block: '3',
    street: '45',
    building_no: '8',
    floor_no: '3',
    flat_no: '6',
    paci_details: 'PACI-20260131-005',
    google_location: 'Block 3, Mangaf, Ahmadi Governorate, Kuwait',
    vehicle_model: 'JETOUR T2 (2026)',
    vehicle_registration: 'KW-7890',
    vehicle_year: '2026',
    mileage: '5,400',
    service_package: {
      id: 'PKG-004',
      name: 'M3 - Intermediate Maintenance',
      amount: '45',
    },
    booking_time: '11:00',
    booking_date: '2026-01-31',
    status: 'pending',
    amount: '45',
    technician_detail: {
      id: 't12',
      name: 'Javed Khan',
    },
    driver_detail: {
      id: 'DRI-1',
      name: 'Ali Hassan',
    },
    service_van: {
      id: 'SV-2',
      name: 'Van 2',
    },
    additional_notes: 'First time customer. Call on arrival.',
  },
]);
