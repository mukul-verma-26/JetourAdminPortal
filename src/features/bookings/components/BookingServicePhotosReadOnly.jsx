import { getPhotoUrls } from '../helpers/serviceProgressPhotos';
import styles from './BookingServicePhotosReadOnly.module.scss';

function PhotoGroup({ label, urls }) {
  return (
    <div className={styles.subsection}>
      <h4 className={styles.subLabel}>{label}</h4>
      {urls.length === 0 ? (
        <p className={styles.empty}>No photos</p>
      ) : (
        <div className={styles.grid}>
          {urls.map((url, i) => (
            <a
              key={`${url}-${i}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.thumbLink}
            >
              <img src={url} alt="" className={styles.thumb} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function BeforeAfterSection({ title, photos }) {
  const exterior = getPhotoUrls(photos?.exterior);
  const interior = getPhotoUrls(photos?.interior);
  return (
    <div className={styles.group}>
      <h3 className={styles.groupTitle}>{title}</h3>
      <PhotoGroup label="Exterior" urls={exterior} />
      <PhotoGroup label="Interior" urls={interior} />
    </div>
  );
}

function BookingServicePhotosReadOnly({ serviceProgress }) {
  if (serviceProgress == null || typeof serviceProgress !== 'object') {
    return null;
  }
  const before = serviceProgress.before_photos ?? { interior: [], exterior: [] };
  const after = serviceProgress.after_photos ?? { interior: [], exterior: [] };
  return (
    <div className={styles.wrap}>
      <BeforeAfterSection title="Before Photos" photos={before} />
      <BeforeAfterSection title="After Photos" photos={after} />
    </div>
  );
}

export default BookingServicePhotosReadOnly;
