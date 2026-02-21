import { apiClient } from './client.js';

export async function getDrivers() {
  try {
    const { data } = await apiClient.get('/drivers');
    return data;
  } catch (error) {
    console.log('getDrivers', 'GET /drivers', 'Error:', error);
    console.log('getDrivers', 'Error response:', error?.response?.data);
    console.log('getDrivers', 'Error message:', error?.message);
    throw error;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function toImageString(image) {
  if (image == null) return '';
  if (typeof image === 'string') return image.trim();
  return '';
}

export async function createDriver(payload) {
  try {
    let imageStr = '';
    if (payload.image instanceof File) {
      const dataUrl = await fileToBase64(payload.image);
      if (typeof dataUrl === 'string' && dataUrl.includes(',')) {
        imageStr = dataUrl.split(',')[1] || '';
      }
    } else {
      imageStr = toImageString(payload.image);
    }
    const body = {
      name: String(payload.name || ''),
      contact: String(payload.contact || ''),
      civil_id: String(payload.civil_id || ''),
      gender: String(payload.gender || 'male'),
      status: String(payload.status || 'active'),
      rating: Number(payload.rating) || 0,
      image: String(imageStr),
    };
    if (typeof body.image !== 'string') {
      body.image = '';
    }
    const { data } = await apiClient.post('/drivers', body);
    return data;
  } catch (error) {
    console.log('createDriver', 'POST /drivers', 'Error:', error);
    console.log('createDriver', 'Error response:', error?.response?.data);
    console.log('createDriver', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateDriver(id, payload) {
  try {
    let imageStr = '';
    if (payload.image instanceof File) {
      const dataUrl = await fileToBase64(payload.image);
      if (typeof dataUrl === 'string' && dataUrl.includes(',')) {
        imageStr = dataUrl.split(',')[1] || '';
      }
    } else {
      imageStr = toImageString(payload.image);
      if (imageStr && imageStr.startsWith('data:')) {
        imageStr = imageStr.includes(',') ? imageStr.split(',')[1] || '' : '';
      }
    }
    const body = {
      name: String(payload.name || ''),
      contact: String(payload.contact || ''),
      civil_id: String(payload.civil_id || ''),
      gender: String(payload.gender || 'male'),
      status: String(payload.status || 'active'),
      rating: Number(payload.rating) || 0,
      image: String(imageStr),
    };
    if (typeof body.image !== 'string') {
      body.image = '';
    }
    const { data } = await apiClient.put(`/drivers/${id}`, body);
    return data;
  } catch (error) {
    console.log('updateDriver', `PUT /drivers/${id}`, 'Error:', error);
    console.log('updateDriver', 'Error response:', error?.response?.data);
    console.log('updateDriver', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteDriver(id) {
  try {
    const { data } = await apiClient.delete(`/drivers/${id}`);
    return data;
  } catch (error) {
    console.log('deleteDriver', `DELETE /drivers/${id}`, 'Error:', error);
    console.log('deleteDriver', 'Error response:', error?.response?.data);
    console.log('deleteDriver', 'Error message:', error?.message);
    throw error;
  }
}
