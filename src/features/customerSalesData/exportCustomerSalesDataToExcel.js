import * as XLSX from 'xlsx';

function toRow(item) {
  return {
    'Customer Name': item.customerName || '',
    'Contact Number': item.customerContactNumber || '',
    Vehicle: item.vehicleName || '',
    'Registration Number': item.registrationNumber || '',
    VIN: item.vin || '',
    Color: item.color || '',
    'Model Year': item.modelYear || '',
    Variant: item.variantName || '',
    'Sold Date': item.soldDate || '',
    Transmission: item.transmission || '',
    'Fuel Type': item.fuelType || '',
    'Last Service Date': item.lastServiceDate || '',
    'Last Recorded Mileage': item.lastRecordedMileage || '',
    'Sales Label': item.salesLabel || '',
  };
}

export function downloadCustomerSalesDataToExcel(list) {
  const rows = (list || []).map(toRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer Sales Data');

  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  XLSX.writeFile(workbook, `customer-sales-data-report-${stamp}.xlsx`);
}
