import { useSettings } from './useSettings';
import PackagesAccordion from './components/PackagesAccordion';
import ExtraDetailsSection from './components/ExtraDetailsSection';
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
    bufferTimeMinutes,
    serviceFee,
    handleBufferTimeChange,
    handleServiceFeeChange,
    handleExtraDetailsUpdate,
  } = useSettings();

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>System Settings</h2>
        <p className={styles.subtitle}>Configure system preferences and integrations</p>
      </div>

      <PackagesAccordion
        packages={packages}
        isLoading={isLoading}
        onAddPackage={handleOpenAddPackage}
        onConfigurePackage={handleConfigurePackage}
        onManagePackage={handleManagePackage}
      />

      <ExtraDetailsSection
        bufferTimeMinutes={bufferTimeMinutes}
        serviceFee={serviceFee}
        onBufferTimeChange={handleBufferTimeChange}
        onServiceFeeChange={handleServiceFeeChange}
        onUpdate={handleExtraDetailsUpdate}
      />

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
