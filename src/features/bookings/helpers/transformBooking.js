const GENDER_MAP = {
  Male: 'M',
  Female: 'F',
};

export function transformBooking(raw) {
  const customer = raw.customer || {};
  const vehicle = raw.vehicle || raw.vehicle_details || {};
  const address = customer.address || raw.address || {};
  const pkg = raw.package || {};
  const schedule = raw.schedule || {};
  const assignment = raw.assignment || {};
  const customerContact = customer.phone || customer.contact || '';
  const phone = customer.country_code && customerContact
    ? `${customer.country_code}${customerContact}`
    : customerContact;
  const bookingId = raw.booking_id || raw.data?.booking_id || '';
  const packageId = pkg.package_id || raw.package_id || '';
  const packageAmount = pkg.total_amount != null
    ? pkg.total_amount
    : raw.amount != null
      ? raw.amount
      : 0;

  return {
    id: raw._id || raw.id || bookingId,
    booking_id: bookingId,
    name: customer.name || '',
    email: customer.email || '',
    gender: GENDER_MAP[customer.gender] || customer.gender || '',
    country_code: customer.country_code || '',
    phone,
    governorate: address.governorate || address.governarate || '',
    area: address.area || '',
    block: address.block || '',
    street: address.street || '',
    building_no: address.building_no || address.building_number || '',
    floor_no: address.floor_no || address.floor || '',
    flat_no: address.flat_no || address.flat || '',
    paci_details: address.paci_details || '',
    lat: address.lat ?? null,
    lng: address.lng ?? null,
    google_location: address.google_location || customer.google_location || '',
    vehicle_id: vehicle.vehicle_id || vehicle._id || '',
    vehicle_model: vehicle.vehicle_model || String(vehicle.model_id || ''),
    vehicle_registration: vehicle.registration_number || '',
    mileage: vehicle.mileage != null ? String(vehicle.mileage) : '',
    service_package: {
      id: packageId,
      name: pkg.name || '',
      amount: String(packageAmount),
    },
    booking_date: schedule.date || raw.booking_date || '',
    booking_time: schedule.start_time || raw.booking_time || '',
    status: raw.status || 'pending',
    amount: String(packageAmount),
    technician_detail: assignment.technician
      ? typeof assignment.technician === 'object'
        ? { id: assignment.technician._id || assignment.technician.id, name: assignment.technician.name || '' }
        : { id: assignment.technician, name: '' }
      : null,
    driver_detail: assignment.driver
      ? typeof assignment.driver === 'object'
        ? { id: assignment.driver._id || assignment.driver.id, name: assignment.driver.name || '' }
        : { id: assignment.driver, name: '' }
      : null,
    service_van: assignment.service_van
      ? typeof assignment.service_van === 'object'
        ? { id: assignment.service_van._id || assignment.service_van.id, registration_number: assignment.service_van.registration_number || '' }
        : { id: assignment.service_van, registration_number: '' }
      : null,
    additional_notes: raw.additional_notes || '',
    payment: raw.payment || {},
    service_progress: raw.service_progress || {},
  };
}

export function transformBookings(rawList) {
  return (rawList || []).map(transformBooking);
}
