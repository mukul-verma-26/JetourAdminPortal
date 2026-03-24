import { useState } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiSearch, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { createCustomerBooking } from '../../api/bookings';
import { useBookings } from './useBookings';
import { useBookingFormDependencies } from './hooks/useBookingFormDependencies';
import { transformBooking } from './helpers/transformBooking';
import { STATUS_OPTIONS } from './constants';
import CreateEditBookingModal from './CreateEditBookingModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ExportBookingsModal from './ExportBookingsModal';
import DatePicker from './components/DatePicker';
import styles from './BookingsScreen.module.scss';

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function mapGender(value) {
  if (!value) return 'Male';
  if (value === 'M') return 'Male';
  if (value === 'F') return 'Female';
  return value;
}

const STATUS_CLASS_MAP = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusIn_progress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

function BookingsScreen() {
  const {
    bookings,
    isLoading,
    error,
    pagination,
    isExporting,
    searchBookings,
    exportBookings,
    addBooking,
    updateBooking,
    deleteBooking,
  } = useBookings();
  const {
    vehicleOptions,
    packages,
    drivers,
    technicians,
    serviceVans,
    isLoadingFormDependencies,
    loadFormDependencies,
  } = useBookingFormDependencies();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    contact: '',
    from_date: '',
    to_date: '',
  });
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleCreateSubmit = async (payload) => {
    const requestBody = {
      customer: {
        name: payload.name,
        phone: payload.phone,
        country_code: payload.country_code,
        email: payload.email,
        gender: mapGender(payload.gender),
        address: {
          governorate: payload.governorate,
          area: payload.area,
          block: payload.block,
          street: payload.street,
          building_no: payload.building_no,
          floor_no: payload.floor_no,
          flat_no: payload.flat_no,
          paci_details: payload.paci_details,
          lat: payload.locationData?.lat ?? null,
          lng: payload.locationData?.lng ?? null,
        },
      },
      vehicle: {
        vehicle_model: payload.vehicle_model,
        registration_number: payload.vehicle_registration,
        mileage: Number(String(payload.mileage).replace(/,/g, '')) || 0,
      },
      package: {
        package_id: payload.service_package?.id,
      },
      schedule: {
        date: payload.booking_date,
        start_time: payload.booking_time,
      },
      payment_method: payload.payment_method,
      additional_notes: payload.additional_notes,
    };

    const response = await createCustomerBooking(requestBody);
    const isCreateSuccess = Boolean(response?.success || response?.status);
    if (!isCreateSuccess) {
      throw new Error(response?.message || 'Failed to create booking');
    }

    const createdBookingRaw = response?.booking
      ? {
          ...response.booking,
          customer: {
            ...response.booking.customer,
            name: requestBody.customer.name,
            email: requestBody.customer.email,
            gender: requestBody.customer.gender,
            address: {
              ...requestBody.customer.address,
              google_location: payload.google_location || '',
            },
          },
          assignment: {
            ...(response.booking.assignment || {}),
            driver: payload.driver_detail
              ? { _id: payload.driver_detail.id, name: payload.driver_detail.name }
              : response.booking.assignment?.driver || null,
            technician: payload.technician_detail
              ? { _id: payload.technician_detail.id, name: payload.technician_detail.name }
              : response.booking.assignment?.technician || null,
            service_van: payload.service_van
              ? { _id: payload.service_van.id, registration_number: payload.service_van.registration_number }
              : response.booking.assignment?.service_van || null,
          },
        }
      : null;
    const createdBooking = createdBookingRaw ? transformBooking(createdBookingRaw) : null;
    if (createdBooking) {
      addBooking(createdBooking);
    }

    setCreateModalOpen(false);
    if (window.showToast) {
      window.showToast(response?.message || 'Booking created successfully', 'success');
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

  const handleExportSubmit = async ({ from_date: exportFromDate, to_date: exportToDate }) => {
    await exportBookings({
      from_date: exportFromDate,
      to_date: exportToDate,
    });
    setExportModalOpen(false);
  };

  const handleOpenCreate = async () => {
    const loaded = await loadFormDependencies();
    if (loaded) {
      setCreateModalOpen(true);
    }
  };

  const openEdit = async (booking) => {
    const loaded = await loadFormDependencies();
    if (loaded) setEditBooking(booking);
  };
  const openView = async (booking) => {
    const loaded = await loadFormDependencies();
    if (loaded) setViewBooking(booking);
  };
  const openDeleteConfirm = (booking) => setDeleteConfirmBooking(booking);

  const displayedBookings = bookings;

  const handleSearch = () => {
    const nextFilters = { name, contact, from_date, to_date };
    setAppliedFilters(nextFilters);
    searchBookings(nextFilters);
  };

  const handleClearFilters = () => {
    setName('');
    setContact('');
    setFromDate('');
    setToDate('');
    setAppliedFilters({
      name: '',
      contact: '',
      from_date: '',
      to_date: '',
    });
    searchBookings({});
  };

  const handlePrevPage = () => {
    if (pagination.page <= 1 || isLoading) return;
    searchBookings(appliedFilters, pagination.page - 1, pagination.limit);
  };

  const handleNextPage = () => {
    if (pagination.page >= pagination.totalPages || isLoading) return;
    searchBookings(appliedFilters, pagination.page + 1, pagination.limit);
  };

  const hasActiveFilters =
    appliedFilters.name ||
    appliedFilters.contact ||
    appliedFilters.from_date ||
    appliedFilters.to_date;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>Bookings</h2>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={() => setExportModalOpen(true)}
            disabled={isExporting}
          >
            <FiDownload size={18} aria-hidden />
            {isExporting ? 'Downloading...' : 'Export report'}
          </button>
          <button
            type="button"
            className={styles.createBtn}
            onClick={handleOpenCreate}
            disabled={isLoadingFormDependencies}
          >
            <FiPlus size={18} aria-hidden />
            {isLoadingFormDependencies ? 'Loading...' : 'Create Booking'}
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
              {[appliedFilters.name, appliedFilters.contact, appliedFilters.from_date, appliedFilters.to_date].filter(Boolean).length} active
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
                name="name"
                className={styles.filterInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Filter by name"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="filter_contact" className={styles.filterLabel}>
                Contact
              </label>
              <input
                type="text"
                id="filter_contact"
                name="contact"
                className={styles.filterInput}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                aria-label="Filter by contact"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="filter_date_from" className={styles.filterLabel}>
                From date
              </label>
              <DatePicker
                id="filter_date_from"
                name="from_date"
                value={from_date}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="Select from date"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="filter_date_to" className={styles.filterLabel}>
                To date
              </label>
              <DatePicker
                id="filter_date_to"
                name="to_date"
                value={to_date}
                onChange={(e) => setToDate(e.target.value)}
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
        {!error && (
          <div className={styles.paginationRow}>
            <p className={styles.paginationInfo}>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total bookings)
            </p>
            <div className={styles.paginationActions}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={handlePrevPage}
                disabled={isLoading || pagination.page <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={handleNextPage}
                disabled={isLoading || pagination.page >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateEditBookingModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        servicePackages={packages}
        vehicleOptions={vehicleOptions}
        drivers={drivers}
        technicians={technicians}
        serviceVans={serviceVans}
      />

      <CreateEditBookingModal
        open={Boolean(editBooking)}
        onClose={() => setEditBooking(null)}
        initialData={editBooking || undefined}
        onSubmit={handleEditSubmit}
        servicePackages={packages}
        vehicleOptions={vehicleOptions}
        drivers={drivers}
        technicians={technicians}
        serviceVans={serviceVans}
      />

      <CreateEditBookingModal
        open={Boolean(viewBooking)}
        onClose={() => setViewBooking(null)}
        initialData={viewBooking || undefined}
        onSubmit={() => {}}
        servicePackages={packages}
        vehicleOptions={vehicleOptions}
        drivers={drivers}
        technicians={technicians}
        serviceVans={serviceVans}
        readOnly
      />

      <ConfirmDeleteModal
        open={Boolean(deleteConfirmBooking)}
        onClose={() => setDeleteConfirmBooking(null)}
        onConfirm={handleDeleteConfirm}
        booking={deleteConfirmBooking}
      />

      {exportModalOpen && (
        <ExportBookingsModal
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onSubmit={handleExportSubmit}
          isExporting={isExporting}
        />
      )}

      {isExporting && (
        <div className={styles.downloadOverlay}>
          <div className={styles.downloadLoader} />
          <p className={styles.downloadText}>File is downloading</p>
        </div>
      )}
    </div>
  );
}

export default BookingsScreen;
