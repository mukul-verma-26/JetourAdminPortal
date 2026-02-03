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
  { id: 'SP-1', name: 'basic', amount: '75' },
  { id: 'SP-2', name: 'standard', amount: '50' },
  { id: 'SP-3', name: 'premium', amount: '100' },
];

export const VEHICLES = [
  { id: 'VH-1', name: 'JETOUR X90 Plus' },
  { id: 'VH-2', name: 'JETOUR X60 Plus' },
  { id: 'VH-3', name: 'JETOUR X70' },
  { id: 'VH-4', name: 'JETOUR Dashing' },
];

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

function sortByBookingDate(bookings) {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a.booking_date.split('/').reverse().join('-') + 'T' + a.booking_time);
    const dateB = new Date(b.booking_date.split('/').reverse().join('-') + 'T' + b.booking_time);
    return dateB - dateA;
  });
}

export const INITIAL_BOOKINGS = sortByBookingDate([
  {
    id: '1',
    name: 'Mukul Verma',
    email: 'mukulverma.it@gmail.com',
    vehicle_model: 'JETOUR X90 Plus',
    service_package: {
      id: 'SP-1',
      name: 'basic',
      amount: '75',
    },
    booking_date: '30/01/2026',
    booking_time: '15:00',
    booking_slot: '16:00-19:30',
    status: 'confirmed',
    amount: '75',
    gender: 'M',
    address: 'Block 5, Street 12, Jabriya, Kuwait City',
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
    vehicle_model: 'JETOUR X60 Plus',
    service_package: {
      id: 'SP-2',
      name: 'standard',
      amount: '50',
    },
    booking_date: '30/01/2026',
    booking_time: '18:00',
    booking_slot: '16:00-19:30',
    status: 'pending',
    amount: '50',
    gender: 'M',
    address: 'Al Soor Street, Salmiya, Hawally',
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
    vehicle_model: 'JETOUR X70',
    service_package: {
      id: 'SP-3',
      name: 'premium',
      amount: '100',
    },
    booking_date: '28/01/2026',
    booking_time: '10:00',
    booking_slot: '09:00-12:00',
    status: 'completed',
    amount: '100',
    gender: 'F',
    address: 'Fintas, Block 9, Ahmadi Governorate',
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
    vehicle_model: 'JETOUR Dashing',
    service_package: {
      id: 'SP-1',
      name: 'basic',
      amount: '75',
    },
    booking_date: '29/01/2026',
    booking_time: '14:00',
    booking_slot: '12:00-15:00',
    status: 'in_progress',
    amount: '75',
    gender: 'M',
    address: 'Ibn Khaldoun Street, Sharq, Kuwait City',
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
    vehicle_model: 'JETOUR X90 Plus',
    service_package: {
      id: 'SP-2',
      name: 'standard',
      amount: '50',
    },
    booking_date: '31/01/2026',
    booking_time: '11:00',
    booking_slot: '09:00-12:00',
    status: 'pending',
    amount: '50',
    gender: 'F',
    address: 'Block 3, Street 45, Mangaf, Ahmadi',
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
