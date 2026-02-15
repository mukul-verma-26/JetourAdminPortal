import { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { useCustomers } from './useCustomers';
import { CUSTOMER_STATUS_OPTIONS } from './constants';
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
  return (
    CUSTOMER_STATUS_OPTIONS.find((o) => o.value === value)?.label || value
  );
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
    filteredCustomers,
  } = useCustomers();
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ name: '', email: '', phone: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deleteConfirmCustomer, setDeleteConfirmCustomer] = useState(null);

  const displayedCustomers = useMemo(() => {
    const byFilters = filteredCustomers.byFilters(customers, appliedFilters);
    return filteredCustomers.byStatus(byFilters, statusFilter);
  }, [customers, appliedFilters, statusFilter, filteredCustomers]);

  const handleSearch = () => {
    setAppliedFilters({
      name: filterName,
      email: filterEmail,
      phone: filterPhone,
    });
  };

  const handleCreateSubmit = (payload) => {
    addCustomer(payload);
    setCreateModalOpen(false);
  };

  const handleEditSubmit = (id, payload) => {
    updateCustomer(id, payload);
    setEditCustomer(null);
  };

  const handleDeleteConfirm = (id) => {
    deleteCustomer(id);
    setDeleteConfirmCustomer(null);
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
          <button type="button" className={styles.importBtn}>
            Import from Dealer System
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
        </div>
        <select
          className={styles.statusSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          {CUSTOMER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Customer ID</th>
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
                    colSpan={6}
                    className={`${styles.td} ${styles.emptyCell}`}
                  >
                    <p className={styles.empty}>
                      No customers found.
                      {(appliedFilters.name || appliedFilters.email || appliedFilters.phone || statusFilter !== 'all')
                        ? ' Try adjusting your search or filters.'
                        : ' Add a customer to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((customer) => (
                  <tr key={customer.id} className={styles.tr}>
                    <td className={styles.td} data-label="Customer ID">
                      {customer.customerId}
                    </td>
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
                          onClick={() => setViewCustomer(customer)}
                          aria-label={`View ${customer.name}`}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setEditCustomer(customer)}
                          aria-label={`Edit ${customer.name}`}
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
      </div>

      <CreateEditCustomerModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <CreateEditCustomerModal
        open={Boolean(editCustomer)}
        onClose={() => setEditCustomer(null)}
        initialData={editCustomer || undefined}
        onSubmit={handleEditSubmit}
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
      />
    </div>
  );
}

export default CustomersScreen;
