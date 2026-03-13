const GENDER_TO_API = {
  male: 'Male',
  female: 'Female',
  others: 'Others',
};

const LANGUAGE_TO_API = {
  english: 'english',
  arabic: 'arabic',
};

export function buildCustomerPayload(formData) {
  const countryCode = formData.country_code || '';
  const contactNumber = formData.contact_number || formData.phone;
  const phone = typeof contactNumber === 'string'
    ? contactNumber.trim()
    : '';
  const fullPhone = phone.startsWith('+')
    ? phone
    : countryCode
      ? `${countryCode.startsWith('+') ? countryCode : `+${countryCode}`}${phone.replace(/\D/g, '')}`
      : `+965${phone.replace(/\D/g, '').slice(-8)}`;

  const locationData = formData.locationData || {};
  const lat = locationData.lat != null ? Number(locationData.lat) : undefined;
  const lng = locationData.lng != null ? Number(locationData.lng) : undefined;

  const payload = {
    name: String(formData.name || '').trim(),
    country_code: countryCode ? (countryCode.startsWith('+') ? countryCode : `+${countryCode}`) : '',
    contact_number: fullPhone,
    date_of_birth: formData.date_of_birth || formData.dob || '',
    email: String(formData.email || '').trim(),
    civil_id: String(formData.civil_id || formData.civilId || '').trim(),
    gender: GENDER_TO_API[formData.gender] || formData.gender || 'Male',
    passport_number: String(formData.passport_number || formData.passportNumber || '').trim(),
    nationality: String(formData.nationality || '').trim(),
    preferred_language: LANGUAGE_TO_API[formData.preferredLanguage] || (formData.preferred_language || 'english').toLowerCase(),
    full_address: {
      governorate: String(formData.governorate || '').trim(),
      area: String(formData.area || '').trim(),
      block: String(formData.block || '').trim(),
      street: String(formData.street || '').trim(),
      building_number: String(formData.building_no || formData.building_number || '').trim(),
      floor_number: String(formData.floor_no || formData.floor_number || '').trim(),
      flat_number: String(formData.flat_no || formData.flat_number || '').trim(),
      paci_details: String(formData.paci_details || '').trim(),
    },
  };

  if (lat != null && lng != null) {
    payload.lat = lat;
    payload.lng = lng;
  }

  return payload;
}

export function mapCustomerFromApi(item) {
  if (!item) return null;
  const fullAddr = item.full_address || item.address?.full_address || {};
  const addr = item.address || {};
  const id = item.id || item.customer_id || item._id;
  const phone = item.contact_number || item.phone;
  const dob = item.date_of_birth || item.dob;
  const lat = item.lat != null ? item.lat : addr.lat;
  const lng = item.lng != null ? item.lng : addr.lng;

  const mapped = {
    id,
    _id: item._id || id,
    customerId: item.id || item.customer_id || item.customerId || id,
    name: item.name || '',
    phone,
    contact_number: phone,
    email: item.email || '',
    civilId: item.civil_id || item.civilId || '',
    civil_id: item.civil_id,
    gender: (item.gender || '').toLowerCase(),
    passportNumber: item.passport_number || item.passportNumber || '',
    nationality: item.nationality || '',
    preferredLanguage: (() => {
      const lang = (item.preferred_language || item.preferredLanguage || 'english').toLowerCase();
      if (lang === 'en') return 'english';
      if (lang === 'ar') return 'arabic';
      return lang;
    })(),
    dob,
    date_of_birth: dob,
    status: item.status || 'active',
    joiningDate: item.joining_date || item.joiningDate || item.created_at,
    governorate: fullAddr.governorate || '',
    area: fullAddr.area || '',
    block: fullAddr.block || '',
    street: fullAddr.street || '',
    building_no: fullAddr.building_number || fullAddr.building_no || '',
    floor_no: fullAddr.floor_number || fullAddr.floor_no || '',
    flat_no: fullAddr.flat_number || fullAddr.flat_no || '',
    paci_details: fullAddr.paci_details || '',
    google_location:
      addr.google_location ||
      item.google_location ||
      '',
    address: formatAddressForDisplay({ ...addr, full_address: fullAddr }),
    vehicles: Array.isArray(item.vehicles) ? item.vehicles : [],
  };

  if (lat != null && lng != null) {
    mapped.locationData = { lat, lng };
  }

  return mapped;
}

function formatAddressForDisplay(addr) {
  if (!addr) return '';
  const full = addr.full_address;
  if (!full) return addr.google_location || '';
  const parts = [
    full.governorate,
    full.area,
    full.block,
    full.street,
    full.building_number,
    full.floor_number,
    full.flat_number,
    full.paci_details,
  ].filter(Boolean);
  return parts.join(', ') || addr.google_location || '';
}
