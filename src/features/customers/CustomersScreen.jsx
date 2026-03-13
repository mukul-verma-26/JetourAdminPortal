import { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { useCustomers } from './useCustomers';
import CreateEditCustomerModal from './CreateEditCustomerModal';
import ViewCustomerModal from './ViewCustomerModal';
import ConfirmDeleteCustomerModal from './ConfirmDeleteCustomerModal';
import styles from './CustomersScreen.module.scss';

function getInitials(name) {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getStatusLabel(value) {
  if (!value) return '—';
  const normalized = String(value).toLowerCase();
  if (normalized === 'active') return 'Active';
  if (normalized === 'inactive') return 'Inactive';
  return value;
}

function formatJoined(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function getJoiningDate(customer) {
  return customer.joiningDate || customer.joined;
}

const STATUS_CLASS_MAP = {
  active: styles.statusActive,
  inactive: styles.statusInactive,
};

function CustomersScreen() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    fetchCustomerDetails,
    searchCustomers,
    pagination,
    goToPage,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCustomers();
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ name: '', email: '', phone: '' });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deleteConfirmCustomer, setDeleteConfirmCustomer] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const displayedCustomers = useMemo(() => customers, [customers]);
  const hasActiveFilters = Boolean(
    filterName.trim() ||
    filterEmail.trim() ||
    filterPhone.trim() ||
    appliedFilters.name ||
    appliedFilters.email ||
    appliedFilters.phone
  );

  const handleSearch = async () => {
    setAppliedFilters({
      name: filterName,
      email: filterEmail,
      phone: filterPhone,
    });

    try {
      await searchCustomers({
        name: filterName,
        contact_number: filterPhone,
        email: filterEmail,
      });
    } catch {
      // Error handled in useCustomers
    }
  };

  const handleClearFilters = async () => {
    setFilterName('');
    setFilterEmail('');
    setFilterPhone('');
    setAppliedFilters({ name: '', email: '', phone: '' });

    try {
      await searchCustomers({
        name: '',
        contact_number: '',
        email: '',
      });
    } catch {
      // Error handled in useCustomers
    }
  };

  const handleCreateSubmit = async (payload) => {
    try {
      await addCustomer(payload);
      setCreateModalOpen(false);
    } catch {
      // Error handled in useCustomers
    }
  };

  const handleEditSubmit = async (id, payload) => {
    try {
      await updateCustomer(id, payload);
      setEditCustomer(null);
    } catch {
      // Error handled in useCustomers
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteCustomer(id);
      setDeleteConfirmCustomer(null);
    } catch {
      // Error handled in useCustomers
    }
  };

  const handleViewCustomer = async (customerId) => {
    setIsDetailsLoading(true);
    try {
      const detailedCustomer = await fetchCustomerDetails(customerId);
      if (detailedCustomer) {
        setViewCustomer(detailedCustomer);
      }
    } catch {
      // Error handled in useCustomers
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleEditCustomer = async (customerId) => {
    setIsDetailsLoading(true);
    try {
      const detailedCustomer = await fetchCustomerDetails(customerId);
      if (detailedCustomer) {
        setEditCustomer(detailedCustomer);
      }
    } catch {
      // Error handled in useCustomers
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page <= 1 || isLoading) return;
    goToPage(pagination.page - 1);
  };

  const handleNextPage = () => {
    if (pagination.page >= pagination.totalPages || isLoading) return;
    goToPage(pagination.page + 1);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Customer Management</h2>
          <p className={styles.subtitle}>
            View and manage customer information
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.exportBtn}>
            <FiDownload size={18} aria-hidden />
            Export report
          </button>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setCreateModalOpen(true)}
          >
            <FiPlus size={18} aria-hidden />
            Add Customer
          </button>
        </div>
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
            placeholder="Email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            aria-label="Filter by email"
          />
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Phone number"
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
            aria-label="Filter by phone number"
          />
          <button
            type="button"
            className={styles.searchBtn}
            onClick={handleSearch}
          >
            Search
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className={styles.card}>
        {isLoading ? (
          <div className={styles.emptyState}>
            <p>Loading customers...</p>
          </div>
        ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Contact</th>
                <th className={styles.th}>Joined</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`${styles.td} ${styles.emptyCell}`}
                  >
                    <p className={styles.empty}>
                      No customers found.
                      {(appliedFilters.name || appliedFilters.email || appliedFilters.phone)
                        ? ' Try adjusting your search or filters.'
                        : ' Add a customer to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((customer) => (
                  <tr key={customer.id} className={styles.tr}>
                    <td className={styles.td} data-label="Name">
                      <div className={styles.nameCell}>
                        <span
                          className={styles.avatar}
                          aria-hidden
                        >
                          {getInitials(customer.name)}
                        </span>
                        <span>{customer.name}</span>
                      </div>
                    </td>
                    <td className={styles.td} data-label="Contact">
                      <div className={styles.contactCell}>
                        <p className={styles.contactLine}>
                          {customer.phone}
                        </p>
                        {customer.email && (
                          <p className={styles.contactEmail}>
                            {customer.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className={styles.td} data-label="Joined">
                      {formatJoined(getJoiningDate(customer))}
                    </td>
                    <td className={styles.td} data-label="Status">
                      <span
                        className={`${styles.statusBadge} ${STATUS_CLASS_MAP[customer.status] || styles.statusActive}`}
                      >
                        {getStatusLabel(customer.status)}
                      </span>
                    </td>
                    <td className={styles.td} data-label="Actions">
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => handleViewCustomer(customer.id)}
                          aria-label={`View ${customer.name}`}
                          disabled={isDetailsLoading}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => handleEditCustomer(customer.id)}
                          aria-label={`Edit ${customer.name}`}
                          disabled={isDetailsLoading}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() =>
                            setDeleteConfirmCustomer(customer)
                          }
                          aria-label={`Delete ${customer.name}`}
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
        )}
        <div className={styles.paginationRow}>
          <p className={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
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
      </div>

      <CreateEditCustomerModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isCreating}
      />

      <CreateEditCustomerModal
        open={Boolean(editCustomer)}
        onClose={() => setEditCustomer(null)}
        initialData={editCustomer || undefined}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      <ViewCustomerModal
        open={Boolean(viewCustomer)}
        onClose={() => setViewCustomer(null)}
        customer={viewCustomer}
      />

      <ConfirmDeleteCustomerModal
        open={Boolean(deleteConfirmCustomer)}
        onClose={() => setDeleteConfirmCustomer(null)}
        onConfirm={handleDeleteConfirm}
        customer={deleteConfirmCustomer}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default CustomersScreen;
