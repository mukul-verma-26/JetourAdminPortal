const GENDER_MAP = {
  Male: 'M',
  Female: 'F',
};

export function transformBooking(raw) {
  const customer = raw.customer || {};
  const vehicle = raw.vehicle || {};
  const address = raw.address || {};
  const pkg = raw.package || {};
  const schedule = raw.schedule || {};
  const assignment = raw.assignment || {};
  const phone = customer.country_code && customer.phone
    ? `${customer.country_code}${customer.phone}`
    : customer.phone || '';

  return {
    id: raw._id,
    booking_id: raw.booking_id,
    name: customer.name || '',
    email: customer.email || '',
    gender: GENDER_MAP[customer.gender] || customer.gender || '',
    phone,
    governorate: address.governorate || '',
    area: address.area || '',
    block: address.block || '',
    street: address.street || '',
    building_no: address.building_no || '',
    floor_no: address.floor_no || '',
    flat_no: address.flat_no || '',
    paci_details: address.paci_details || '',
    google_location: address.google_location || '',
    vehicle_model: vehicle.vehicle_model || '',
    vehicle_registration: vehicle.registration_number || '',
    mileage: vehicle.mileage != null ? String(vehicle.mileage) : '',
    service_package: {
      id: pkg.package_id || '',
      name: pkg.name || '',
      amount: pkg.total_amount != null ? String(pkg.total_amount) : '0',
    },
    booking_date: schedule.date || '',
    booking_time: schedule.start_time || '',
    status: raw.status || 'pending',
    amount: pkg.total_amount != null ? String(pkg.total_amount) : '0',
    technician_detail: assignment.technician
      ? { id: assignment.technician._id, name: assignment.technician.name }
      : null,
    driver_detail: assignment.driver
      ? { id: assignment.driver._id, name: assignment.driver.name }
      : null,
    service_van: assignment.service_van
      ? { id: assignment.service_van._id, name: `Van ${assignment.service_van._id}` }
      : null,
    additional_notes: raw.additional_notes || '',
    payment: raw.payment || {},
    service_progress: raw.service_progress || {},
  };
}

export function transformBookings(rawList) {
  return (rawList || []).map(transformBooking);
}
