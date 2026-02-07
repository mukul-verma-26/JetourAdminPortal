import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useVehicles } from './useVehicles';
import { CATEGORY_OPTIONS } from './constants';
import CreateEditVehicleModal from './CreateEditVehicleModal';
import ViewVehicleModal from './ViewVehicleModal';
import ConfirmDeleteVehicleModal from './ConfirmDeleteVehicleModal';
import styles from './VehiclesScreen.module.scss';

function getCategoryLabel(value) {
  return CATEGORY_OPTIONS.find((o) => o.value === value)?.label || value;
}

const CATEGORY_CLASS_MAP = {
  suv: 'categorySuv',
  sedan: 'categorySedan',
  hatchback: 'categoryHatchback',
};

function VehiclesScreen() {
  const { vehicles, stats, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [viewVehicle, setViewVehicle] = useState(null);
  const [deleteConfirmVehicle, setDeleteConfirmVehicle] = useState(null);

  const handleCreateSubmit = (payload) => {
    addVehicle(payload);
    setCreateModalOpen(false);
  };

  const handleEditSubmit = (id, payload) => {
    updateVehicle(id, payload);
    setEditVehicle(null);
  };

  const handleDeleteConfirm = (id) => {
    deleteVehicle(id);
    setDeleteConfirmVehicle(null);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Vehicle Management</h2>
          <p className={styles.subtitle}>Manage your vehicle inventory and models</p>
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
          <span className={styles.statLabel}>Total Vehicles</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statBlue}`}>{stats.suv}</span>
          <span className={styles.statLabel}>SUVs</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statGreen}`}>{stats.sedan}</span>
          <span className={styles.statLabel}>Sedans</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statValue} ${styles.statOrange}`}>{stats.hatchback}</span>
          <span className={styles.statLabel}>Hatchbacks</span>
        </div>
      </div>

      <div className={styles.vehiclesGrid}>
        {vehicles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No vehicles yet. Add one to get started.</p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className={styles.vehicleCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={vehicle.image}
                  alt={vehicle.modelName}
                  className={styles.vehicleImage}
                />
                <span
                  className={`${styles.categoryBadge} ${styles[CATEGORY_CLASS_MAP[vehicle.category]] || ''}`}
                >
                  {getCategoryLabel(vehicle.category)}
                </span>
              </div>

              <div className={styles.vehicleBody}>
                <div className={styles.vehicleInfo}>
                  <h3 className={styles.vehicleName}>{vehicle.modelName}</h3>
                  <p className={styles.vehicleYear}>{vehicle.modelYear}</p>
                </div>
                <p className={styles.vehicleId}>{vehicle.id}</p>
              </div>

              <div className={styles.vehicleActions}>
                <button
                  type="button"
                  className={styles.viewBtn}
                  onClick={() => setViewVehicle(vehicle)}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => setEditVehicle(vehicle)}
                  aria-label={`Edit ${vehicle.modelName}`}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => setDeleteConfirmVehicle(vehicle)}
                  aria-label={`Delete ${vehicle.modelName}`}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateEditVehicleModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <CreateEditVehicleModal
        open={Boolean(editVehicle)}
        onClose={() => setEditVehicle(null)}
        initialData={editVehicle || undefined}
        onSubmit={handleEditSubmit}
      />

      <ViewVehicleModal
        open={Boolean(viewVehicle)}
        onClose={() => setViewVehicle(null)}
        vehicle={viewVehicle}
      />

      <ConfirmDeleteVehicleModal
        open={Boolean(deleteConfirmVehicle)}
        onClose={() => setDeleteConfirmVehicle(null)}
        onConfirm={handleDeleteConfirm}
        vehicle={deleteConfirmVehicle}
      />
    </div>
  );
}

export default VehiclesScreen;
