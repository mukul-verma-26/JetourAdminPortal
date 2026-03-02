import { apiClient } from './client.js';

export async function getInventoryItems() {
  try {
    const { data } = await apiClient.get('/inventory_item');
    return data;
  } catch (error) {
    console.log('getInventoryItems', 'GET /inventory_item', 'Error:', error);
    console.log('getInventoryItems', 'Error response:', error?.response?.data);
    console.log('getInventoryItems', 'Error message:', error?.message);
    throw error;
  }
}

export async function createInventoryItem(payload) {
  try {
    const body = {
      name: String(payload.name || '').trim(),
      quantity: parseInt(payload.quantity, 10) || 0,
      unit_price: parseFloat(payload.unit_price) || 0,
      part_status: String(payload.part_status || 'usable'),
    };
    const { data } = await apiClient.post('/inventory_item', body);
    return data;
  } catch (error) {
    console.log('createInventoryItem', 'POST /inventory_item', 'Error:', error);
    console.log('createInventoryItem', 'Error response:', error?.response?.data);
    console.log('createInventoryItem', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateInventoryItem(id, payload) {
  try {
    const body = {
      name: String(payload.name || '').trim(),
      quantity: parseInt(payload.quantity, 10) || 0,
      unit_price: parseFloat(payload.unit_price) || 0,
      part_status: String(payload.part_status || 'usable'),
    };
    const { data } = await apiClient.put(`/inventory_item/${id}`, body);
    return data;
  } catch (error) {
    console.log('updateInventoryItem', `PUT /inventory_item/${id}`, 'Error:', error);
    console.log('updateInventoryItem', 'Error response:', error?.response?.data);
    console.log('updateInventoryItem', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteInventoryItem(id) {
  try {
    const { data } = await apiClient.delete(`/inventory_item/${id}`);
    return data;
  } catch (error) {
    console.log('deleteInventoryItem', `DELETE /inventory_item/${id}`, 'Error:', error);
    console.log('deleteInventoryItem', 'Error response:', error?.response?.data);
    console.log('deleteInventoryItem', 'Error message:', error?.message);
    throw error;
  }
}

// Alias for compatibility with inventoryService.createInventory
export { createInventoryItem as createInventory };
