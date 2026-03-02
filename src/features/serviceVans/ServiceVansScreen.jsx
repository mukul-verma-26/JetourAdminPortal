import { useState } from 'react';
import { FiPlus, FiTruck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useServiceVans } from './useServiceVans';
import { STATUS_OPTIONS } from './constants';
import CreateEditServiceVanModal from './CreateEditServiceVanModal';
import ViewServiceVanModal from './ViewServiceVanModal';
import ConfirmDeleteServiceVanModal from './ConfirmDeleteServiceVanModal';
import styles from './ServiceVansScreen.module.scss';

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMileage(mileage) {
  return mileage.toLocaleString() + ' km';
}

const STATUS_CLASS_MAP = {
  active: 'statusActive',
  maintenance: 'statusMaintenance',
  inactive: 'statusInactive',
};

function ServiceVansScreen() {
  const {
    serviceVans,
    stats,
    addServiceVan,
    updateServiceVan,
    deleteServiceVan,
    openView,
    closeView,
    viewVan,
    isViewLoading,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  } = useServiceVans();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editVan, setEditVan] = useState(null);
  const [deleteConfirmVan, setDeleteConfirmVan] = useState(null);

  const handleCreateSubmit = async (payload) => {
    try {
      await addServiceVan(payload);
      setCreateModalOpen(false);
    } catch {
      // Error handled in addServiceVan
    }
  };

  const handleEditSubmit = async (id, payload) => {
    try {
      await updateServiceVan(id, payload);
      setEditVan(null);
    } catch {
      // Error handled in updateServiceVan
    }
  };

  const handleDeleteConfirm = (id) => {
    deleteServiceVan(id);
    setDeleteConfirmVan(null);
  };

  const openEdit = (van) => setEditVan(van);
  const openDeleteConfirm = (van) => setDeleteConfirmVan(van);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Service Van Management</h2>
          <p className={styles.subtitle}>Manage fleet and vehicle assignments</p>
        </div>
        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setCreateModalOpen(true)}
        >
          <FiPlus size={18} aria-hidden />
          Add Vehicle
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total Vans</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statGreen}`}>{stats.active}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statOrange}`}>{stats.inMaintenance}</span>
          <span className={styles.statLabel}>In Maintenance</span>
        </div>
      </div>

      <div className={styles.vansGrid}>
        {isLoading ? (
          <div className={styles.emptyState}>
            <p>Loading service vans...</p>
          </div>
        ) : serviceVans.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No service vans yet. Add one to get started.</p>
          </div>
        ) : (
          serviceVans.map((van) => (
            <div key={van.id} className={styles.vanCard}>
              <div className={styles.vanHeader}>
                <div className={styles.vanThumb}>
                  {van.photo ? (
                    <img src={van.photo} alt={van.vehicleModel} className={styles.vanThumbImg} />
                  ) : (
                    <div className={styles.vanIcon}>
                      <FiTruck size={24} />
                    </div>
                  )}
                </div>
                <div className={styles.vanInfo}>
                  <h3 className={styles.vanId}>{van.vehicleModel}</h3>
                </div>
                <span
                  className={`${styles.statusBadge} ${styles[STATUS_CLASS_MAP[van.status]] || styles.statusInactive}`}
                >
                  {getStatusLabel(van.status)}
                </span>
              </div>

              <div className={styles.vanDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Mileage</span>
                  <span className={styles.detailValue}>{formatMileage(van.mileage)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Last Service</span>
                  <span className={styles.detailValue}>{formatDate(van.lastService)}</span>
                </div>
              </div>

              <div className={styles.vanActions}>
                <button
                  type="button"
                  className={styles.viewBtn}
                  onClick={() => openView(van)}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => openEdit(van)}
                  aria-label={`Edit ${van.id}`}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => openDeleteConfirm(van)}
                  aria-label={`Delete ${van.id}`}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateEditServiceVanModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
      />

      <CreateEditServiceVanModal
        open={Boolean(editVan)}
        onClose={() => setEditVan(null)}
        initialData={editVan || undefined}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      <ViewServiceVanModal
        open={Boolean(viewVan)}
        onClose={closeView}
        van={viewVan}
        isLoading={isViewLoading}
      />

      <ConfirmDeleteServiceVanModal
        open={Boolean(deleteConfirmVan)}
        onClose={() => setDeleteConfirmVan(null)}
        onConfirm={handleDeleteConfirm}
        van={deleteConfirmVan}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ServiceVansScreen;
