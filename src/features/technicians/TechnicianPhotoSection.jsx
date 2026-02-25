import { FiUser, FiEdit2 } from 'react-icons/fi';
import styles from './CreateEditTechnicianModal.module.scss';

function TechnicianPhotoSection({
  image,
  onImageClick,
  onFileChange,
  fileInputRef,
  error,
  isEdit = false,
}) {
  return (
    <div className={styles.photoSection}>
      <label className={styles.label}>
        Image {!isEdit && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.avatarWrapper}>
        {image ? (
          <img src={image} alt="Technician" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <FiUser size={48} />
          </div>
        )}
        <button
          type="button"
          className={styles.editPhotoBtn}
          onClick={onImageClick}
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
        onChange={onFileChange}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}

export default TechnicianPhotoSection;
