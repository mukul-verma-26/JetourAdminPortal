import { useSettings } from './useSettings';
import ServicePackageCard from './components/ServicePackageCard';
import CreateEditPackageModal from './CreateEditPackageModal';
import ManagePackageModal from './ManagePackageModal';
import ConfirmDeletePackageModal from './ConfirmDeletePackageModal';
import styles from './SettingsScreen.module.scss';

function SettingsScreen() {
  const {
    packages,
    isLoading,
    packageModalOpen,
    packageToEdit,
    managePackageModalOpen,
    packageToManage,
    deleteConfirmPackage,
    handleOpenAddPackage,
    handleConfigurePackage,
    handleManagePackage,
    handleClosePackageModal,
    handleCloseManagePackageModal,
    handlePackageSubmit,
    handleManagePackageSubmit,
    handleDeletePackage,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
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
          {isLoading ? (
            <div className={styles.emptyState}>
              <p>Loading packages...</p>
            </div>
          ) : (
          packages.map((pkg) => (
            <ServicePackageCard
              key={pkg.id}
              name={pkg.name}
              description={pkg.description}
              onConfigure={() => handleConfigurePackage(pkg.id)}
              onManage={() => handleManagePackage(pkg.id)}
            />
          ))
          )}
        </div>
      </section>

      <CreateEditPackageModal
        open={packageModalOpen}
        onClose={handleClosePackageModal}
        initialData={packageToEdit}
        onSubmit={handlePackageSubmit}
      />

      <ManagePackageModal
        open={managePackageModalOpen}
        onClose={handleCloseManagePackageModal}
        package={packageToManage}
        onSubmit={handleManagePackageSubmit}
      />

      <ConfirmDeletePackageModal
        open={Boolean(deleteConfirmPackage)}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeletePackage}
        package={deleteConfirmPackage}
      />
    </div>
  );
}

export default SettingsScreen;
