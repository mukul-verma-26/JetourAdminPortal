import { useMemo, useState, useCallback } from 'react';
import { INVENTORY_PART_APPROVALS } from './constants';
import { filterRequests, getRequestStats } from './helpers';

function sortByRequestDate(requests) {
  return [...requests].sort(
    (a, b) => new Date(b.requestDate || 0) - new Date(a.requestDate || 0)
  );
}

export function useApproveInventoryParts() {
  const [requests, setRequests] = useState(() =>
    sortByRequestDate(INVENTORY_PART_APPROVALS)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const displayedRequests = useMemo(
    () => filterRequests(requests, searchQuery, statusFilter),
    [requests, searchQuery, statusFilter]
  );

  const stats = useMemo(() => getRequestStats(requests), [requests]);

  const updateRequestStatus = useCallback((partId, nextStatus) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === partId
          ? {
              ...request,
              status: nextStatus,
              decisionDate: new Date().toISOString(),
            }
          : request
      )
    );
  }, []);

  return {
    requests: displayedRequests,
    stats,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    approveRequest: (requestId) => updateRequestStatus(requestId, 'approved'),
    rejectRequest: (requestId) => updateRequestStatus(requestId, 'rejected'),
  };
}
