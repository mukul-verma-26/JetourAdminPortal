import { FiX, FiUpload } from 'react-icons/fi';
import styles from './CreateEditVehicleModal.module.scss';

function VehiclePhotoSection({
  image,
  onImageClick,
  onFileChange,
  fileInputRef,
  onRemove,
  error,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        Vehicle Image <span className={styles.required}>*</span>
      </label>
      <div className={styles.imageUploadArea}>
        {image ? (
          <div
            className={styles.previewWrapper}
            onClick={onImageClick}
            onKeyDown={(e) => e.key === 'Enter' && onImageClick()}
            role="button"
            tabIndex={0}
            aria-label="Change vehicle image"
          >
            <img
              src={image}
              alt="Vehicle preview"
              className={styles.previewImage}
            />
            <button
              type="button"
              className={styles.removeImageBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              aria-label="Remove image"
            >
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <label className={styles.uploadPlaceholder} htmlFor="vehicleFileInput">
            <FiUpload size={24} />
            <span>Click to upload</span>
          </label>
        )}
        <input
          ref={fileInputRef}
          id="vehicleFileInput"
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={onFileChange}
        />
      </div>
      <p className={styles.imageHint}>Image should not exceed 2MB</p>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}

export default VehiclePhotoSection;
