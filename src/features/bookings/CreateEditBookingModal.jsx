import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import {
  STATUS_OPTIONS,
  GENDER_OPTIONS,
  SERVICE_OPTIONS,
  VEHICLES,
  VEHICLE_TIER,
  TECHNICIANS,
  DRIVERS,
  SERVICE_VANS,
} from './constants';
import TimePicker from './components/TimePicker';
import DatePicker from './components/DatePicker';
import GoogleLocationInput from './components/GoogleLocationInput';
import styles from './CreateEditBookingModal.module.scss';

function CreateEditBookingModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'M',
    phone: '',
    governorate: '',
    area: '',
    block: '',
    street: '',
    building_no: '',
    floor_no: '',
    flat_no: '',
    paci_details: '',
    google_location: '',
    vehicle_model: '',
    vehicle_registration: '',
    vehicle_year: '',
    mileage: '',
    service_package_id: '',
    booking_time: '',
    booking_date: '',
    status: 'pending',
    driver_id: '',
    technician_id: '',
    service_van_id: '',
    additional_notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        gender: initialData.gender || 'M',
        phone: initialData.phone || '',
        governorate: initialData.governorate || '',
        area: initialData.area || '',
        block: initialData.block || '',
        street: initialData.street || '',
        building_no: initialData.building_no || '',
        floor_no: initialData.floor_no || '',
        flat_no: initialData.flat_no || '',
        paci_details: initialData.paci_details || '',
        google_location: initialData.google_location || '',
        vehicle_model: initialData.vehicle_model || '',
        vehicle_registration: initialData.vehicle_registration || '',
        vehicle_year: initialData.vehicle_year || '',
        mileage: initialData.mileage || '',
        service_package_id: initialData.service_package?.id || '',
        booking_time: initialData.booking_time || '',
        booking_date: initialData.booking_date || '',
        status: initialData.status || 'pending',
        driver_id: initialData.driver_detail?.id || '',
        technician_id: initialData.technician_detail?.id || '',
        service_van_id: initialData.service_van?.id || '',
        additional_notes: initialData.additional_notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        gender: 'M',
        phone: '',
        governorate: '',
        area: '',
        block: '',
        street: '',
        building_no: '',
        floor_no: '',
        flat_no: '',
        paci_details: '',
        google_location: '',
        vehicle_model: '',
        vehicle_registration: '',
        vehicle_year: '',
        mileage: '',
        service_package_id: '',
        booking_time: '',
        booking_date: '',
        status: 'pending',
        driver_id: '',
        technician_id: '',
        service_van_id: '',
        additional_notes: '',
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{7,8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateMileage = (mileage) => {
    if (!mileage) return false;
    const mileageRegex = /^[\d,]+$/;
    return mileageRegex.test(mileage);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Customer email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (7-8 digits)';
    }

    if (!formData.governorate.trim()) {
      newErrors.governorate = 'Governorate is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    if (!formData.block.trim()) {
      newErrors.block = 'Block is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street is required';
    }

    if (!formData.building_no.trim()) {
      newErrors.building_no = 'Building number is required';
    }

    if (!formData.floor_no.trim()) {
      newErrors.floor_no = 'Floor number is required';
    }

    if (!formData.flat_no.trim()) {
      newErrors.flat_no = 'Flat number is required';
    }

    if (!formData.paci_details.trim()) {
      newErrors.paci_details = 'PACI details is required';
    }

    if (!formData.vehicle_model.trim()) {
      newErrors.vehicle_model = 'Vehicle model is required';
    }

    if (!formData.vehicle_registration.trim()) {
      newErrors.vehicle_registration = 'Vehicle registration number is required';
    }

    if (!formData.vehicle_year.trim()) {
      newErrors.vehicle_year = 'Vehicle year is required';
    } else if (!/^\d{4}$/.test(formData.vehicle_year.trim())) {
      newErrors.vehicle_year = 'Enter a valid 4-digit year';
    }

    if (!formData.mileage.trim()) {
      newErrors.mileage = 'Mileage is required';
    } else if (!validateMileage(formData.mileage)) {
      newErrors.mileage = 'Mileage must contain only numbers and commas';
    }

    if (!formData.service_package_id) {
      newErrors.service_package_id = 'Service package is required';
    }

    if (!formData.booking_time) {
      newErrors.booking_time = 'Booking time is required';
    }

    if (!formData.booking_date) {
      newErrors.booking_date = 'Booking date is required';
    }

    if (isEdit && !formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.driver_id) {
      newErrors.driver_id = 'Driver is required';
    }

    if (!formData.technician_id) {
      newErrors.technician_id = 'Technician is required';
    }

    if (!formData.service_van_id) {
      newErrors.service_van_id = 'Service van is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const baseValid =
      formData.name.trim() &&
      formData.email.trim() &&
      validateEmail(formData.email) &&
      formData.gender &&
      formData.phone.trim() &&
      validatePhone(formData.phone) &&
      formData.governorate.trim() &&
      formData.area.trim() &&
      formData.block.trim() &&
      formData.street.trim() &&
      formData.building_no.trim() &&
      formData.floor_no.trim() &&
      formData.flat_no.trim() &&
      formData.paci_details.trim() &&
      formData.vehicle_model.trim() &&
      formData.vehicle_registration.trim() &&
      formData.vehicle_year.trim() &&
      /^\d{4}$/.test(formData.vehicle_year.trim()) &&
      formData.mileage.trim() &&
      validateMileage(formData.mileage) &&
      formData.service_package_id &&
      formData.booking_time &&
      formData.booking_date &&
      formData.driver_id &&
      formData.technician_id &&
      formData.service_van_id;

    if (isEdit) {
      return baseValid && formData.status;
    }
    return baseValid;
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
    const value = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, phone: value }));
    
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleVehicleYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, vehicle_year: value }));
    
    if (errors.vehicle_year) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.vehicle_year;
        return newErrors;
      });
    }
  };

  const handleMileageChange = (e) => {
    const value = e.target.value.replace(/[^\d,]/g, '');
    setFormData((prev) => ({ ...prev, mileage: value }));
    
    if (errors.mileage) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.mileage;
        return newErrors;
      });
    }
  };

  const handleTimeChange = (e) => {
    setFormData((prev) => ({ ...prev, booking_time: e.target.value }));
    
    if (errors.booking_time) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.booking_time;
        return newErrors;
      });
    }
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({ ...prev, booking_date: e.target.value }));
    
    if (errors.booking_date) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.booking_date;
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

    const selectedServicePackage = SERVICE_OPTIONS.find(
      (sp) => sp.id === formData.service_package_id
    );
    const selectedTechnician = TECHNICIANS.find(
      (t) => t.id === formData.technician_id
    );
    const selectedDriver = DRIVERS.find(
      (d) => d.id === formData.driver_id
    );
    const selectedServiceVan = SERVICE_VANS.find(
      (sv) => sv.id === formData.service_van_id
    );

    const vehicleTier = VEHICLE_TIER[formData.vehicle_model] || 'T1';
    const calculatedAmount = selectedServicePackage
      ? (vehicleTier === 'T2' ? selectedServicePackage.priceT2 : selectedServicePackage.priceT1)
      : '';

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      gender: formData.gender,
      phone: formData.phone.trim(),
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
      vehicle_model: formData.vehicle_model.trim(),
      vehicle_registration: formData.vehicle_registration.trim(),
      vehicle_year: formData.vehicle_year.trim(),
      mileage: formData.mileage.trim(),
      service_package: selectedServicePackage
        ? { id: selectedServicePackage.id, name: selectedServicePackage.name, amount: calculatedAmount }
        : null,
      booking_time: formData.booking_time,
      booking_date: formData.booking_date,
      ...(isEdit ? { status: formData.status } : {}),
      amount: calculatedAmount,
      technician_detail: selectedTechnician
        ? { id: selectedTechnician.id, name: selectedTechnician.name }
        : null,
      driver_detail: selectedDriver
        ? { id: selectedDriver.id, name: selectedDriver.name }
        : null,
      service_van: selectedServiceVan
        ? { id: selectedServiceVan.id, name: selectedServiceVan.name }
        : null,
      additional_notes: formData.additional_notes.trim(),
    };

    if (initialData?.id) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }

    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Booking' : 'Create Booking';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
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
          {/* Customer Details Section */}
          <h3 className={styles.sectionTitle}>Customer Details</h3>
          
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Customer Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Customer Email <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
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
              <label htmlFor="gender" className={styles.label}>
                Gender <span className={styles.required}>*</span>
              </label>
              <select
                id="gender"
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

            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <div className={styles.phoneInputWrapper}>
                <span className={styles.phonePrefix}>+965</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
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

          {/* Address Section */}
          <h3 className={styles.sectionTitle}>Address</h3>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="governorate" className={styles.label}>
                Governorate <span className={styles.required}>*</span>
              </label>
              <input
                id="governorate"
                name="governorate"
                type="text"
                className={`${styles.input} ${errors.governorate ? styles.inputError : ''}`}
                placeholder="e.g. Kuwait City"
                value={formData.governorate}
                onChange={handleChange}
              />
              {errors.governorate && <div className={styles.errorMessage}>{errors.governorate}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="area" className={styles.label}>
                Area <span className={styles.required}>*</span>
              </label>
              <input
                id="area"
                name="area"
                type="text"
                className={`${styles.input} ${errors.area ? styles.inputError : ''}`}
                placeholder="e.g. Salmiya"
                value={formData.area}
                onChange={handleChange}
              />
              {errors.area && <div className={styles.errorMessage}>{errors.area}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="block" className={styles.label}>
                Block <span className={styles.required}>*</span>
              </label>
              <input
                id="block"
                name="block"
                type="text"
                className={`${styles.input} ${errors.block ? styles.inputError : ''}`}
                placeholder="e.g. Block 5"
                value={formData.block}
                onChange={handleChange}
              />
              {errors.block && <div className={styles.errorMessage}>{errors.block}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="street" className={styles.label}>
                Street <span className={styles.required}>*</span>
              </label>
              <input
                id="street"
                name="street"
                type="text"
                className={`${styles.input} ${errors.street ? styles.inputError : ''}`}
                placeholder="e.g. Street 12"
                value={formData.street}
                onChange={handleChange}
              />
              {errors.street && <div className={styles.errorMessage}>{errors.street}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="building_no" className={styles.label}>
                Building No. <span className={styles.required}>*</span>
              </label>
              <input
                id="building_no"
                name="building_no"
                type="text"
                className={`${styles.input} ${errors.building_no ? styles.inputError : ''}`}
                placeholder="e.g. 123"
                value={formData.building_no}
                onChange={handleChange}
              />
              {errors.building_no && <div className={styles.errorMessage}>{errors.building_no}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="floor_no" className={styles.label}>
                Floor No. <span className={styles.required}>*</span>
              </label>
              <input
                id="floor_no"
                name="floor_no"
                type="text"
                className={`${styles.input} ${errors.floor_no ? styles.inputError : ''}`}
                placeholder="e.g. 2"
                value={formData.floor_no}
                onChange={handleChange}
              />
              {errors.floor_no && <div className={styles.errorMessage}>{errors.floor_no}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="flat_no" className={styles.label}>
                Flat No. <span className={styles.required}>*</span>
              </label>
              <input
                id="flat_no"
                name="flat_no"
                type="text"
                className={`${styles.input} ${errors.flat_no ? styles.inputError : ''}`}
                placeholder="e.g. 5"
                value={formData.flat_no}
                onChange={handleChange}
              />
              {errors.flat_no && <div className={styles.errorMessage}>{errors.flat_no}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="paci_details" className={styles.label}>
                PACI Details <span className={styles.required}>*</span>
              </label>
              <input
                id="paci_details"
                name="paci_details"
                type="text"
                className={`${styles.input} ${errors.paci_details ? styles.inputError : ''}`}
                placeholder="e.g. PACI reference number"
                value={formData.paci_details}
                onChange={handleChange}
              />
              {errors.paci_details && <div className={styles.errorMessage}>{errors.paci_details}</div>}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="google_location" className={styles.label}>
              Customer Google Location
            </label>
            <GoogleLocationInput
              id="google_location"
              name="google_location"
              value={formData.google_location}
              onChange={handleLocationChange}
              error={errors.google_location}
              placeholder="Search for location on Google Maps..."
            />
            {errors.google_location && <div className={styles.errorMessage}>{errors.google_location}</div>}
          </div>

          {/* Booking Details Section */}
          <h3 className={styles.sectionTitle}>Booking Details</h3>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="vehicle_model" className={styles.label}>
                Vehicle Model <span className={styles.required}>*</span>
              </label>
              <select
                id="vehicle_model"
                name="vehicle_model"
                className={`${styles.select} ${errors.vehicle_model ? styles.inputError : ''}`}
                value={formData.vehicle_model}
                onChange={handleChange}
              >
                <option value="">Select a vehicle</option>
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
              {errors.vehicle_model && <div className={styles.errorMessage}>{errors.vehicle_model}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="vehicle_registration" className={styles.label}>
                Vehicle Registration Number <span className={styles.required}>*</span>
              </label>
              <input
                id="vehicle_registration"
                name="vehicle_registration"
                type="text"
                className={`${styles.input} ${errors.vehicle_registration ? styles.inputError : ''}`}
                placeholder="e.g. ABC-1234"
                value={formData.vehicle_registration}
                onChange={handleChange}
              />
              {errors.vehicle_registration && <div className={styles.errorMessage}>{errors.vehicle_registration}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="vehicle_year" className={styles.label}>
                Vehicle Year <span className={styles.required}>*</span>
              </label>
              <input
                id="vehicle_year"
                name="vehicle_year"
                type="text"
                inputMode="numeric"
                className={`${styles.input} ${errors.vehicle_year ? styles.inputError : ''}`}
                placeholder="e.g. 2024"
                value={formData.vehicle_year}
                onChange={handleVehicleYearChange}
                maxLength={4}
              />
              {errors.vehicle_year && <div className={styles.errorMessage}>{errors.vehicle_year}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="mileage" className={styles.label}>
                Mileage <span className={styles.required}>*</span>
              </label>
              <input
                id="mileage"
                name="mileage"
                type="text"
                className={`${styles.input} ${errors.mileage ? styles.inputError : ''}`}
                placeholder="e.g. 50,000"
                value={formData.mileage}
                onChange={handleMileageChange}
              />
              {errors.mileage && <div className={styles.errorMessage}>{errors.mileage}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="service_package_id" className={styles.label}>
                Service Package <span className={styles.required}>*</span>
              </label>
              <select
                id="service_package_id"
                name="service_package_id"
                className={`${styles.select} ${errors.service_package_id ? styles.inputError : ''}`}
                value={formData.service_package_id}
                onChange={handleChange}
              >
                <option value="">Select a service package</option>
                {SERVICE_OPTIONS.map((sp) => {
                  const tier = VEHICLE_TIER[formData.vehicle_model];
                  const price = tier === 'T2' ? sp.priceT2 : sp.priceT1;
                  return (
                    <option key={sp.id} value={sp.id}>
                      {sp.name} — {price === '0' ? 'Free' : `${price} KD`}
                    </option>
                  );
                })}
              </select>
              {errors.service_package_id && <div className={styles.errorMessage}>{errors.service_package_id}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="booking_time" className={styles.label}>
                Booking Time <span className={styles.required}>*</span>
              </label>
              <TimePicker
                id="booking_time"
                name="booking_time"
                value={formData.booking_time}
                onChange={handleTimeChange}
                error={errors.booking_time}
              />
              {errors.booking_time && <div className={styles.errorMessage}>{errors.booking_time}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="booking_date" className={styles.label}>
                Booking Date <span className={styles.required}>*</span>
              </label>
              <DatePicker
                id="booking_date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleDateChange}
                error={errors.booking_date}
                placeholder="Select booking date"
              />
              {errors.booking_date && <div className={styles.errorMessage}>{errors.booking_date}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="driver_id" className={styles.label}>
                Driver <span className={styles.required}>*</span>
              </label>
              <select
                id="driver_id"
                name="driver_id"
                className={`${styles.select} ${errors.driver_id ? styles.inputError : ''}`}
                value={formData.driver_id}
                onChange={handleChange}
              >
                <option value="">Select a driver</option>
                {DRIVERS.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.id})
                  </option>
                ))}
              </select>
              {errors.driver_id && <div className={styles.errorMessage}>{errors.driver_id}</div>}
            </div>

            <div className={styles.field}>
              <label htmlFor="technician_id" className={styles.label}>
                Technician <span className={styles.required}>*</span>
              </label>
              <select
                id="technician_id"
                name="technician_id"
                className={`${styles.select} ${errors.technician_id ? styles.inputError : ''}`}
                value={formData.technician_id}
                onChange={handleChange}
              >
                <option value="">Select a technician</option>
                {TECHNICIANS.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.id})
                  </option>
                ))}
              </select>
              {errors.technician_id && <div className={styles.errorMessage}>{errors.technician_id}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="service_van_id" className={styles.label}>
                Service Van <span className={styles.required}>*</span>
              </label>
              <select
                id="service_van_id"
                name="service_van_id"
                className={`${styles.select} ${errors.service_van_id ? styles.inputError : ''}`}
                value={formData.service_van_id}
                onChange={handleChange}
              >
                <option value="">Select a service van</option>
                {SERVICE_VANS.map((van) => (
                  <option key={van.id} value={van.id}>
                    {van.name} ({van.id})
                  </option>
                ))}
              </select>
              {errors.service_van_id && <div className={styles.errorMessage}>{errors.service_van_id}</div>}
            </div>

            {isEdit ? (
              <div className={styles.field}>
                <label htmlFor="status" className={styles.label}>
                  Status <span className={styles.required}>*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  className={`${styles.select} ${errors.status ? styles.inputError : ''}`}
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.status && <div className={styles.errorMessage}>{errors.status}</div>}
              </div>
            ) : (
              <div className={styles.field} />
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="additional_notes" className={styles.label}>
              Additional Notes
            </label>
            <textarea
              id="additional_notes"
              name="additional_notes"
              className={styles.textarea}
              placeholder="Optional notes for this booking"
              value={formData.additional_notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.submitBtn} ${!isFormValid() || isSubmitting ? styles.disabled : ''}`}
              disabled={!isFormValid() || isSubmitting}
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditBookingModal;
