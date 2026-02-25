import { useState, useCallback, useMemo } from 'react';
import { INITIAL_INVENTORY } from './constants';

function sortByAddedDate(items) {
  return [...items].sort(
    (a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0)
  );
}

function getNextItemId(items) {
  const max = items.reduce((acc, item) => {
    const num = parseInt(item.itemId.replace('INV-', ''), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `INV-${String(max + 1).padStart(3, '0')}`;
}

function determineStockStatus(qty) {
  if (qty === 0) return 'out_of_stock';
  if (qty <= 10) return 'low_stock';
  return 'in_stock';
}

export function useInventory() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  const addItem = useCallback((item) => {
    setInventory((prev) => {
      const nextId = String(Date.now());
      const nextItemId = getNextItemId(prev);
      const addedDate = new Date().toISOString().slice(0, 10);
      const qtyInStock =
        parseInt(item.quantity != null ? item.quantity : item.qtyInStock, 10) || 0;
      const unitPrice =
        parseFloat(item.unit_price != null ? item.unit_price : item.unitPrice) || 0;
      const partStatus =
        item.part_status != null ? item.part_status : (item.partStatus || 'usable');
      const newItem = {
        name: item.name,
        id: nextId,
        itemId: nextItemId,
        addedDate,
        qtyInStock,
        unitPrice,
        stockStatus: determineStockStatus(qtyInStock),
        partStatus,
      };
      return sortByAddedDate([newItem, ...prev]);
    });
  }, []);

  const updateItem = useCallback((id, updated) => {
    setInventory((prev) =>
      sortByAddedDate(
        prev.map((item) => {
          if (item.id !== id) return item;
          const qtyInStock =
            updated.quantity !== undefined || updated.qtyInStock !== undefined
              ? parseInt(
                  updated.quantity != null ? updated.quantity : updated.qtyInStock,
                  10
                ) || 0
              : item.qtyInStock;
          const unitPrice =
            updated.unit_price !== undefined || updated.unitPrice !== undefined
              ? parseFloat(
                  updated.unit_price != null
                    ? updated.unit_price
                    : updated.unitPrice
                ) || 0
              : item.unitPrice;
          const partStatus =
            updated.part_status != null
              ? updated.part_status
              : updated.partStatus != null
                ? updated.partStatus
                : item.partStatus;
          return {
            ...item,
            name: updated.name != null ? updated.name : item.name,
            id,
            qtyInStock,
            unitPrice,
            stockStatus: determineStockStatus(qtyInStock),
            partStatus,
          };
        })
      )
    );
  }, []);

  const deleteItem = useCallback((id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const filteredInventory = useMemo(
    () => ({
      bySearch: (list, query) => {
        if (!query.trim()) return list;
        const q = query.trim().toLowerCase();
        return list.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            (item.itemId && item.itemId.toLowerCase().includes(q))
        );
      },
      byStockStatus: (list, status) => {
        if (!status || status === 'all') return list;
        return list.filter((item) => item.stockStatus === status);
      },
      byPartStatus: (list, status) => {
        if (!status || status === 'all') return list;
        return list.filter((item) => item.partStatus === status);
      },
    }),
    []
  );

  return {
    inventory,
    addItem,
    updateItem,
    deleteItem,
    filteredInventory,
  };
}
