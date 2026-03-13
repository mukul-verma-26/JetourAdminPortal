import * as XLSX from 'xlsx';

function toRow(customer) {
  return {
    'Customer ID': customer.customerId || customer.id || '',
    Name: customer.name || '',
    Phone: customer.phone || '',
    Email: customer.email || '',
    Gender: customer.gender || '',
    Nationality: customer.nationality || '',
    Status: customer.status || '',
    'Joining Date': customer.joiningDate || '',
    'Date of Birth': customer.date_of_birth || '',
    Address: customer.address || '',
  };
}

export function downloadCustomersToExcel(customers) {
  const rows = (customers || []).map(toRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

  const date = new Date();
  const dateStamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  XLSX.writeFile(workbook, `customers-report-${dateStamp}.xlsx`);
}
