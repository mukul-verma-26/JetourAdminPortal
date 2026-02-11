import { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useBookings } from './useBookings';
import { usePackagesContext } from '../settings/PackagesContext';
import { STATUS_OPTIONS } from './constants';
import CreateEditBookingModal from './CreateEditBookingModal';
import ViewBookingModal from './ViewBookingModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ConfirmAmountModal from './ConfirmAmountModal';
import styles from './BookingsScreen.module.scss';

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const STATUS_CLASS_MAP = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusIn_progress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

function BookingsScreen() {
  const { bookings, addBooking, updateBooking, deleteBooking, filteredBookings } = useBookings();
  const { packages } = usePackagesContext();
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterVin, setFilterVin] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ name: '', phone: '', vin: '' });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);

  const handleCreateSubmit = (payload) => {
    setPendingPayload(payload);
    setCreateModalOpen(false);
  };

  const handleConfirmAmount = () => {
    if (pendingPayload) {
      addBooking({ ...pendingPayload, status: 'confirmed' });
      setPendingPayload(null);
      if (window.showToast) {
        window.showToast('Booking confirmed successfully', 'success');
      }
    }
  };

  const handleCancelAmount = () => {
    if (pendingPayload) {
      addBooking({ ...pendingPayload, status: 'pending' });
      setPendingPayload(null);
      if (window.showToast) {
        window.showToast('Booking saved as pending', 'info');
      }
    }
  };

  const handleEditSubmit = (id, payload) => {
    updateBooking(id, payload);
    setEditBooking(null);
  };

  const handleDeleteConfirm = (id) => {
    deleteBooking(id);
    setDeleteConfirmBooking(null);
  };

  const openEdit = (booking) => setEditBooking(booking);
  const openView = (booking) => setViewBooking(booking);
  const openDeleteConfirm = (booking) => setDeleteConfirmBooking(booking);

  const displayedBookings = useMemo(
    () => filteredBookings.byFilters(bookings, appliedFilters),
    [bookings, appliedFilters, filteredBookings]
  );

  const handleSearch = () => {
    setAppliedFilters({
      name: filterName,
      phone: filterPhone,
      vin: filterVin,
    });
  };

  const hasActiveFilters =
    appliedFilters.name || appliedFilters.phone || appliedFilters.vin;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>Bookings</h2>
        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setCreateModalOpen(true)}
        >
          <FiPlus size={18} aria-hidden />
          Create Booking
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchFields}>
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            aria-label="Filter by name"
          />
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Mobile number"
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
            aria-label="Filter by mobile number"
          />
          <input
            type="text"
            className={styles.filterInput}
            placeholder="VIN"
            value={filterVin}
            onChange={(e) => setFilterVin(e.target.value)}
            aria-label="Filter by VIN"
          />
          <button
            type="button"
            className={styles.searchBtn}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Vehicle</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Amount (KWD)</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`${styles.td} ${styles.emptyCell}`}>
                    <p className={styles.empty}>
                      {hasActiveFilters
                        ? 'No bookings found. Try adjusting your search.'
                        : 'No bookings yet. Create one to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedBookings.map((booking) => (
                  <tr key={booking.id} className={styles.tr}>
                    <td className={styles.td} data-label="Customer">
                      <div>
                        <div>{booking.name}</div>
                        <div className={styles.subText}>{booking.email}</div>
                      </div>
                    </td>
                    <td className={styles.td} data-label="Vehicle">
                      {booking.vehicle_model}
                    </td>
                    <td className={styles.td} data-label="Service">
                      {capitalizeFirst(booking.service_package?.name)}
                    </td>
                    <td className={styles.td} data-label="Time">
                      {booking.booking_time || '—'}
                    </td>
                    <td className={styles.td} data-label="Status">
                      <span
                        className={`${styles.statusBadge} ${STATUS_CLASS_MAP[booking.status] || styles.statusPending}`}
                      >
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className={styles.td} data-label="Amount (KWD)">
                      {booking.amount}
                    </td>
                    <td className={styles.td} data-label="Actions">
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openView(booking)}
                          aria-label={`View details for ${booking.name}`}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openEdit(booking)}
                          aria-label={`Edit booking for ${booking.name}`}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => openDeleteConfirm(booking)}
                          aria-label={`Delete booking for ${booking.name}`}
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

      <CreateEditBookingModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        servicePackages={packages}
      />

      <CreateEditBookingModal
        open={Boolean(editBooking)}
        onClose={() => setEditBooking(null)}
        initialData={editBooking || undefined}
        onSubmit={handleEditSubmit}
        servicePackages={packages}
      />

      <ViewBookingModal
        open={Boolean(viewBooking)}
        onClose={() => setViewBooking(null)}
        booking={viewBooking}
      />

      <ConfirmDeleteModal
        open={Boolean(deleteConfirmBooking)}
        onClose={() => setDeleteConfirmBooking(null)}
        onConfirm={handleDeleteConfirm}
        booking={deleteConfirmBooking}
      />

      <ConfirmAmountModal
        open={Boolean(pendingPayload)}
        onClose={handleCancelAmount}
        onConfirm={handleConfirmAmount}
        onCancel={handleCancelAmount}
      />
    </div>
  );
}

export default BookingsScreen;
