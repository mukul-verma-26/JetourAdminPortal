import { useState } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { useDrivers } from './useDrivers';
import { STATUS_OPTIONS } from './constants';
import CreateEditDriverModal from './CreateEditDriverModal';
import ViewDriverModal from './ViewDriverModal';
import ConfirmDeleteDriverModal from './ConfirmDeleteDriverModal';
import styles from './DriversScreen.module.scss';

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const STATUS_CLASS_MAP = {
  active: 'statusActive',
  inactive: 'statusInactive',
};

function DriversScreen() {
  const { drivers, stats, addDriver, updateDriver, deleteDriver, isLoading, isCreating, isUpdating, isDeleting } = useDrivers();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  const [viewDriver, setViewDriver] = useState(null);
  const [deleteConfirmDriver, setDeleteConfirmDriver] = useState(null);

  const handleCreateSubmit = async (payload) => {
    try {
      await addDriver(payload);
      setCreateModalOpen(false);
    } catch {
      // Error handled in addDriver
    }
  };

  const handleEditSubmit = async (id, payload) => {
    try {
      await updateDriver(id, payload);
      setEditDriver(null);
    } catch {
      // Error handled in updateDriver
    }
  };

  const handleDeleteConfirm = (id) => {
    deleteDriver(id);
    setDeleteConfirmDriver(null);
  };

  const openEdit = (driver) => setEditDriver(driver);
  const openView = (driver) => setViewDriver(driver);
  const openDeleteConfirm = (driver) => setDeleteConfirmDriver(driver);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Driver Management</h2>
          <p className={styles.subtitle}>Manage driver assignments and performance</p>
        </div>
        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setCreateModalOpen(true)}
        >
          <FiPlus size={18} aria-hidden />
          Add Driver
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total Drivers</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statGreen}`}>{stats.onDuty}</span>
          <span className={styles.statLabel}>On Duty</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.avgRating}</span>
          <span className={styles.statLabel}>Avg Rating</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Driver ID</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Contact</th>
                <th className={styles.th}>Rating</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className={`${styles.td} ${styles.emptyCell}`}>
                    <p className={styles.empty}>Loading drivers...</p>
                  </td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`${styles.td} ${styles.emptyCell}`}>
                    <p className={styles.empty}>No drivers yet. Add one to get started.</p>
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className={styles.tr}>
                    <td className={styles.td} data-label="Driver ID">
                      {driver.id}
                    </td>
                    <td className={styles.td} data-label="Name">
                      <div className={styles.nameCell}>
                        <span className={styles.avatar}>{getInitials(driver.name)}</span>
                        <span>{driver.name}</span>
                      </div>
                    </td>
                    <td className={styles.td} data-label="Contact">
                      {driver.contact}
                    </td>
                    <td className={styles.td} data-label="Rating">
                      <span className={styles.ratingCell}>
                        {Math.round(driver.rating)}
                        <FiStar className={styles.starIcon} size={14} />
                      </span>
                    </td>
                    <td className={styles.td} data-label="Status">
                      <span
                        className={`${styles.statusBadge} ${styles[STATUS_CLASS_MAP[driver.status]] || styles.statusInactive}`}
                      >
                        {getStatusLabel(driver.status)}
                      </span>
                    </td>
                    <td className={styles.td} data-label="Actions">
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openView(driver)}
                          aria-label={`View details for ${driver.name}`}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openEdit(driver)}
                          aria-label={`Edit ${driver.name}`}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openDeleteConfirm(driver)}
                          aria-label={`Delete ${driver.name}`}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateEditDriverModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
      />

      <CreateEditDriverModal
        open={Boolean(editDriver)}
        onClose={() => setEditDriver(null)}
        initialData={editDriver || undefined}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      <ViewDriverModal
        open={Boolean(viewDriver)}
        onClose={() => setViewDriver(null)}
        driver={viewDriver}
      />

      <ConfirmDeleteDriverModal
        open={Boolean(deleteConfirmDriver)}
        onClose={() => setDeleteConfirmDriver(null)}
        onConfirm={handleDeleteConfirm}
        driver={deleteConfirmDriver}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default DriversScreen;
