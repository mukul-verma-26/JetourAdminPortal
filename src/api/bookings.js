import axios from 'axios';
import { apiClient } from './client.js';
import { getAdminAuthToken } from '../features/adminAuth/helpers/authStorage';

const JETOUR_ADMIN_API_BASE = 'https://jetour-1.onrender.com/api/v1';

function toApiDate(dateValue) {
  if (!dateValue) return '';
  const parts = String(dateValue).split('-');
  if (parts.length !== 3) return dateValue;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function buildBookingFilterParams(filters = {}) {
  const {
    name = '',
    contact = '',
    from_date = '',
    to_date = '',
  } = filters;
  const params = {};
  if (name.trim()) params.name = name.trim();
  if (contact.trim()) params.contact = contact.trim();
  if (from_date.trim()) params.from_date = toApiDate(from_date.trim());
  if (to_date.trim()) params.to_date = toApiDate(to_date.trim());
  return params;
}

export async function getAllBookings(filters = {}, page = 1, limit = 10) {
  const filterParams = buildBookingFilterParams(filters);
  const hasSearchFilters = Object.keys(filterParams).length > 0;
  const endpoint = hasSearchFilters ? '/bookings/filter' : '/bookings';
  const params = {
    page,
    limit,
    ...filterParams,
  };

  try {
    const { data } = await apiClient.get(endpoint, {
      params,
    });
    return data;
  } catch (error) {
    const query = new URLSearchParams(params).toString();
    console.log('getAllBookings', `GET ${endpoint}?${query}`, error);
    throw error;
  }
}

export async function getBookingsForExport(filters = {}) {
  const params = buildBookingFilterParams(filters);
  const endpoint = '/bookings/filter';
  const query = new URLSearchParams(params).toString();

  try {
    const { data } = await apiClient.get(endpoint, { params });
    return data;
  } catch (error) {
    console.log('getBookingsForExport', `GET ${endpoint}?${query}`, error);
    throw error;
  }
}

export async function createCustomerBooking(payload) {
  try {
    const { data } = await apiClient.post('/bookings/admin', payload);
    return data;
  } catch (error) {
    console.log('createCustomerBooking', 'POST /bookings/admin', error);
    throw error;
  }
}

/**
 * Admin booking update (Render API).
 * PATCH https://jetour-1.onrender.com/api/v1/bookings/admin/:bookingId
 */
export async function patchAdminBooking(bookingId, body) {
  const url = `${JETOUR_ADMIN_API_BASE}/bookings/admin/${encodeURIComponent(String(bookingId))}`;
  const token = getAdminAuthToken();

  try {
    const { data } = await axios.patch(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return data;
  } catch (error) {
    console.log('patchAdminBooking', `PATCH ${url}`, error);
    throw error;
  }
}
