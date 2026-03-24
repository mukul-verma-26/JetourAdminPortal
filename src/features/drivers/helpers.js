import { DEFAULT_COUNTRY_CODE } from './constants';

export function parseContactToDigits(contact) {
  if (!contact) return '';
  const digits = contact.replace(/\D/g, '');
  return digits.slice(0, 15);
}

/**
 * Normalizes API/driver list items into display + form fields.
 * When API sends country_code + local contact, use both; otherwise parse legacy full contact.
 */
export function buildDriverContactFieldsFromApi(item) {
  if (!item) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      localPhone: '',
      contactDisplay: '',
    };
  }
  const ccDigits =
    item.country_code != null && String(item.country_code).replace(/\D/g, '') !== ''
      ? String(item.country_code).replace(/\D/g, '')
      : '';
  const contactRaw = item.contact != null ? String(item.contact) : '';

  if (ccDigits) {
    const allDigits = contactRaw.replace(/\D/g, '');
    let localPhone = '';
    if (allDigits.length > ccDigits.length && allDigits.startsWith(ccDigits)) {
      localPhone = allDigits.slice(ccDigits.length).slice(0, 15);
    } else {
      localPhone = allDigits.slice(0, 15);
    }
    const contactDisplay = localPhone ? `+${ccDigits} ${localPhone}` : `+${ccDigits}`;
    return { countryCode: ccDigits, localPhone, contactDisplay };
  }

  const parsed = parseContactToCountryCodeAndPhone(contactRaw, DEFAULT_COUNTRY_CODE);
  const contactDisplay =
    contactRaw.trim() ||
    (parsed.phone ? `+${parsed.country_code} ${parsed.phone}` : '');
  return {
    countryCode: parsed.country_code,
    localPhone: parsed.phone,
    contactDisplay,
  };
}

/** After create payload: country_code + contact are both digit strings (local phone). */
export function buildDriverContactDisplayFromPayload(payload) {
  const cc =
    String(payload?.country_code || '').replace(/\D/g, '') || DEFAULT_COUNTRY_CODE;
  const loc = String(payload?.contact || '').replace(/\D/g, '');
  return {
    countryCode: cc,
    localPhone: loc,
    contactDisplay: loc ? `+${cc} ${loc}` : `+${cc}`,
  };
}

export function parseContactToCountryCodeAndPhone(contact, defaultCountryCode = '965') {
  if (!contact) return { country_code: defaultCountryCode, phone: '' };
  const fullPhone = String(contact).trim();
  const digitsOnly = fullPhone.replace(/\D/g, '');
  let countryCode = defaultCountryCode;
  let phone = digitsOnly.slice(0, 15);
  const compactForPlus = fullPhone.replace(/\s/g, '');
  if (compactForPlus.startsWith('+')) {
    const afterPlus = compactForPlus.slice(1);
    const match = afterPlus.match(/^(\d{1,4})(\d+)$/);
    if (match) {
      countryCode = match[1];
      phone = match[2].replace(/\D/g, '').slice(0, 15);
      return { country_code: countryCode, phone };
    }
  }
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
