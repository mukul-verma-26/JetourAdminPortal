import { FiX } from 'react-icons/fi';
import {
  STATUS_OPTIONS,
  GENDER_OPTIONS,
  SERVICE_OPTIONS,
  VEHICLES,
  TECHNICIANS,
  DRIVERS,
  SERVICE_VANS,
} from './constants';
import styles from './CreateEditBookingModal.module.scss';

function CreateEditBookingModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Booking' : 'Create Booking';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    
    const selectedServicePackage = SERVICE_OPTIONS.find(
      (sp) => sp.id === form.service_package_id.value
    );
    const selectedTechnician = TECHNICIANS.find(
      (t) => t.id === form.technician_id.value
    );
    const selectedDriver = DRIVERS.find(
      (d) => d.id === form.driver_id.value
    );
    const selectedServiceVan = SERVICE_VANS.find(
      (sv) => sv.id === form.service_van_id.value
    );

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      gender: form.gender.value,
      vehicle_model: form.vehicle_model.value,
      address: form.address.value.trim(),
      service_package: selectedServicePackage || null,
      booking_date: form.booking_date.value,
      booking_time: form.booking_time.value,
      booking_slot: form.booking_slot.value.trim(),
      status: form.status.value,
      amount: selectedServicePackage?.amount || form.amount.value.trim(),
      technician_detail: selectedTechnician
        ? { id: selectedTechnician.id, name: selectedTechnician.name }
        : null,
      driver_detail: selectedDriver
        ? { id: selectedDriver.id, name: selectedDriver.name }
        : null,
      service_van: selectedServiceVan
        ? { id: selectedServiceVan.id, name: selectedServiceVan.name }
        : null,
      additional_notes: form.additional_notes.value.trim(),
    };

    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
    onClose();
  };

  // Convert date format from DD/MM/YYYY to YYYY-MM-DD for input
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Convert date format from YYYY-MM-DD to DD/MM/YYYY for storage
  const formatDateForStorage = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const defaultValues = initialData || {
    name: '',
    email: '',
    gender: 'M',
    vehicle_model: '',
    address: '',
    service_package: null,
    booking_date: '',
    booking_time: '',
    booking_slot: '',
    status: 'pending',
    amount: '',
    technician_detail: null,
    driver_detail: null,
    service_van: null,
    additional_notes: '',
  };

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
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Customer Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="e.g. John Doe"
              defaultValue={defaultValues.name}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Customer Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="customer@example.com"
              defaultValue={defaultValues.email}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="gender" className={styles.label}>
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className={styles.select}
              defaultValue={defaultValues.gender}
              required
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="vehicle_model" className={styles.label}>
              Vehicle Model
            </label>
            <select
              id="vehicle_model"
              name="vehicle_model"
              className={styles.select}
              defaultValue={defaultValues.vehicle_model}
              required
            >
              <option value="">Select a vehicle</option>
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="address" className={styles.label}>
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className={styles.input}
              placeholder="e.g. Block 5, Street 12, Kuwait City"
              defaultValue={defaultValues.address}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="service_package_id" className={styles.label}>
              Service Package
            </label>
            <select
              id="service_package_id"
              name="service_package_id"
              className={styles.select}
              defaultValue={defaultValues.service_package?.id || ''}
              required
            >
              <option value="">Select a service package</option>
              {SERVICE_OPTIONS.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name.charAt(0).toUpperCase() + sp.name.slice(1)} - {sp.amount} KWD
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="booking_date" className={styles.label}>
              Booking Date
            </label>
            <input
              id="booking_date"
              name="booking_date"
              type="date"
              className={styles.input}
              defaultValue={formatDateForInput(defaultValues.booking_date)}
              onChange={(e) => {
                e.target.dataset.formatted = formatDateForStorage(e.target.value);
              }}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="booking_time" className={styles.label}>
              Booking Time
            </label>
            <input
              id="booking_time"
              name="booking_time"
              type="time"
              className={styles.input}
              defaultValue={defaultValues.booking_time}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="booking_slot" className={styles.label}>
              Booking Slot
            </label>
            <input
              id="booking_slot"
              name="booking_slot"
              type="text"
              className={styles.input}
              placeholder="e.g. 09:00-12:00"
              defaultValue={defaultValues.booking_slot}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              className={styles.select}
              defaultValue={defaultValues.status}
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="technician_id" className={styles.label}>
              Technician
            </label>
            <select
              id="technician_id"
              name="technician_id"
              className={styles.select}
              defaultValue={defaultValues.technician_detail?.id || ''}
            >
              <option value="">Select a technician</option>
              {TECHNICIANS.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} ({tech.id})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="driver_id" className={styles.label}>
              Driver
            </label>
            <select
              id="driver_id"
              name="driver_id"
              className={styles.select}
              defaultValue={defaultValues.driver_detail?.id || ''}
            >
              <option value="">Select a driver</option>
              {DRIVERS.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.id})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="service_van_id" className={styles.label}>
              Service Van
            </label>
            <select
              id="service_van_id"
              name="service_van_id"
              className={styles.select}
              defaultValue={defaultValues.service_van?.id || ''}
            >
              <option value="">Select a service van</option>
              {SERVICE_VANS.map((van) => (
                <option key={van.id} value={van.id}>
                  {van.name} ({van.id})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="additional_notes" className={styles.label}>
              Additional Notes
            </label>
            <textarea
              id="additional_notes"
              name="additional_notes"
              className={styles.input}
              placeholder="Optional notes for this booking"
              defaultValue={defaultValues.additional_notes}
              rows={3}
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditBookingModal;
