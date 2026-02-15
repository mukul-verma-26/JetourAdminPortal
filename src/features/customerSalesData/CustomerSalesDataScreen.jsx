import { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { useCustomerSalesData } from './useCustomerSalesData';
import { useVehicles } from '../vehicles/useVehicles';
import { COLOR_SWATCH_MAP } from './constants';
import CreateEditSalesDataModal from './CreateEditSalesDataModal';
import ViewSalesDataModal from './ViewSalesDataModal';
import ConfirmDeleteSalesDataModal from './ConfirmDeleteSalesDataModal';
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
  const [appliedFilters, setAppliedFilters] = useState({
    customerName: '',
    contact: '',
    vin: '',
  });
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
    });
  };

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

      <div className={styles.filters}>
        <div className={styles.searchFields}>
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Customer name"
            value={filterCustomerName}
            onChange={(e) => setFilterCustomerName(e.target.value)}
            aria-label="Filter by customer name"
          />
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Contact number"
            value={filterContact}
            onChange={(e) => setFilterContact(e.target.value)}
            aria-label="Filter by contact"
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
                <th className={styles.th}>Customer Name</th>
                <th className={styles.th}>Contact</th>
                <th className={styles.th}>Vehicle</th>
                <th className={styles.th}>Color</th>
                <th className={styles.th}>VIN</th>
                <th className={styles.th}>Model Year</th>
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
                      {(appliedFilters.customerName || appliedFilters.contact || appliedFilters.vin)
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
                    <td className={styles.td} data-label="Model Year">
                      {item.modelYear}
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
