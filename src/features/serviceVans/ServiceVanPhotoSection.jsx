import { FiTruck, FiEdit2 } from 'react-icons/fi';
import styles from './CreateEditServiceVanModal.module.scss';

function ServiceVanPhotoSection({
  image,
  onImageClick,
  onFileChange,
  fileInputRef,
  error,
}) {
  return (
    <div className={styles.photoSection}>
      <label className={styles.label}>
        Image <span className={styles.required}>*</span>
      </label>
      <div className={styles.avatarWrapper}>
        {image ? (
          <img src={image} alt="Service van" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <FiTruck size={48} />
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

export default ServiceVanPhotoSection;
