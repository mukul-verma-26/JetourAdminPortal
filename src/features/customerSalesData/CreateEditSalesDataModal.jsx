import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import {
  CUSTOMER_STATUS_OPTIONS,
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  SALES_LABEL_OPTIONS,
  getModelYearOptions,
} from './constants';
import DatePicker from './components/DatePicker';
import styles from './CreateEditSalesDataModal.module.scss';

const STATUS_OPTIONS_FOR_FORM = CUSTOMER_STATUS_OPTIONS.filter(
  (o) => o.value !== 'all'
);
const PHONE_PREFIX = '+965';
const MODEL_YEAR_OPTIONS = getModelYearOptions();

function CreateEditSalesDataModal({
  open,
  onClose,
  initialData,
  onSubmit,
  vehicleOptions,
}) {
  const [formData, setFormData] = useState({
    customerContactNumber: '',
    vehicleId: '',
    registrationNumber: '',
    vin: '',
    modelYear: '',
    variantName: '',
    color: '',
    lastServiceDate: '',
    lastRecordedMileage: '',
    transmission: '',
    fuelType: 'petrol',
    salesLabel: '',
    customerStatus: 'active',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      const phoneDigits = (initialData.customerContactNumber || '').replace(/\D/g, '').slice(-8);
      setFormData({
        customerContactNumber: phoneDigits,
        vehicleId: initialData.vehicleId || '',
        registrationNumber: initialData.registrationNumber || '',
        vin: initialData.vin || '',
        modelYear: initialData.modelYear || '',
        variantName: initialData.variantName || '',
        color: initialData.color || '',
        lastServiceDate: initialData.lastServiceDate || '',
        lastRecordedMileage: initialData.lastRecordedMileage || '',
        transmission: initialData.transmission || '',
        fuelType: initialData.fuelType || 'petrol',
        salesLabel: initialData.salesLabel || '',
        customerStatus: initialData.customerStatus || 'active',
      });
    } else {
      setFormData({
        customerContactNumber: '',
        vehicleId: '',
        registrationNumber: '',
        vin: '',
        modelYear: '',
        variantName: '',
        color: '',
        lastServiceDate: '',
        lastRecordedMileage: '',
        transmission: '',
        fuelType: 'petrol',
        salesLabel: '',
        customerStatus: 'active',
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerContactNumber.trim()) {
      newErrors.customerContactNumber = 'Customer contact number is required';
    } else if (!validatePhone(formData.customerContactNumber)) {
      newErrors.customerContactNumber = 'Please enter a valid phone number (7-8 digits only)';
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.vin.trim()) {
      newErrors.vin = 'VIN is required';
    }

    if (!formData.modelYear) {
      newErrors.modelYear = 'Model year is required';
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'Fuel type is required';
    }

    if (!formData.customerStatus) {
      newErrors.customerStatus = 'Customer status is required';
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
    setFormData((prev) => ({ ...prev, customerContactNumber: value }));
    if (errors.customerContactNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customerContactNumber;
        return newErrors;
      });
    }
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({ ...prev, lastServiceDate: e.target.value }));
    if (errors.lastServiceDate) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.lastServiceDate;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      customerContactNumber: formData.customerContactNumber.trim()
        ? `${PHONE_PREFIX}${formData.customerContactNumber.trim()}`
        : '',
      vehicleId: formData.vehicleId,
      registrationNumber: formData.registrationNumber.trim(),
      vin: formData.vin.trim(),
      modelYear: formData.modelYear,
      variantName: formData.variantName.trim(),
      color: formData.color.trim(),
      lastServiceDate: formData.lastServiceDate || null,
      lastRecordedMileage: formData.lastRecordedMileage.trim() || null,
      transmission: formData.transmission || null,
      fuelType: formData.fuelType,
      salesLabel: formData.salesLabel || null,
      customerStatus: formData.customerStatus,
    };

    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }

    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Sales Data' : 'Add Sales Data';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-data-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="sales-data-modal-title" className={styles.title}>
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
              <label htmlFor="customer-contact" className={styles.label}>
                Customer Contact Number <span className={styles.required}>*</span>
              </label>
              <div className={styles.phoneInputWrapper}>
                <span className={styles.phonePrefix}>{PHONE_PREFIX}</span>
                <input
                  id="customer-contact"
                  name="customerContactNumber"
                  type="tel"
                  inputMode="numeric"
                  className={`${styles.input} ${styles.phoneInput} ${errors.customerContactNumber ? styles.inputError : ''}`}
                  placeholder="12345678"
                  value={formData.customerContactNumber}
                  onChange={handlePhoneChange}
                  maxLength={8}
                />
              </div>
              {errors.customerContactNumber && (
                <div className={styles.errorMessage}>{errors.customerContactNumber}</div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="vehicle" className={styles.label}>
                Vehicle <span className={styles.required}>*</span>
              </label>
              <select
                id="vehicle"
                name="vehicleId"
                className={`${styles.select} ${errors.vehicleId ? styles.inputError : ''}`}
                value={formData.vehicleId}
                onChange={handleChange}
              >
                <option value="">Select vehicle</option>
                {vehicleOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <div className={styles.errorMessage}>{errors.vehicleId}</div>
              )}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="registration" className={styles.label}>
                Registration Number <span className={styles.required}>*</span>
              </label>
              <input
                id="registration"
                name="registrationNumber"
                type="text"
                className={`${styles.input} ${errors.registrationNumber ? styles.inputError : ''}`}
                placeholder="e.g. ABC 1234"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
              {errors.registrationNumber && (
                <div className={styles.errorMessage}>{errors.registrationNumber}</div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="vin" className={styles.label}>
                VIN - Vehicle Identification Number <span className={styles.required}>*</span>
              </label>
              <input
                id="vin"
                name="vin"
                type="text"
                className={`${styles.input} ${errors.vin ? styles.inputError : ''}`}
                placeholder="17-character VIN"
                value={formData.vin}
                onChange={handleChange}
              />
              {errors.vin && (
                <div className={styles.errorMessage}>{errors.vin}</div>
              )}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="model-year" className={styles.label}>
                Model Year <span className={styles.required}>*</span>
              </label>
              <select
                id="model-year"
                name="modelYear"
                className={`${styles.select} ${errors.modelYear ? styles.inputError : ''}`}
                value={formData.modelYear}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                {MODEL_YEAR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.modelYear && (
                <div className={styles.errorMessage}>{errors.modelYear}</div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="variant-name" className={styles.label}>
                Variant Name
              </label>
              <input
                id="variant-name"
                name="variantName"
                type="text"
                className={styles.input}
                placeholder="e.g. Luxury Edition"
                value={formData.variantName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="color" className={styles.label}>
                Color
              </label>
              <input
                id="color"
                name="color"
                type="text"
                className={styles.input}
                placeholder="e.g. Pearl White"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="last-service-date" className={styles.label}>
                Last Service Date (If Serviced at Budastoor)
              </label>
              <DatePicker
                id="last-service-date"
                name="lastServiceDate"
                value={formData.lastServiceDate}
                onChange={handleDateChange}
                error={errors.lastServiceDate}
                placeholder="Select date"
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="last-mileage" className={styles.label}>
                Last Recorded Mileage
              </label>
              <input
                id="last-mileage"
                name="lastRecordedMileage"
                type="text"
                inputMode="numeric"
                className={styles.input}
                placeholder="e.g. 50000"
                value={formData.lastRecordedMileage}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="transmission" className={styles.label}>
                Transmission
              </label>
              <select
                id="transmission"
                name="transmission"
                className={styles.select}
                value={formData.transmission}
                onChange={handleChange}
              >
                {TRANSMISSION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="fuel-type" className={styles.label}>
                Fuel Type <span className={styles.required}>*</span>
              </label>
              <select
                id="fuel-type"
                name="fuelType"
                className={`${styles.select} ${errors.fuelType ? styles.inputError : ''}`}
                value={formData.fuelType}
                onChange={handleChange}
              >
                {FUEL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.fuelType && (
                <div className={styles.errorMessage}>{errors.fuelType}</div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="sales-label" className={styles.label}>
                Sales Label
              </label>
              <select
                id="sales-label"
                name="salesLabel"
                className={styles.select}
                value={formData.salesLabel}
                onChange={handleChange}
              >
                {SALES_LABEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="customer-status" className={styles.label}>
                Customer Status <span className={styles.required}>*</span>
              </label>
              <select
                id="customer-status"
                name="customerStatus"
                className={`${styles.select} ${errors.customerStatus ? styles.inputError : ''}`}
                value={formData.customerStatus}
                onChange={handleChange}
              >
                {STATUS_OPTIONS_FOR_FORM.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.customerStatus && (
                <div className={styles.errorMessage}>{errors.customerStatus}</div>
              )}
            </div>
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
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditSalesDataModal;
