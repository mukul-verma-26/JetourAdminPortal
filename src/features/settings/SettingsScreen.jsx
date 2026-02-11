import { useSettings } from './useSettings';
import ServicePackageCard from './components/ServicePackageCard';
import CreateEditPackageModal from './CreateEditPackageModal';
import styles from './SettingsScreen.module.scss';

function SettingsScreen() {
  const {
    packages,
    packageModalOpen,
    packageToEdit,
    handleOpenAddPackage,
    handleConfigurePackage,
    handleManagePackage,
    handleClosePackageModal,
    handlePackageSubmit,
  } = useSettings();

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>System Settings</h2>
        <p className={styles.subtitle}>Configure system preferences and integrations</p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Service Packages</h3>
          <button type="button" className={styles.addBtn} onClick={handleOpenAddPackage}>
            Add Package
          </button>
        </div>
        <div className={styles.cardsList}>
          {packages.map((pkg) => (
            <ServicePackageCard
              key={pkg.id}
              name={pkg.name}
              description={pkg.description}
              onConfigure={() => handleConfigurePackage(pkg.id)}
              onManage={() => handleManagePackage(pkg.id)}
            />
          ))}
        </div>
      </section>

      <CreateEditPackageModal
        open={packageModalOpen}
        onClose={handleClosePackageModal}
        initialData={packageToEdit}
        onSubmit={handlePackageSubmit}
      />
    </div>
  );
}

export default SettingsScreen;
