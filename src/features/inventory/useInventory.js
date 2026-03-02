import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem as updateInventoryItemApi,
  deleteInventoryItem as deleteInventoryItemApi,
} from '../../api/inventory';
import { mapApiItemToUi } from './helpers';

function sortByAddedDate(items) {
  return [...items].sort(
    (a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0)
  );
}

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchInventory() {
      setIsLoading(true);
      try {
        const res = await getInventoryItems();
        const list = res?.data || res || [];
        if (!cancelled) {
          const mapped = Array.isArray(list)
            ? list.map(mapApiItemToUi)
            : [];
          setInventory(sortByAddedDate(mapped));
        }
      } catch (error) {
        if (!cancelled) {
          console.log('useInventory', 'Failed to fetch inventory', error);
          if (typeof window?.showToast === 'function') {
            window.showToast('Failed to load inventory', 'error');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchInventory();
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(async (payload) => {
    setIsCreating(true);
    try {
      const data = await createInventoryItem(payload);
      const created = data?.data || data;
      const newItem = created ? mapApiItemToUi(created) : null;
      if (newItem) {
        setInventory((prev) => sortByAddedDate([newItem, ...prev]));
      }
      if (typeof window?.showToast === 'function') {
        window.showToast('Item added successfully', 'success');
      }
    } catch (error) {
      console.log('addItem', 'Failed to add inventory item', error);
      if (typeof window?.showToast === 'function') {
        window.showToast(
          error?.response?.data?.message || 'Failed to add item',
          'error'
        );
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateItem = useCallback(async (id, payload) => {
    setIsUpdating(true);
    try {
      const item = inventory.find((i) => i.id === id);
      const apiId = item?.id || id;
      await updateInventoryItemApi(apiId, payload);
      const res = await getInventoryItems();
      const list = res?.data || res || [];
      const mapped = Array.isArray(list) ? list.map(mapApiItemToUi) : [];
      setInventory(sortByAddedDate(mapped));
      if (typeof window?.showToast === 'function') {
        window.showToast('Item updated successfully', 'success');
      }
    } catch (error) {
      console.log('updateItem', 'Failed to update inventory item', error);
      if (typeof window?.showToast === 'function') {
        window.showToast(
          error?.response?.data?.message || 'Failed to update item',
          'error'
        );
      }
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [inventory]);

  const deleteItem = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      const item = inventory.find((i) => i.id === id);
      const apiId = item?.id || id;
      await deleteInventoryItemApi(apiId);
      setInventory((prev) => prev.filter((i) => i.id !== id));
      if (typeof window?.showToast === 'function') {
        window.showToast('Item deleted successfully', 'success');
      }
    } catch (error) {
      console.log('deleteItem', 'Failed to delete inventory item', error);
      if (typeof window?.showToast === 'function') {
        window.showToast(
          error?.response?.data?.message || 'Failed to delete item',
          'error'
        );
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [inventory]);

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
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
