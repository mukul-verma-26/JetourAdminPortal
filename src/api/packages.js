import { apiClient } from './client.js';

export async function getPackages() {
  try {
    const { data } = await apiClient.get('/packages');
    return data;
  } catch (error) {
    console.log('getPackages', 'GET /packages', 'Error:', error);
    console.log('getPackages', 'Error response:', error?.response?.data);
    console.log('getPackages', 'Error message:', error?.message);
    throw error;
  }
}

export async function getPackageById(packageId) {
  try {
    const { data } = await apiClient.get('/packages', {
      params: { package_id: packageId },
    });
    return data;
  } catch (error) {
    console.log('getPackageById', `GET /packages?package_id=${packageId}`, 'Error:', error);
    console.log('getPackageById', 'Error response:', error?.response?.data);
    console.log('getPackageById', 'Error message:', error?.message);
    throw error;
  }
}

export async function createPackage(payload) {
  try {
    const { data } = await apiClient.post('/packages', payload);
    return data;
  } catch (error) {
    console.log('createPackage', 'POST /packages', 'Error:', error);
    console.log('createPackage', 'Error response:', error?.response?.data);
    console.log('createPackage', 'Error message:', error?.message);
    throw error;
  }
}

export async function updatePackage(id, payload) {
  try {
    const { data } = await apiClient.patch(`/packages/${id}`, payload);
    return data;
  } catch (error) {
    console.log('updatePackage', `PATCH /packages/${id}`, 'Error:', error);
    console.log('updatePackage', 'Error response:', error?.response?.data);
    console.log('updatePackage', 'Error message:', error?.message);
    throw error;
  }
}

export async function deletePackage(id) {
  try {
    const { data } = await apiClient.delete(`/packages/${id}`);
    return data;
  } catch (error) {
    console.log('deletePackage', `DELETE /packages/${id}`, 'Error:', error);
    console.log('deletePackage', 'Error response:', error?.response?.data);
    console.log('deletePackage', 'Error message:', error?.message);
    throw error;
  }
}

export async function calculatePackagePrice(payload) {
  try {
    const { data } = await apiClient.post('/packages/calculate-price', payload);
    return data;
  } catch (error) {
    console.log('calculatePackagePrice', 'POST /packages/calculate-price', 'Error:', error);
    console.log('calculatePackagePrice', 'Error response:', error?.response?.data);
    console.log('calculatePackagePrice', 'Error message:', error?.message);
    throw error;
  }
}
