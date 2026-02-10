export const CUSTOMER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
];

export const PREFERRED_LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
];

function sortByJoiningDate(customers) {
  return [...customers].sort(
    (a, b) =>
      new Date(b.joiningDate || b.joined || 0) -
      new Date(a.joiningDate || a.joined || 0)
  );
}

export const INITIAL_CUSTOMERS = sortByJoiningDate([
  {
    id: '1',
    customerId: 'C-001',
    name: 'Ahmed Al-Mansour',
    gender: 'male',
    dob: '1985-05-15',
    address: 'Block 5, Street 12, Kuwait City',
    nationality: 'Kuwaiti',
    phone: '+965 1234 5678',
    civilId: '285051512345',
    passportNumber: 'P12345678',
    joiningDate: '2024-01-01',
    preferredLanguage: 'ar',
    vehicles: [{ modelName: 'JETOUR X70' }],
    totalBookings: 12,
    status: 'active',
  },
  {
    id: '2',
    customerId: 'C-002',
    name: 'Fatima Al-Sabah',
    gender: 'female',
    dob: '1990-08-22',
    address: 'Jabriya, Avenue 8, Kuwait',
    nationality: 'Kuwaiti',
    phone: '+965 9876 5432',
    civilId: '290082212346',
    passportNumber: 'P23456789',
    joiningDate: '2024-03-15',
    preferredLanguage: 'en',
    vehicles: [
      { modelName: 'JETOUR X90' },
      { modelName: 'JETOUR Dashing' },
    ],
    totalBookings: 8,
    status: 'active',
  },
  {
    id: '3',
    customerId: 'C-003',
    name: 'Khalid Ibrahim',
    gender: 'male',
    dob: '1978-12-10',
    address: 'Salmiya, Street 5, Kuwait',
    nationality: 'Egyptian',
    phone: '+965 5555 1234',
    civilId: '278121012347',
    passportNumber: 'P34567890',
    joiningDate: '2024-06-20',
    preferredLanguage: 'en',
    vehicles: [{ modelName: 'JETOUR X70 Plus' }],
    totalBookings: 5,
    status: 'active',
  },
  {
    id: '4',
    customerId: 'C-004',
    name: 'Sara Mohammed',
    gender: 'female',
    dob: '1992-03-05',
    address: 'Hawally, Block 2, Kuwait',
    nationality: 'Kuwaiti',
    phone: '+965 2222 8888',
    civilId: '292030512348',
    passportNumber: 'P45678901',
    joiningDate: '2024-09-10',
    preferredLanguage: 'ar',
    vehicles: [{ modelName: 'JETOUR X90 Plus' }],
    totalBookings: 3,
    status: 'active',
  },
  {
    id: '5',
    customerId: 'C-005',
    name: 'Omar Hassan',
    gender: 'male',
    dob: '1988-11-18',
    address: 'Farwaniya, Street 20, Kuwait',
    nationality: 'Jordanian',
    phone: '+965 7777 3333',
    civilId: '288111812349',
    passportNumber: 'P56789012',
    joiningDate: '2024-11-01',
    preferredLanguage: 'en',
    vehicles: [
      { modelName: 'JETOUR X70' },
      { modelName: 'JETOUR Dashing' },
    ],
    totalBookings: 0,
    status: 'inactive',
  },
]);
