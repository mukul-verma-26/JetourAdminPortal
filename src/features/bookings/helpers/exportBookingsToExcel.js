import * as XLSX from 'xlsx';

function toExportRow(booking) {
  return {
    'Booking ID': booking.booking_id || '',
    Customer: booking.name || '',
    Phone: booking.phone || '',
    Email: booking.email || '',
    Vehicle: booking.vehicle_model || '',
    'Registration Number': booking.vehicle_registration || '',
    Service: booking.service_package?.name || '',
    'Booking Date': booking.booking_date || '',
    'Booking Time': booking.booking_time || '',
    Status: booking.status || '',
    'Amount (KWD)': booking.amount || '',
    'Payment Method': booking.payment?.method || '',
    'Additional Notes': booking.additional_notes || '',
  };
}

export function downloadBookingsToExcel(bookings) {
  const rows = (bookings || []).map(toExportRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

  const today = new Date();
  const stamp = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  const fileName = `bookings-report-${stamp}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
