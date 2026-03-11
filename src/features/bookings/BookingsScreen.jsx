import { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiSearch, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useBookings } from './useBookings';
import { useVehicles } from '../vehicles/useVehicles';
import { usePackagesContext } from '../settings/PackagesContext';
import { STATUS_OPTIONS } from './constants';
import CreateEditBookingModal from './CreateEditBookingModal';
import ViewBookingModal from './ViewBookingModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import DatePicker from './components/DatePicker';
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
  const { bookings, isLoading, error, addBooking, updateBooking, deleteBooking, filteredBookings } = useBookings();
  const { vehicleOptions } = useVehicles();
  const { packages } = usePackagesContext();
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterVin, setFilterVin] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    phone: '',
    vin: '',
    dateFrom: '',
    dateTo: '',
  });
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);

  const handleCreateSubmit = (payload) => {
    addBooking({ ...payload, status: 'confirmed' });
    setCreateModalOpen(false);
    if (window.showToast) {
      window.showToast('Booking created successfully', 'success');
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
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    });
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterPhone('');
    setFilterVin('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setAppliedFilters({
      name: '',
      phone: '',
      vin: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters =
    appliedFilters.name ||
    appliedFilters.phone ||
    appliedFilters.vin ||
    appliedFilters.dateFrom ||
    appliedFilters.dateTo;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>Bookings</h2>
        <div className={styles.headerActions}>
          <button type="button" className={styles.exportBtn}>
            <FiDownload size={18} aria-hidden />
            Export report
          </button>
          <button
            type="button"
            className={styles.createBtn}
            onClick={() => setCreateModalOpen(true)}
          >
            <FiPlus size={18} aria-hidden />
            Create Booking
          </button>
        </div>
      </div>

      <div className={styles.filtersAccordion}>
        <button
          type="button"
          className={styles.accordionHeader}
          onClick={() => setFiltersExpanded((prev) => !prev)}
          aria-expanded={filtersExpanded}
          aria-controls="filters-content"
        >
          {filtersExpanded ? (
            <FiChevronDown size={20} aria-hidden />
          ) : (
            <FiChevronRight size={20} aria-hidden />
          )}
          <span className={styles.accordionTitle}>Filters</span>
          {hasActiveFilters && (
            <span className={styles.accordionBadge}>
              {[appliedFilters.name, appliedFilters.phone, appliedFilters.vin, appliedFilters.dateFrom, appliedFilters.dateTo].filter(Boolean).length} active
            </span>
          )}
        </button>
        <div
          id="filters-content"
          className={`${styles.accordionBody} ${filtersExpanded ? styles.accordionBodyOpen : ''}`}
        >
          <div className={styles.accordionBodyInner}>
            <div className={styles.filtersGrid}>
            <div className={styles.filterField}>
              <label htmlFor="filter_name" className={styles.filterLabel}>
                Name
              </label>
              <input
                type="text"
                id="filter_name"
                className={styles.filterInput}
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                aria-label="Filter by name"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="filter_phone" className={styles.filterLabel}>
                Mobile number
              </label>
              <input
                type="text"
                id="filter_phone"
                className={styles.filterInput}
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                aria-label="Filter by mobile number"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="filter_vin" className={styles.filterLabel}>
                VIN
              </label>
              <input
                type="text"
                id="filter_vin"
                className={styles.filterInput}
                value={filterVin}
                onChange={(e) => setFilterVin(e.target.value)}
                aria-label="Filter by VIN"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="filter_date_from" className={styles.filterLabel}>
                From date
              </label>
              <DatePicker
                id="filter_date_from"
                name="filter_date_from"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                placeholder="Select from date"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="filter_date_to" className={styles.filterLabel}>
                To date
              </label>
              <DatePicker
                id="filter_date_to"
                name="filter_date_to"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                placeholder="Select to date"
              />
            </div>
          </div>
          <div className={styles.filterActions}>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={handleSearch}
            >
              <FiSearch size={18} aria-hidden />
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClearFilters}
              >
                <FiX size={18} aria-hidden />
                Clear filters
              </button>
            )}
          </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Phone</th>
                <th className={styles.th}>Vehicle</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Booking date</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Amount (KWD)</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className={`${styles.td} ${styles.emptyCell}`}>
                    <p className={styles.empty}>Loading bookings...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className={`${styles.td} ${styles.emptyCell}`}>
                    <p className={styles.empty}>Failed to load bookings. Please try again.</p>
                  </td>
                </tr>
              ) : displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className={`${styles.td} ${styles.emptyCell}`}>
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
                      {booking.name}
                    </td>
                    <td className={styles.td} data-label="Phone">
                      {booking.phone || '—'}
                    </td>
                    <td className={styles.td} data-label="Vehicle">
                      {booking.vehicle_model}
                    </td>
                    <td className={styles.td} data-label="Service">
                      {capitalizeFirst(booking.service_package?.name)}
                    </td>
                    <td className={styles.td} data-label="Booking date">
                      {booking.booking_date || '—'}
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
        vehicleOptions={vehicleOptions}
      />

      <CreateEditBookingModal
        open={Boolean(editBooking)}
        onClose={() => setEditBooking(null)}
        initialData={editBooking || undefined}
        onSubmit={handleEditSubmit}
        servicePackages={packages}
        vehicleOptions={vehicleOptions}
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
    </div>
  );
}

export default BookingsScreen;
