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
      const qtyInStock = parseInt(item.qtyInStock, 10) || 0;
      const newItem = {
        ...item,
        id: nextId,
        itemId: nextItemId,
        addedDate,
        qtyInStock,
        unitPrice: parseFloat(item.unitPrice) || 0,
        stockStatus: determineStockStatus(qtyInStock),
        partStatus: item.partStatus || 'usable',
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
            updated.qtyInStock !== undefined
              ? parseInt(updated.qtyInStock, 10) || 0
              : item.qtyInStock;
          return {
            ...item,
            ...updated,
            id,
            qtyInStock,
            unitPrice:
              updated.unitPrice !== undefined
                ? parseFloat(updated.unitPrice) || 0
                : item.unitPrice,
            stockStatus: determineStockStatus(qtyInStock),
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
