import { apiClient } from './client.js';

function inventoryPartActionBody(technicianId) {
  const id = String(technicianId ?? '').trim();
  return {
    technician_id: id,
    technicianId: id,
  };
}

function isMongoObjectId(value) {
  return /^[a-f\d]{24}$/i.test(String(value ?? '').trim());
}

export async function approveInventoryPartRequest(requestId, itemId, technicianId) {
  const requestIdEncoded = encodeURIComponent(String(requestId ?? '').trim());
  const itemIdEncoded = encodeURIComponent(String(itemId ?? '').trim());
  const approveUrl = `/inventory_item/admin/request/${requestIdEncoded}/item/${itemIdEncoded}/approve`;
  const approveBody = isMongoObjectId(technicianId)
    ? inventoryPartActionBody(technicianId)
    : undefined;
  try {
    const { data } = await apiClient.patch(
      approveUrl,
      approveBody,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  } catch (error) {
    console.log(
      'approveInventoryPartRequest',
      `PATCH ${approveUrl}`,
      error
    );
    console.log('approveInventoryPartRequest', 'Error response:', error?.response?.data);
    console.log('approveInventoryPartRequest', 'Error message:', error?.message);
    throw error;
  }
}

export async function rejectInventoryPartRequest(requestId, itemId, technicianId) {
  const requestIdEncoded = encodeURIComponent(String(requestId ?? '').trim());
  const itemIdEncoded = encodeURIComponent(String(itemId ?? '').trim());
  const rejectUrl = `/inventory_item/admin/request/${requestIdEncoded}/item/${itemIdEncoded}/reject`;
  try {
    const { data } = await apiClient.patch(
      rejectUrl,
      inventoryPartActionBody(technicianId),
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  } catch (error) {
    console.log(
      'rejectInventoryPartRequest',
      `PATCH ${rejectUrl}`,
      error
    );
    console.log('rejectInventoryPartRequest', 'Error response:', error?.response?.data);
    console.log('rejectInventoryPartRequest', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteInventoryPartRequest(requestId, itemId, technicianId) {
  const requestIdEncoded = encodeURIComponent(String(requestId ?? '').trim());
  const itemIdEncoded = encodeURIComponent(String(itemId ?? '').trim());
  const deleteUrl = `/inventory_item/request/${requestIdEncoded}/item/${itemIdEncoded}`;
  try {
    const { data } = await apiClient.delete(deleteUrl, {
      headers: { 'Content-Type': 'application/json' },
      data: { technicianId: String(technicianId ?? '').trim() },
    });
    return data;
  } catch (error) {
    console.log(
      'deleteInventoryPartRequest',
      `DELETE ${deleteUrl}`,
      error
    );
    console.log('deleteInventoryPartRequest', 'Error response:', error?.response?.data);
    console.log('deleteInventoryPartRequest', 'Error message:', error?.message);
    throw error;
  }
}

export async function getAllInventoryPartRequests(page = 1, limit = 10, filters = {}) {
  const allRequestsUrl = '/inventory_item/all-request';
  const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const normalizedLimit =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const technician = String(filters?.technicianId ?? '').trim();
  const status = String(filters?.status ?? '').trim();
  const params = {
    page: normalizedPage,
    limit: normalizedLimit,
  };
  if (technician) {
    params.technician = technician;
  }
  if (status && status !== 'all') {
    params.status = status;
  }
  try {
    const { data } = await apiClient.get(allRequestsUrl, {
      headers: { 'Content-Type': 'application/json' },
      params,
    });
    return data;
  } catch (error) {
    const query = new URLSearchParams(params).toString();
    console.log(
      'getAllInventoryPartRequests',
      `GET ${allRequestsUrl}${query ? `?${query}` : ''}`,
      error
    );
    console.log('getAllInventoryPartRequests', 'Error response:', error?.response?.data);
    console.log('getAllInventoryPartRequests', 'Error message:', error?.message);
    throw error;
  }
}

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
