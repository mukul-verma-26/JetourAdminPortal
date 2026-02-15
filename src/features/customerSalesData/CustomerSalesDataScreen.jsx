import { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload, FiSearch, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useCustomerSalesData } from './useCustomerSalesData';
import { useVehicles } from '../vehicles/useVehicles';
import { COLOR_SWATCH_MAP } from './constants';
import CreateEditSalesDataModal from './CreateEditSalesDataModal';
import ViewSalesDataModal from './ViewSalesDataModal';
import ConfirmDeleteSalesDataModal from './ConfirmDeleteSalesDataModal';
import DatePicker from './components/DatePicker';
import styles from './CustomerSalesDataScreen.module.scss';

function CustomerSalesDataScreen() {
  const {
    salesDataList,
    addSalesData,
    updateSalesData,
    deleteSalesData,
    filteredSalesData,
  } = useCustomerSalesData();
  const { vehicleOptions } = useVehicles();

  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterContact, setFilterContact] = useState('');
  const [filterVin, setFilterVin] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    customerName: '',
    contact: '',
    vin: '',
    dateFrom: '',
    dateTo: '',
  });
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  const displayedItems = useMemo(() => {
    return filteredSalesData.byFilters(salesDataList, appliedFilters);
  }, [salesDataList, appliedFilters, filteredSalesData]);

  const handleSearch = () => {
    setAppliedFilters({
      customerName: filterCustomerName,
      contact: filterContact,
      vin: filterVin,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    });
  };

  const handleClearFilters = () => {
    setFilterCustomerName('');
    setFilterContact('');
    setFilterVin('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setAppliedFilters({
      customerName: '',
      contact: '',
      vin: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters =
    appliedFilters.customerName ||
    appliedFilters.contact ||
    appliedFilters.vin ||
    appliedFilters.dateFrom ||
    appliedFilters.dateTo;

  const handleCreateSubmit = (payload) => {
    addSalesData(payload, vehicleOptions);
    setCreateModalOpen(false);
  };

  const handleEditSubmit = (id, payload) => {
    updateSalesData(id, payload, vehicleOptions);
    setEditItem(null);
  };

  const handleDeleteConfirm = (id) => {
    deleteSalesData(id);
    setDeleteConfirmItem(null);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Customer Sales Data</h2>
          <p className={styles.subtitle}>
            View and manage customer sales data
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
            Add Details
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
              {[appliedFilters.customerName, appliedFilters.contact, appliedFilters.vin, appliedFilters.dateFrom, appliedFilters.dateTo].filter(Boolean).length} active
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
                <label htmlFor="filter_customer_name" className={styles.filterLabel}>
                  Customer name
                </label>
                <input
                  type="text"
                  id="filter_customer_name"
                  className={styles.filterInput}
                  placeholder="Customer name"
                  value={filterCustomerName}
                  onChange={(e) => setFilterCustomerName(e.target.value)}
                  aria-label="Filter by customer name"
                />
              </div>
              <div className={styles.filterField}>
                <label htmlFor="filter_contact" className={styles.filterLabel}>
                  Contact number
                </label>
                <input
                  type="text"
                  id="filter_contact"
                  className={styles.filterInput}
                  placeholder="Contact number"
                  value={filterContact}
                  onChange={(e) => setFilterContact(e.target.value)}
                  aria-label="Filter by contact"
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
                  placeholder="VIN"
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
                <th className={styles.th}>Customer Name</th>
                <th className={styles.th}>Contact</th>
                <th className={styles.th}>Vehicle</th>
                <th className={styles.th}>Color</th>
                <th className={styles.th}>VIN</th>
                <th className={styles.th}>Sold Date</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`${styles.td} ${styles.emptyCell}`}
                  >
                    <p className={styles.empty}>
                      No sales data found.
                      {(appliedFilters.customerName || appliedFilters.contact || appliedFilters.vin || appliedFilters.dateFrom || appliedFilters.dateTo)
                        ? ' Try adjusting your search or filters.'
                        : ' Add details to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedItems.map((item) => (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td} data-label="Customer Name">
                      {item.customerName || '—'}
                    </td>
                    <td className={styles.td} data-label="Contact">
                      {item.customerContactNumber}
                    </td>
                    <td className={styles.td} data-label="Vehicle">
                      {item.vehicleName}
                    </td>
                    <td className={styles.td} data-label="Color">
                      <span className={styles.colorCell}>
                        {item.color && (
                          <span
                            className={styles.colorSwatch}
                            style={{
                              backgroundColor:
                                COLOR_SWATCH_MAP[item.color] || '#e0e0e0',
                            }}
                            title={item.color}
                            aria-hidden
                          />
                        )}
                        {item.color || '—'}
                      </span>
                    </td>
                    <td className={styles.td} data-label="VIN">
                      {item.vin}
                    </td>
                    <td className={styles.td} data-label="Sold Date">
                      {item.soldDate
                        ? new Date(item.soldDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
                        : '—'}
                    </td>
                    <td className={styles.td} data-label="Actions">
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setViewItem(item)}
                          aria-label={`View ${item.salesDataId}`}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setEditItem(item)}
                          aria-label={`Edit ${item.salesDataId}`}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setDeleteConfirmItem(item)}
                          aria-label={`Delete ${item.salesDataId}`}
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

      <CreateEditSalesDataModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        vehicleOptions={vehicleOptions}
      />

      <CreateEditSalesDataModal
        open={Boolean(editItem)}
        onClose={() => setEditItem(null)}
        initialData={editItem || undefined}
        onSubmit={handleEditSubmit}
        vehicleOptions={vehicleOptions}
      />

      <ViewSalesDataModal
        open={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        salesData={viewItem}
      />

      <ConfirmDeleteSalesDataModal
        open={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleDeleteConfirm}
        salesData={deleteConfirmItem}
      />
    </div>
  );
}

export default CustomerSalesDataScreen;
