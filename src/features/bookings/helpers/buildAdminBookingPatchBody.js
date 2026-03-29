/**
 * Builds the PATCH body for PUT /bookings/admin/:id on the admin API.
 */
export function buildAdminBookingPatchBody(payload) {
  const schedule = { date: payload.booking_date };
  if (payload.booking_time) {
    schedule.start_time = payload.booking_time;
  }

  return {
    booking_status: payload.status,
    schedule,
    customer: {
      phone: payload.phone.trim(),
      country_code: payload.country_code,
      address: {
        governorate: payload.governorate.trim(),
        area: payload.area.trim(),
        block: payload.block.trim(),
        street: payload.street.trim(),
        building_no: payload.building_no.trim(),
        floor_no: payload.floor_no.trim(),
        flat_no: payload.flat_no.trim(),
        paci_details: payload.paci_details.trim(),
        lat: payload.locationData?.lat ?? null,
        lng: payload.locationData?.lng ?? null,
      },
    },
  };
}

/** Merges modal payload into list row shape when PATCH response has no booking object. */
export function localBookingUpdatesFromPatchPayload(payload) {
  const cc = String(payload.country_code || '').trim();
  const phone = String(payload.phone || '').trim();
  const normalizedCc = cc.startsWith('+') ? cc : cc ? `+${cc}` : '';
  const combinedPhone =
    normalizedCc && phone ? `${normalizedCc}${phone}` : phone;

  return {
    name: payload.name,
    phone: combinedPhone,
    booking_date: payload.booking_date,
    booking_time: payload.booking_time,
    status: payload.status,
    amount: payload.amount,
    governorate: payload.governorate,
    area: payload.area,
    block: payload.block,
    street: payload.street,
    building_no: payload.building_no,
    floor_no: payload.floor_no,
    flat_no: payload.flat_no,
    paci_details: payload.paci_details,
    lat: payload.locationData?.lat ?? null,
    lng: payload.locationData?.lng ?? null,
  };
}
