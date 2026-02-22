export function parseContactToDigits(contact) {
  if (!contact) return '';
  const digits = contact.replace(/\D/g, '');
  return digits.slice(0, 15);
}

export function parseContactToCountryCodeAndPhone(contact, defaultCountryCode = '965') {
  if (!contact) return { country_code: defaultCountryCode, phone: '' };
  const fullPhone = String(contact).trim();
  const digitsOnly = fullPhone.replace(/\D/g, '');
  let countryCode = defaultCountryCode;
  let phone = digitsOnly.slice(0, 15);
  if (fullPhone.startsWith('+')) {
    const match = fullPhone.match(/^\+(\d{1,4})(\d*)$/);
    if (match) {
      countryCode = match[1];
      phone = match[2].replace(/\D/g, '').slice(0, 15);
    }
  } else if (digitsOnly.startsWith('965') && digitsOnly.length > 8) {
    countryCode = '965';
    phone = digitsOnly.slice(3).slice(0, 15);
  } else if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
    countryCode = '91';
    phone = digitsOnly.slice(2).slice(0, 15);
  }
  return { country_code: countryCode, phone };
}

export function validateCivilId(civilId) {
  if (!civilId || !civilId.trim()) return false;
  const trimmed = civilId.trim();
  return /^\d{10,12}$/.test(trimmed);
}

export function getRatingVal(val) {
  if (val === '' || val === undefined || val === null) return 0;
  const num = parseInt(String(val), 10);
  return Number.isNaN(num) ? 0 : Math.min(5, Math.max(0, num));
}
