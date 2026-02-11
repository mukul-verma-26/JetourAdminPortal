import styles from './ServicePackageCard.module.scss';

function ServicePackageCard({ name, description, onConfigure, onManage }) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.configureBtn} onClick={onConfigure}>
          Configure
        </button>
        <button type="button" className={styles.manageBtn} onClick={onManage}>
          Manage
        </button>
      </div>
    </div>
  );
}

export default ServicePackageCard;
