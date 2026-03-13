import { apiClient } from './client.js';

function toApiDate(dateValue) {
  if (!dateValue) return '';
  const parts = String(dateValue).split('-');
  if (parts.length !== 3) return dateValue;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export async function getAllBookings(filters = {}, page = 1, limit = 10) {
  const {
    name = '',
    contact = '',
    from_date = '',
    to_date = '',
  } = filters;

  const hasSearchFilters = Boolean(
    name.trim() || contact.trim() || from_date.trim() || to_date.trim()
  );
  const endpoint = hasSearchFilters ? '/bookings/filter' : '/bookings';
  const params = { page, limit };
  if (name.trim()) params.name = name.trim();
  if (contact.trim()) params.contact = contact.trim();
  if (from_date.trim()) params.from_date = toApiDate(from_date.trim());
  if (to_date.trim()) params.to_date = toApiDate(to_date.trim());

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
