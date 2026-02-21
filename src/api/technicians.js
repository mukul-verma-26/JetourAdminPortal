import { apiClient } from './client.js';

export async function getTechnicians() {
  try {
    const { data } = await apiClient.get('/technicians');
    return data;
  } catch (error) {
    console.log('getTechnicians', 'GET /technicians', 'Error:', error);
    console.log('getTechnicians', 'Error response:', error?.response?.data);
    console.log('getTechnicians', 'Error message:', error?.message);
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

export async function createTechnician(payload) {
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
    const { data } = await apiClient.post('/technicians', body);
    return data;
  } catch (error) {
    console.log('createTechnician', 'POST /technicians', 'Error:', error);
    console.log('createTechnician', 'Error response:', error?.response?.data);
    console.log('createTechnician', 'Error message:', error?.message);
    throw error;
  }
}

export async function updateTechnician(id, payload) {
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
    const { data } = await apiClient.put(`/technicians/${id}`, body);
    return data;
  } catch (error) {
    console.log('updateTechnician', `PUT /technicians/${id}`, 'Error:', error);
    console.log('updateTechnician', 'Error response:', error?.response?.data);
    console.log('updateTechnician', 'Error message:', error?.message);
    throw error;
  }
}

export async function deleteTechnician(id) {
  try {
    const { data } = await apiClient.delete(`/technicians/${id}`);
    return data;
  } catch (error) {
    console.log('deleteTechnician', `DELETE /technicians/${id}`, 'Error:', error);
    console.log('deleteTechnician', 'Error response:', error?.response?.data);
    console.log('deleteTechnician', 'Error message:', error?.message);
    throw error;
  }
}
