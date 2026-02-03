export const STOCK_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

export const PART_STATUS_OPTIONS = [
  { value: 'usable', label: 'Usable' },
  { value: 'damaged', label: 'Damaged' },
];

function sortByAddedDate(items) {
  return [...items].sort(
    (a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0)
  );
}

export const INITIAL_INVENTORY = sortByAddedDate([
  {
    id: '1',
    itemId: 'INV-001',
    name: 'Engine Oil Filter',
    qtyInStock: 45,
    addedDate: '2024-01-15',
    stockStatus: 'in_stock',
    unitPrice: 3.75,
    partStatus: 'usable',
  },
  {
    id: '2',
    itemId: 'INV-002',
    name: 'Brake Pads Set',
    qtyInStock: 8,
    addedDate: '2024-02-20',
    stockStatus: 'low_stock',
    unitPrice: 19.5,
    partStatus: 'usable',
  },
  {
    id: '3',
    itemId: 'INV-003',
    name: 'Air Filter',
    qtyInStock: 0,
    addedDate: '2024-03-10',
    stockStatus: 'out_of_stock',
    unitPrice: 7.5,
    partStatus: 'usable',
  },
  {
    id: '4',
    itemId: 'INV-004',
    name: 'Spark Plugs (Pack of 4)',
    qtyInStock: 120,
    addedDate: '2024-04-05',
    stockStatus: 'in_stock',
    unitPrice: 9.6,
    partStatus: 'usable',
  },
  {
    id: '5',
    itemId: 'INV-005',
    name: 'Transmission Fluid',
    qtyInStock: 35,
    addedDate: '2024-05-18',
    stockStatus: 'in_stock',
    unitPrice: 5.625,
    partStatus: 'usable',
  },
  {
    id: '6',
    itemId: 'INV-006',
    name: 'Windshield Wiper Blades',
    qtyInStock: 5,
    addedDate: '2024-06-22',
    stockStatus: 'low_stock',
    unitPrice: 6.6,
    partStatus: 'usable',
  },
  {
    id: '7',
    itemId: 'INV-007',
    name: 'Battery 12V',
    qtyInStock: 12,
    addedDate: '2024-07-30',
    stockStatus: 'in_stock',
    unitPrice: 43.5,
    partStatus: 'usable',
  },
  {
    id: '8',
    itemId: 'INV-008',
    name: 'Coolant Reservoir Cap',
    qtyInStock: 3,
    addedDate: '2024-08-14',
    stockStatus: 'low_stock',
    unitPrice: 2.55,
    partStatus: 'damaged',
  },
  {
    id: '9',
    itemId: 'INV-009',
    name: 'Headlight Bulb H7',
    qtyInStock: 0,
    addedDate: '2024-09-25',
    stockStatus: 'out_of_stock',
    unitPrice: 4.5,
    partStatus: 'usable',
  },
  {
    id: '10',
    itemId: 'INV-010',
    name: 'Cabin Air Filter',
    qtyInStock: 28,
    addedDate: '2024-10-08',
    stockStatus: 'in_stock',
    unitPrice: 6.0,
    partStatus: 'usable',
  },
]);
