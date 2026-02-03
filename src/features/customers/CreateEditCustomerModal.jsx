import { FiX } from 'react-icons/fi';
import {
  CUSTOMER_STATUS_OPTIONS,
  GENDER_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
} from './constants';
import styles from './CreateEditCustomerModal.module.scss';

const STATUS_OPTIONS_FOR_FORM = CUSTOMER_STATUS_OPTIONS.filter(
  (o) => o.value !== 'all'
);

function CreateEditCustomerModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Customer' : 'Add Customer';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      gender: form.gender.value,
      dob: form.dob.value,
      address: form.address.value.trim(),
      nationality: form.nationality.value.trim(),
      phone: form.phone.value.trim(),
      civilId: form.civilId.value.trim(),
      passportNumber: form.passportNumber.value.trim(),
      preferredLanguage: form.preferredLanguage.value,
      status: form.status.value,
    };
    if (isEdit) {
      const vehiclesRaw = form.vehicles?.value?.trim() || '';
      const vehicles = vehiclesRaw
        ? vehiclesRaw
            .split(/\n/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((modelName) => ({ modelName }))
        : [];
      payload.vehicles = vehicles;
      payload.totalBookings = parseInt(form.totalBookings?.value, 10) || 0;
      onSubmit(initialData.id, payload);
    } else {
      payload.vehicles = [];
      onSubmit(payload);
    }
    onClose();
  };

  const defaultValues = initialData || {
    name: '',
    gender: 'male',
    dob: '',
    address: '',
    nationality: '',
    phone: '',
    civilId: '',
    passportNumber: '',
    preferredLanguage: 'en',
    status: 'active',
    vehicles: [],
    totalBookings: 0,
  };

  const vehiclesDisplay =
    Array.isArray(defaultValues.vehicles) && defaultValues.vehicles.length > 0
      ? defaultValues.vehicles
          .map((v) => (typeof v === 'object' ? v.modelName : v))
          .join('\n')
      : '';

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
          <div className={styles.field}>
            <label htmlFor="customer-name" className={styles.label}>
              Customer Name
            </label>
            <input
              id="customer-name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="Full name"
              defaultValue={defaultValues.name}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="customer-gender" className={styles.label}>
              Gender
            </label>
            <select
              id="customer-gender"
              name="gender"
              className={styles.select}
              defaultValue={defaultValues.gender || 'male'}
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
            <label htmlFor="customer-dob" className={styles.label}>
              DOB
            </label>
            <input
              id="customer-dob"
              name="dob"
              type="date"
              className={styles.input}
              defaultValue={defaultValues.dob || ''}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="customer-address" className={styles.label}>
              Address
            </label>
            <input
              id="customer-address"
              name="address"
              type="text"
              className={styles.input}
              placeholder="Full address"
              defaultValue={defaultValues.address || ''}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="customer-nationality" className={styles.label}>
              Nationality
            </label>
            <input
              id="customer-nationality"
              name="nationality"
              type="text"
              className={styles.input}
              placeholder="e.g. Kuwaiti"
              defaultValue={defaultValues.nationality || ''}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="customer-phone" className={styles.label}>
              Phone number (with country code)
            </label>
            <input
              id="customer-phone"
              name="phone"
              type="tel"
              className={styles.input}
              placeholder="+965 1234 5678"
              defaultValue={defaultValues.phone || ''}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="customer-civilId" className={styles.label}>
              Civil ID number
            </label>
            <input
              id="customer-civilId"
              name="civilId"
              type="text"
              className={styles.input}
              placeholder="Civil ID"
              defaultValue={defaultValues.civilId || ''}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="customer-passportNumber" className={styles.label}>
              Passport number
            </label>
            <input
              id="customer-passportNumber"
              name="passportNumber"
              type="text"
              className={styles.input}
              placeholder="Passport number"
              defaultValue={defaultValues.passportNumber || ''}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="customer-preferredLanguage" className={styles.label}>
              Preferred language
            </label>
            <select
              id="customer-preferredLanguage"
              name="preferredLanguage"
              className={styles.select}
              defaultValue={defaultValues.preferredLanguage || 'en'}
              required
            >
              {PREFERRED_LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {isEdit && (
            <>
              <div className={styles.field}>
                <label htmlFor="customer-status" className={styles.label}>
                  Status
                </label>
                <select
                  id="customer-status"
                  name="status"
                  className={styles.select}
                  defaultValue={defaultValues.status || 'active'}
                  required
                >
                  {STATUS_OPTIONS_FOR_FORM.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
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
                  defaultValue={vehiclesDisplay}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="customer-totalBookings" className={styles.label}>
                  Total Bookings
                </label>
                <input
                  id="customer-totalBookings"
                  name="totalBookings"
                  type="number"
                  min="0"
                  className={styles.input}
                  defaultValue={defaultValues.totalBookings ?? 0}
                />
              </div>
            </>
          )}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditCustomerModal;
