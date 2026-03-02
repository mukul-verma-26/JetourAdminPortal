import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import {
  CUSTOMER_STATUS_OPTIONS,
  DEFAULT_COUNTRY_CODE,
  GENDER_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
} from './constants';
import { buildCustomerPayload } from './helpers';
import DatePicker from './components/DatePicker';
import GoogleLocationInput from './components/GoogleLocationInput';
import styles from './CreateEditCustomerModal.module.scss';

const STATUS_OPTIONS_FOR_FORM = CUSTOMER_STATUS_OPTIONS.filter(
  (o) => o.value !== 'all'
);

function CreateEditCustomerModal({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    country_code: DEFAULT_COUNTRY_CODE,
    phone: '',
    dob: '',
    email: '',
    civilId: '',
    gender: 'male',
    passportNumber: '',
    nationality: '',
    preferredLanguage: 'english',
    status: 'active',
    governorate: '',
    area: '',
    block: '',
    street: '',
    building_no: '',
    floor_no: '',
    flat_no: '',
    paci_details: '',
    google_location: '',
    locationData: null,
  });
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      const fullPhone = (initialData.phone || initialData.contact_number || '').trim();
      const digitsOnly = fullPhone.replace(/\D/g, '');
      let countryCode = DEFAULT_COUNTRY_CODE;
      let phoneDigits = digitsOnly.slice(0, 15);
      if (fullPhone.startsWith('+')) {
        const match = fullPhone.match(/^\+(\d{1,4})(\d*)$/);
        if (match) {
          countryCode = match[1];
          phoneDigits = match[2].replace(/\D/g, '').slice(0, 15);
        }
      } else if (digitsOnly.startsWith('965') && digitsOnly.length > 8) {
        countryCode = '965';
        phoneDigits = digitsOnly.slice(3).slice(0, 15);
      } else if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
        countryCode = '91';
        phoneDigits = digitsOnly.slice(2).slice(0, 15);
      }
      setFormData({
        name: initialData.name || '',
        country_code: countryCode,
        phone: phoneDigits,
        dob: initialData.dob || '',
        email: initialData.email || '',
        civilId: initialData.civilId || '',
        gender: (initialData.gender === 'other' || initialData.gender === 'others' ? 'male' : initialData.gender) || 'male',
        passportNumber: initialData.passportNumber || '',
        nationality: initialData.nationality || '',
        preferredLanguage: initialData.preferredLanguage || 'english',
        status: initialData.status || 'active',
        governorate: initialData.governorate || '',
        area: initialData.area || '',
        block: initialData.block || '',
        street: initialData.street || '',
        building_no: initialData.building_no || '',
        floor_no: initialData.floor_no || '',
        flat_no: initialData.flat_no || '',
        paci_details: initialData.paci_details || '',
        google_location: initialData.google_location || '',
        locationData: initialData.locationData || null,
      });
    } else {
      setFormData({
        name: '',
        country_code: DEFAULT_COUNTRY_CODE,
        phone: '',
        dob: '',
        email: '',
        civilId: '',
        gender: 'male',
        passportNumber: '',
        nationality: '',
        preferredLanguage: 'english',
        status: 'active',
        governorate: '',
        area: '',
        block: '',
        street: '',
        building_no: '',
        floor_no: '',
        flat_no: '',
        paci_details: '',
        google_location: '',
        locationData: null,
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validateEmail = (email) => {
    if (!email.trim()) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const digits = (phone || '').replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be 8-15 digits';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }

    if (!formData.google_location.trim()) {
      newErrors.google_location = 'Customer Google Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCountryCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, country_code: value }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({ ...prev, dob: e.target.value }));
    if (errors.dob) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dob;
        return newErrors;
      });
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    const locationData = e.target.locationData;
    setFormData((prev) => ({
      ...prev,
      google_location: value,
      locationData: locationData,
    }));
    if (errors.google_location) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.google_location;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const countryCode = formData.country_code?.replace(/\D/g, '') || DEFAULT_COUNTRY_CODE;
    const fullPhone = formData.phone.trim()
      ? `+${countryCode}${formData.phone.replace(/\D/g, '')}`
      : '';
    const payload = buildCustomerPayload({
      ...formData,
      country_code: fullPhone ? `+${countryCode}` : '',
      contact_number: fullPhone,
    });

    try {
      if (isEdit) {
        await onSubmit(initialData.id, payload);
      } else {
        await onSubmit(payload);
      }
      onClose();
    } catch {
      // Error handled in useCustomers
    }
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Customer' : 'Add Customer';

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="customer-modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-name" className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                id="customer-name"
                name="name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-phone" className={styles.label}>
                Contact Number <span className={styles.required}>*</span>
              </label>
              <div className={styles.phoneInputRow}>
                <div className={styles.countryCodeWrapper}>
                  <span className={styles.phonePrefixFixed} aria-hidden="true">+</span>
                  <input
                    id="customer-country-code"
                    name="country_code"
                    type="tel"
                    inputMode="numeric"
                    className={`${styles.input} ${styles.countryCodeInput}`}
                    placeholder="965"
                    value={formData.country_code}
                    onChange={handleCountryCodeChange}
                    maxLength={4}
                    aria-label="Country code"
                  />
                </div>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  className={`${styles.input} ${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="12345678"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  aria-label="Phone number"
                />
              </div>
              {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-dob" className={styles.label}>
                Date Of Birth <span className={styles.required}>*</span>
              </label>
              <DatePicker
                id="customer-dob"
                name="dob"
                value={formData.dob}
                onChange={handleDateChange}
                error={errors.dob}
                placeholder="Select date of birth"
              />
              {errors.dob && <div className={styles.errorMessage}>{errors.dob}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-email" className={styles.label}>
                Email
              </label>
              <input
                id="customer-email"
                name="email"
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="customer@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-civilId" className={styles.label}>
                Civil ID
              </label>
              <input
                id="customer-civilId"
                name="civilId"
                type="text"
                className={`${styles.input} ${errors.civilId ? styles.inputError : ''}`}
                placeholder="Civil ID"
                value={formData.civilId}
                onChange={handleChange}
              />
              {errors.civilId && <div className={styles.errorMessage}>{errors.civilId}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-gender" className={styles.label}>
                Gender <span className={styles.required}>*</span>
              </label>
              <select
                id="customer-gender"
                name="gender"
                className={`${styles.select} ${errors.gender ? styles.inputError : ''}`}
                value={formData.gender}
                onChange={handleChange}
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.gender && <div className={styles.errorMessage}>{errors.gender}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-passportNumber" className={styles.label}>
                Passport Number
              </label>
              <input
                id="customer-passportNumber"
                name="passportNumber"
                type="text"
                className={`${styles.input} ${errors.passportNumber ? styles.inputError : ''}`}
                placeholder="Passport number"
                value={formData.passportNumber}
                onChange={handleChange}
              />
              {errors.passportNumber && <div className={styles.errorMessage}>{errors.passportNumber}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-nationality" className={styles.label}>
                Nationality <span className={styles.required}>*</span>
              </label>
              <input
                id="customer-nationality"
                name="nationality"
                type="text"
                className={`${styles.input} ${errors.nationality ? styles.inputError : ''}`}
                placeholder="e.g. Kuwaiti"
                value={formData.nationality}
                onChange={handleChange}
              />
              {errors.nationality && <div className={styles.errorMessage}>{errors.nationality}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-preferredLanguage" className={styles.label}>
                Preferred Language
              </label>
              <select
                id="customer-preferredLanguage"
                name="preferredLanguage"
                className={styles.select}
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                {PREFERRED_LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {isEdit && (
              <div className={styles.field}>
                <label htmlFor="customer-status" className={styles.label}>
                  Status
                </label>
                <select
                  id="customer-status"
                  name="status"
                  className={styles.select}
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS_FOR_FORM.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <h3 className={styles.sectionTitle}>Address Details</h3>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-governorate" className={styles.label}>
                Customer Address - Governorate
              </label>
              <input
                id="customer-governorate"
                name="governorate"
                type="text"
                className={styles.input}
                placeholder="e.g. Kuwait City"
                value={formData.governorate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-area" className={styles.label}>
                Customer Address - Area
              </label>
              <input
                id="customer-area"
                name="area"
                type="text"
                className={styles.input}
                placeholder="e.g. Salmiya"
                value={formData.area}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-block" className={styles.label}>
                Customer Address - Block
              </label>
              <input
                id="customer-block"
                name="block"
                type="text"
                className={styles.input}
                placeholder="e.g. Block 5"
                value={formData.block}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-street" className={styles.label}>
                Customer Address - Street
              </label>
              <input
                id="customer-street"
                name="street"
                type="text"
                className={styles.input}
                placeholder="e.g. Street 12"
                value={formData.street}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-building_no" className={styles.label}>
                Customer Address - Building No.
              </label>
              <input
                id="customer-building_no"
                name="building_no"
                type="text"
                className={styles.input}
                placeholder="e.g. 123"
                value={formData.building_no}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-floor_no" className={styles.label}>
                Customer Address - Floor No.
              </label>
              <input
                id="customer-floor_no"
                name="floor_no"
                type="text"
                className={styles.input}
                placeholder="e.g. 2"
                value={formData.floor_no}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-flat_no" className={styles.label}>
                Customer Address - Flat No.
              </label>
              <input
                id="customer-flat_no"
                name="flat_no"
                type="text"
                className={styles.input}
                placeholder="e.g. 5"
                value={formData.flat_no}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="customer-paci_details" className={styles.label}>
                Customer PACI Details
              </label>
              <input
                id="customer-paci_details"
                name="paci_details"
                type="text"
                className={styles.input}
                placeholder="e.g. PACI reference number"
                value={formData.paci_details}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="customer-google_location" className={styles.label}>
              Customer Google Location <span className={styles.required}>*</span>
            </label>
            <GoogleLocationInput
              id="customer-google_location"
              name="google_location"
              value={formData.google_location}
              onChange={handleLocationChange}
              error={errors.google_location}
              placeholder="Search for location on Google Maps..."
            />
            {errors.google_location && <div className={styles.errorMessage}>{errors.google_location}</div>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditCustomerModal;
