import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { usePackages } from './usePackages';
import PackageCard from './PackageCard';
import CreateEditPackageModal from './CreateEditPackageModal';
import ViewPackageModal from './ViewPackageModal';
import ConfirmDeletePackageModal from './ConfirmDeletePackageModal';
import styles from './PackagesScreen.module.scss';

function PackagesScreen() {
  const { packages, stats, addPackage, updatePackage, deletePackage } = usePackages();
  const [createOpen, setCreateOpen] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [viewPkg, setViewPkg] = useState(null);
  const [deletePkg, setDeletePkg] = useState(null);

  const handleCreate = (payload) => {
    addPackage(payload);
    setCreateOpen(false);
  };

  const handleEdit = (id, payload) => {
    updatePackage(id, payload);
    setEditPkg(null);
  };

  const handleDelete = (id) => {
    deletePackage(id);
    setDeletePkg(null);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Service Packages</h2>
          <p className={styles.subtitle}>Manage maintenance packages and pricing</p>
        </div>
        <button type="button" className={styles.createBtn} onClick={() => setCreateOpen(true)}>
          <FiPlus size={18} aria-hidden />
          Add Package
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total Packages</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statGreen}`}>{stats.free}</span>
          <span className={styles.statLabel}>Free</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statBlue}`}>{stats.paid}</span>
          <span className={styles.statLabel}>Paid</span>
        </div>
      </div>

      <div className={styles.packagesGrid}>
        {packages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No packages yet. Add one to get started.</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onView={setViewPkg}
              onEdit={setEditPkg}
              onDelete={setDeletePkg}
            />
          ))
        )}
      </div>

      <CreateEditPackageModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />
      <CreateEditPackageModal open={Boolean(editPkg)} onClose={() => setEditPkg(null)} initialData={editPkg || undefined} onSubmit={handleEdit} />
      <ViewPackageModal open={Boolean(viewPkg)} onClose={() => setViewPkg(null)} pkg={viewPkg} />
      <ConfirmDeletePackageModal open={Boolean(deletePkg)} onClose={() => setDeletePkg(null)} onConfirm={handleDelete} pkg={deletePkg} />
    </div>
  );
}

export default PackagesScreen;
