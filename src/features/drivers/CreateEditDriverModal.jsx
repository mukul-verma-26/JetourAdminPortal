import { useState, useEffect, useRef } from 'react';
import { FiX, FiUser, FiEdit2 } from 'react-icons/fi';
import { GENDER_OPTIONS, STATUS_OPTIONS } from './constants';
import styles from './CreateEditDriverModal.module.scss';

function CreateEditDriverModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    civilId: '',
    nationality: '',
    gender: 'male',
    status: 'active',
    photo: '',
    rating: '0',
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState('');

  const isEdit = Boolean(initialData?.id);

  const parseContactToDigits = (contact) => {
    if (!contact) return '';
    const digits = contact.replace(/\D/g, '');
    return digits.slice(-8);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        contact: parseContactToDigits(initialData.contact),
        civilId: initialData.civilId || '',
        nationality: initialData.nationality || '',
        gender: initialData.gender || 'male',
        status: initialData.status || 'active',
        photo: initialData.photo || '',
        rating: String(initialData.rating ?? '0'),
      });
      setPhotoPreview(initialData.photo || '');
    } else {
      setFormData({
        name: '',
        contact: '',
        civilId: '',
        nationality: '',
        gender: 'male',
        status: 'active',
        photo: '',
        rating: '0',
      });
      setPhotoPreview('');
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCivilIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData((prev) => ({ ...prev, civilId: value }));
    if (errors.civilId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.civilId;
        return next;
      });
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setFormData((prev) => ({ ...prev, contact: value }));
    if (errors.contact) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.contact;
        return next;
      });
    }
  };

  const handleRatingChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
    const num = value === '' ? '' : Math.min(5, Math.max(0, parseInt(value, 10) || 0));
    setFormData((prev) => ({ ...prev, rating: num }));
    if (errors.rating) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.rating;
        return next;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
      setPhotoPreview(reader.result);
      if (errors.photo) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.photo;
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateCivilId = (civilId) => {
    if (!civilId || !civilId.trim()) return false;
    const trimmed = civilId.trim();
    return /^\d{10,12}$/.test(trimmed);
  };

  const getRatingVal = () => {
    const val = formData.rating;
    if (val === '' || val === undefined || val === null) return 0;
    const num = parseInt(String(val), 10);
    return Number.isNaN(num) ? 0 : Math.min(5, Math.max(0, num));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact is required';
    } else if (formData.contact.length < 7) {
      newErrors.contact = 'Contact must be 7-8 digits';
    }

    if (!formData.civilId.trim()) {
      newErrors.civilId = 'Civil ID is required';
    } else if (!validateCivilId(formData.civilId)) {
      newErrors.civilId = 'Civil ID must be 10-12 digits';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.photo || !String(formData.photo).trim()) {
      newErrors.photo = 'Photo is required';
    }

    const ratingVal = getRatingVal();
    if (ratingVal < 0 || ratingVal > 5) {
      newErrors.rating = 'Rating must be an integer between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    if (!formData.name.trim()) return false;
    if (!formData.contact.trim() || formData.contact.length < 7) return false;
    if (!validateCivilId(formData.civilId)) return false;
    if (!formData.gender) return false;
    if (!formData.status) return false;
    const photoStr = formData.photo != null ? String(formData.photo).trim() : '';
    if (!photoStr) return false;

    const ratingVal = getRatingVal();
    if (ratingVal < 0 || ratingVal > 5) return false;

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      contact: `+965 ${formData.contact}`,
      civilId: formData.civilId.trim(),
      nationality: formData.nationality.trim(),
      gender: formData.gender,
      status: formData.status,
      photo: String(formData.photo || '').trim(),
      rating: getRatingVal(),
    };

    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
    onClose();
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Driver' : 'Add Driver';

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
          <div className={styles.photoSection}>
            <div className={styles.avatarWrapper}>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Driver"
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <FiUser size={48} />
                </div>
              )}
              <button
                type="button"
                className={styles.editPhotoBtn}
                onClick={triggerFileInput}
                aria-label="Change photo"
              >
                <FiEdit2 size={18} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            {errors.photo && <div className={styles.errorMessage}>{errors.photo}</div>}
          </div>

          <h3 className={styles.sectionTitle}>Driver Details</h3>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="e.g. Ali Al-Mansoor"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
            </div>
            <div className={styles.field}>
              <label htmlFor="contact" className={styles.label}>
                Contact <span className={styles.required}>*</span>
              </label>
              <div className={styles.phoneInputWrapper}>
                <span className={styles.phonePrefix}>+965</span>
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  inputMode="numeric"
                  className={`${styles.input} ${styles.phoneInput} ${errors.contact ? styles.inputError : ''}`}
                  placeholder="12345678"
                  value={formData.contact}
                  onChange={handleContactChange}
                  maxLength={8}
                />
              </div>
              {errors.contact && <div className={styles.errorMessage}>{errors.contact}</div>}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="civilId" className={styles.label}>
                Civil ID <span className={styles.required}>*</span>
              </label>
              <input
                id="civilId"
                name="civilId"
                type="text"
                inputMode="numeric"
                className={`${styles.input} ${errors.civilId ? styles.inputError : ''}`}
                placeholder="12 digits"
                value={formData.civilId}
                onChange={handleCivilIdChange}
                maxLength={12}
                minLength={10}
              />
              {errors.civilId && <div className={styles.errorMessage}>{errors.civilId}</div>}
            </div>
            <div className={styles.field}>
              <label htmlFor="nationality" className={styles.label}>
                Nationality
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                className={styles.input}
                placeholder="e.g. Kuwaiti"
                value={formData.nationality}
                onChange={handleChange}
              />
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
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="rating" className={styles.label}>
                Rating <span className={styles.required}>*</span>
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="1"
                inputMode="numeric"
                className={`${styles.input} ${errors.rating ? styles.inputError : ''}`}
                placeholder="0"
                value={formData.rating}
                onChange={handleRatingChange}
              />
              {errors.rating && <div className={styles.errorMessage}>{errors.rating}</div>}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditDriverModal;
