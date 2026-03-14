export function formatRequestDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDecisionDate(dateStr) {
  if (!dateStr) return 'Pending';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function filterRequests(requests, query, status) {
  const trimmedQuery = query.trim().toLowerCase();
  return requests.filter((request) => {
    const matchStatus = status === 'all' || request.status === status;
    if (!matchStatus) return false;
    if (!trimmedQuery) return true;
    const technician = request.technician || {};
    return (
      request.id.toLowerCase().includes(trimmedQuery) ||
      request.requestId.toLowerCase().includes(trimmedQuery) ||
      request.partName.toLowerCase().includes(trimmedQuery) ||
      technician.id.toLowerCase().includes(trimmedQuery) ||
      technician.name.toLowerCase().includes(trimmedQuery)
    );
  });
}

export function getRequestStats(requests) {
  return requests.reduce(
    (stats, request) => {
      stats.total += 1;
      stats[request.status] += 1;
      return stats;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 }
  );
}
