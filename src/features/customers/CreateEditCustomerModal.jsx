import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import {
  CUSTOMER_STATUS_OPTIONS,
  GENDER_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
} from './constants';
import DatePicker from './components/DatePicker';
import GoogleLocationInput from './components/GoogleLocationInput';
import styles from './CreateEditCustomerModal.module.scss';

const STATUS_OPTIONS_FOR_FORM = CUSTOMER_STATUS_OPTIONS.filter(
  (o) => o.value !== 'all'
);

const PHONE_PREFIX = '+965';

function CreateEditCustomerModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    email: '',
    civilId: '',
    gender: 'male',
    passportNumber: '',
    nationality: '',
    preferredLanguage: 'en',
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
    vehicles: [],
    vehiclesDisplay: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      const phoneDigits = (initialData.phone || '').replace(/\D/g, '').slice(-8);
      const vehiclesDisplay =
        Array.isArray(initialData.vehicles) && initialData.vehicles.length > 0
          ? initialData.vehicles
              .map((v) => (typeof v === 'object' ? v.modelName : v))
              .join('\n')
          : '';
      setFormData({
        name: initialData.name || '',
        phone: phoneDigits,
        dob: initialData.dob || '',
        email: initialData.email || '',
        civilId: initialData.civilId || '',
        gender: (initialData.gender === 'other' ? 'others' : initialData.gender) || 'male',
        passportNumber: initialData.passportNumber || '',
        nationality: initialData.nationality || '',
        preferredLanguage: initialData.preferredLanguage || 'en',
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
        vehicles: initialData.vehicles || [],
        vehiclesDisplay,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        dob: '',
        email: '',
        civilId: '',
        gender: 'male',
        passportNumber: '',
        nationality: '',
        preferredLanguage: 'en',
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
        vehicles: [],
        vehiclesDisplay: '',
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
    const phoneRegex = /^\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (7-8 digits only)';
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

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      gender: formData.gender,
      dob: formData.dob,
      phone: formData.phone.trim() ? `${PHONE_PREFIX}${formData.phone.trim()}` : '',
      email: formData.email.trim(),
      civilId: formData.civilId.trim(),
      passportNumber: formData.passportNumber.trim(),
      nationality: formData.nationality.trim(),
      preferredLanguage: formData.preferredLanguage,
      status: formData.status,
      governorate: formData.governorate.trim(),
      area: formData.area.trim(),
      block: formData.block.trim(),
      street: formData.street.trim(),
      building_no: formData.building_no.trim(),
      floor_no: formData.floor_no.trim(),
      flat_no: formData.flat_no.trim(),
      paci_details: formData.paci_details.trim(),
      google_location: formData.google_location.trim(),
      locationData: formData.locationData || null,
    };

    if (isEdit) {
      const vehiclesRaw = (formData.vehiclesDisplay || '').trim();
      const vehicles = vehiclesRaw
        ? vehiclesRaw
            .split(/\n/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((modelName) => ({ modelName }))
        : [];
      payload.vehicles = vehicles;
      onSubmit(initialData.id, payload);
    } else {
      payload.vehicles = [];
      onSubmit(payload);
    }

    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Customer' : 'Add Customer';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
              <div className={styles.phoneInputWrapper}>
                <span className={styles.phonePrefix}>{PHONE_PREFIX}</span>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  className={`${styles.input} ${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="12345678"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={8}
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

          {isEdit && (
            <div className={styles.editSection}>
              <div className={styles.field}>
                <label htmlFor="customer-vehicles" className={styles.label}>
                  Vehicles (one model name per line)
                </label>
                <textarea
                  id="customer-vehicles"
                  name="vehicles"
                  className={styles.textarea}
                  placeholder={'JETOUR X70\nJETOUR X90'}
                  rows={3}
                  value={formData.vehiclesDisplay}
                  onChange={(e) => handleChange({ target: { name: 'vehiclesDisplay', value: e.target.value } })}
                />
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditCustomerModal;
