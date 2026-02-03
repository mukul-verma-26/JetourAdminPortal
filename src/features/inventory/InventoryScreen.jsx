import { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useInventory } from './useInventory';
import { STOCK_STATUS_OPTIONS, PART_STATUS_OPTIONS } from './constants';
import CreateEditInventoryModal from './CreateEditInventoryModal';
import ViewInventoryModal from './ViewInventoryModal';
import ConfirmDeleteInventoryModal from './ConfirmDeleteInventoryModal';
import styles from './InventoryScreen.module.scss';

function getStockStatusLabel(value) {
  return STOCK_STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getPartStatusLabel(value) {
  return PART_STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function formatAddedDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPrice(price) {
  if (price === undefined || price === null) return '—';
  return `${parseFloat(price).toFixed(3)} KWD`;
}

const STOCK_STATUS_CLASS_MAP = {
  in_stock: styles.statusInStock,
  low_stock: styles.statusLowStock,
  out_of_stock: styles.statusOutOfStock,
};

const PART_STATUS_CLASS_MAP = {
  usable: styles.partUsable,
  damaged: styles.partDamaged,
};

function InventoryScreen() {
  const { inventory, addItem, updateItem, deleteItem, filteredInventory } =
    useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  const displayedInventory = useMemo(() => {
    const bySearch = filteredInventory.bySearch(inventory, searchQuery);
    return filteredInventory.byStockStatus(bySearch, stockStatusFilter);
  }, [inventory, searchQuery, stockStatusFilter, filteredInventory]);

  const handleCreateSubmit = (payload) => {
    addItem(payload);
    setCreateModalOpen(false);
  };

  const handleEditSubmit = (id, payload) => {
    updateItem(id, payload);
    setEditItem(null);
  };

  const handleDeleteConfirm = (id) => {
    deleteItem(id);
    setDeleteConfirmItem(null);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Inventory Management</h2>
          <p className={styles.subtitle}>
            View and manage spare parts inventory
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setCreateModalOpen(true)}
          >
            <FiPlus size={18} aria-hidden />
            Add Item
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} size={18} aria-hidden />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search by name or item ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search inventory"
          />
        </div>
        <select
          className={styles.statusSelect}
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          aria-label="Filter by stock status"
        >
          {STOCK_STATUS_OPTIONS.map((opt) => (
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
                <th className={styles.th}>Item ID</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Qty in Stock</th>
                <th className={styles.th}>Unit Price</th>
                <th className={styles.th}>Added Date</th>
                <th className={styles.th}>Stock Status</th>
                <th className={styles.th}>Part Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className={`${styles.td} ${styles.emptyCell}`}
                  >
                    <p className={styles.empty}>
                      No inventory items found.
                      {searchQuery || stockStatusFilter !== 'all'
                        ? ' Try adjusting your search or filters.'
                        : ' Add an item to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedInventory.map((item) => (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td} data-label="Item ID">
                      {item.itemId}
                    </td>
                    <td className={styles.td} data-label="Name">
                      <span className={styles.itemName}>{item.name}</span>
                    </td>
                    <td className={styles.td} data-label="Qty in Stock">
                      {item.qtyInStock}
                    </td>
                    <td className={styles.td} data-label="Unit Price">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className={styles.td} data-label="Added Date">
                      {formatAddedDate(item.addedDate)}
                    </td>
                    <td className={styles.td} data-label="Stock Status">
                      <span
                        className={`${styles.statusBadge} ${STOCK_STATUS_CLASS_MAP[item.stockStatus] || styles.statusInStock}`}
                      >
                        {getStockStatusLabel(item.stockStatus)}
                      </span>
                    </td>
                    <td className={styles.td} data-label="Part Status">
                      <span
                        className={`${styles.partBadge} ${PART_STATUS_CLASS_MAP[item.partStatus] || styles.partUsable}`}
                      >
                        {getPartStatusLabel(item.partStatus)}
                      </span>
                    </td>
                    <td className={styles.td} data-label="Actions">
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setViewItem(item)}
                          aria-label={`View ${item.name}`}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setEditItem(item)}
                          aria-label={`Edit ${item.name}`}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => setDeleteConfirmItem(item)}
                          aria-label={`Delete ${item.name}`}
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

      <CreateEditInventoryModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <CreateEditInventoryModal
        open={Boolean(editItem)}
        onClose={() => setEditItem(null)}
        initialData={editItem || undefined}
        onSubmit={handleEditSubmit}
      />

      <ViewInventoryModal
        open={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        item={viewItem}
      />

      <ConfirmDeleteInventoryModal
        open={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleDeleteConfirm}
        item={deleteConfirmItem}
      />
    </div>
  );
}

export default InventoryScreen;
