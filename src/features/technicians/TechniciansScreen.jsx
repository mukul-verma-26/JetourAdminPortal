import { useState } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { useTechnicians } from './useTechnicians';
import { STATUS_OPTIONS } from './constants';
import CreateEditTechnicianModal from './CreateEditTechnicianModal';
import ViewTechnicianModal from './ViewTechnicianModal';
import ConfirmDeleteTechnicianModal from './ConfirmDeleteTechnicianModal';
import styles from './TechniciansScreen.module.scss';

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

function TechniciansScreen() {
  const { technicians, stats, addTechnician, updateTechnician, deleteTechnician, isLoading, isCreating, isUpdating, isDeleting } = useTechnicians();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTechnician, setEditTechnician] = useState(null);
  const [viewTechnician, setViewTechnician] = useState(null);
  const [deleteConfirmTechnician, setDeleteConfirmTechnician] = useState(null);

  const handleCreateSubmit = async (payload) => {
    try {
      await addTechnician(payload);
      setCreateModalOpen(false);
    } catch {
      // Error handled in addTechnician
    }
  };

  const handleEditSubmit = async (id, payload) => {
    try {
      await updateTechnician(id, payload);
      setEditTechnician(null);
    } catch {
      // Error handled in updateTechnician
    }
  };

  const handleDeleteConfirm = (id) => {
    deleteTechnician(id);
    setDeleteConfirmTechnician(null);
  };

  const openEdit = (technician) => setEditTechnician(technician);
  const openView = (technician) => setViewTechnician(technician);
  const openDeleteConfirm = (technician) => setDeleteConfirmTechnician(technician);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Technician Management</h2>
          <p className={styles.subtitle}>Manage technician assignments and performance</p>
        </div>
        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setCreateModalOpen(true)}
        >
          <FiPlus size={18} aria-hidden />
          Add Technician
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total Technicians</span>
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
                <th className={styles.th}>Technician ID</th>
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
                    <p className={styles.empty}>Loading technicians...</p>
                  </td>
                </tr>
              ) : technicians.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`${styles.td} ${styles.emptyCell}`}>
                    <p className={styles.empty}>No technicians yet. Add one to get started.</p>
                  </td>
                </tr>
              ) : (
                technicians.map((technician) => (
                  <tr key={technician.id} className={styles.tr}>
                    <td className={styles.td} data-label="Technician ID">
                      {technician.id}
                    </td>
                    <td className={styles.td} data-label="Name">
                      <div className={styles.nameCell}>
                        <span className={styles.avatar}>{getInitials(technician.name)}</span>
                        <span>{technician.name}</span>
                      </div>
                    </td>
                    <td className={styles.td} data-label="Contact">
                      {technician.contact}
                    </td>
                    <td className={styles.td} data-label="Rating">
                      <span className={styles.ratingCell}>
                        {Math.round(technician.rating)}
                        <FiStar className={styles.starIcon} size={14} />
                      </span>
                    </td>
                    <td className={styles.td} data-label="Status">
                      <span
                        className={`${styles.statusBadge} ${styles[STATUS_CLASS_MAP[technician.status]] || styles.statusInactive}`}
                      >
                        {getStatusLabel(technician.status)}
                      </span>
                    </td>
                    <td className={styles.td} data-label="Actions">
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openView(technician)}
                          aria-label={`View details for ${technician.name}`}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openEdit(technician)}
                          aria-label={`Edit ${technician.name}`}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openDeleteConfirm(technician)}
                          aria-label={`Delete ${technician.name}`}
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

      <CreateEditTechnicianModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
      />

      <CreateEditTechnicianModal
        open={Boolean(editTechnician)}
        onClose={() => setEditTechnician(null)}
        initialData={editTechnician || undefined}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      <ViewTechnicianModal
        open={Boolean(viewTechnician)}
        onClose={() => setViewTechnician(null)}
        technician={viewTechnician}
      />

      <ConfirmDeleteTechnicianModal
        open={Boolean(deleteConfirmTechnician)}
        onClose={() => setDeleteConfirmTechnician(null)}
        onConfirm={handleDeleteConfirm}
        technician={deleteConfirmTechnician}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default TechniciansScreen;
