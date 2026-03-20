import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  approveInventoryPartRequest,
  deleteInventoryPartRequest,
  getAllInventoryPartRequests,
  rejectInventoryPartRequest,
} from '../../api/inventory';
import {
  filterInventoryPartRequests,
  mapInventoryRequestFromApi,
} from './helpers';
import { INVENTORY_REQUESTS_PAGE_SIZE } from './constants';

function notifyToast(message, type) {
  if (typeof window?.showToast === 'function') {
    window.showToast(message, type);
  }
}

function sortByRequestDate(requests) {
  return [...requests].sort(
    (a, b) => new Date(b.requestDate || 0) - new Date(a.requestDate || 0)
  );
}

export function useApproveInventoryParts() {
  const isMountedRef = useRef(true);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    count: 0,
    limit: INVENTORY_REQUESTS_PAGE_SIZE,
  });
  const [draftTechnicianId, setDraftTechnicianId] = useState('');
  const [draftStatus, setDraftStatus] = useState('all');
  const [appliedTechnicianId, setAppliedTechnicianId] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('all');

  const loadRequests = useCallback(async (nextPage = 1, filters = {}) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await getAllInventoryPartRequests(nextPage, pagination.limit, filters);
      if (!isMountedRef.current) return;
      const list = Array.isArray(res?.data) ? res.data : [];
      const mapped = list.map((item, index) => mapInventoryRequestFromApi(item, index));
      setRequests(sortByRequestDate(mapped));
      setPagination((prev) => ({
        ...prev,
        page: Number(res?.currentPage) || nextPage,
        totalPages: Number(res?.totalPages) || 1,
        total: Number(res?.total) || mapped.length,
        count: Number(res?.count) || mapped.length,
      }));
    } catch (error) {
      if (!isMountedRef.current) return;
      console.log(
        'useApproveInventoryParts',
        'loadRequests all-request',
        { page: nextPage, filters },
        error
      );
      setFetchError('Could not load part requests. Please try again.');
      setRequests([]);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    isMountedRef.current = true;
    loadRequests(1, { technicianId: '', status: 'all' });
    return () => {
      isMountedRef.current = false;
    };
  }, [loadRequests]);

  const applyFilters = useCallback(() => {
    const nextTechnicianId = draftTechnicianId.trim();
    const nextStatus = draftStatus;
    setAppliedTechnicianId(nextTechnicianId);
    setAppliedStatus(nextStatus);
    loadRequests(1, { technicianId: nextTechnicianId, status: nextStatus });
  }, [draftTechnicianId, draftStatus, loadRequests]);

  const clearFilters = useCallback(() => {
    setDraftTechnicianId('');
    setDraftStatus('all');
    setAppliedTechnicianId('');
    setAppliedStatus('all');
    loadRequests(1, { technicianId: '', status: 'all' });
  }, [loadRequests]);

  const filtersActive =
    appliedTechnicianId.trim() !== '' || appliedStatus !== 'all';

  const displayedRequests = useMemo(
    () =>
      filterInventoryPartRequests(requests, {
        technicianId: appliedTechnicianId,
        status: appliedStatus,
      }),
    [requests, appliedTechnicianId, appliedStatus]
  );

  const goToPage = useCallback(async (nextPage) => {
    const safePage = Number(nextPage);
    if (!Number.isFinite(safePage) || safePage < 1 || safePage > pagination.totalPages) return;
    await loadRequests(safePage, {
      technicianId: appliedTechnicianId,
      status: appliedStatus,
    });
  }, [appliedStatus, appliedTechnicianId, loadRequests, pagination.totalPages]);

  const approveRequest = useCallback(async (request) => {
    if (!request?.requestId || !request?.itemId || request.status !== 'pending') return;
    try {
      const data = await approveInventoryPartRequest(
        request.requestId,
        request.itemId,
        request.technicianId
      );
      console.log('useApproveInventoryParts', 'approve API response', data);
      if (data?.success === false) {
        notifyToast(data?.message || 'Could not approve this request.', 'error');
        return;
      }
      setRequests((prev) =>
        prev.map((r) =>
          r.itemId === request.itemId
            ? {
                ...r,
                status: 'approved',
                decisionDate: new Date().toISOString(),
              }
            : r
        )
      );
      notifyToast(data?.message || 'Request approved successfully.', 'success');
    } catch (error) {
      console.log(
        'useApproveInventoryParts',
        'approveRequest',
        { requestId: request.requestId, itemId: request.itemId, rowId: request.id },
        error
      );
      notifyToast(
        error?.response?.data?.message || 'Could not approve this request.',
        'error'
      );
    }
  }, []);

  const rejectRequest = useCallback(async (request) => {
    if (!request?.requestId || !request?.itemId || request.status !== 'pending') return;
    try {
      const data = await rejectInventoryPartRequest(
        request.requestId,
        request.itemId,
        request.technicianId
      );
      console.log('useApproveInventoryParts', 'reject API response', data);
      if (data?.success === false) {
        notifyToast(data?.message || 'Could not reject this request.', 'error');
        return;
      }
      setRequests((prev) =>
        prev.map((r) =>
          r.itemId === request.itemId
            ? {
                ...r,
                status: 'rejected',
                decisionDate: new Date().toISOString(),
              }
            : r
        )
      );
      notifyToast(data?.message || 'Request rejected successfully.', 'success');
    } catch (error) {
      console.log(
        'useApproveInventoryParts',
        'rejectRequest',
        { requestId: request.requestId, itemId: request.itemId, rowId: request.id },
        error
      );
      notifyToast(
        error?.response?.data?.message || 'Could not reject this request.',
        'error'
      );
    }
  }, []);

  const deleteRequest = useCallback(async (request) => {
    if (!request?.requestId || !request?.itemId) return;
    try {
      const data = await deleteInventoryPartRequest(
        request.requestId,
        request.itemId,
        request.technicianId
      );
      console.log('useApproveInventoryParts', 'delete API response', data);
      if (data?.success === false) {
        notifyToast(data?.message || 'Could not delete this request.', 'error');
        return;
      }
      const shouldMoveToPreviousPage = requests.length === 1 && pagination.page > 1;
      const nextPage = shouldMoveToPreviousPage ? pagination.page - 1 : pagination.page;
      await loadRequests(nextPage, {
        technicianId: appliedTechnicianId,
        status: appliedStatus,
      });
      notifyToast(data?.message || 'Request deleted successfully.', 'success');
    } catch (error) {
      console.log(
        'useApproveInventoryParts',
        'deleteRequest',
        { requestId: request.requestId, itemId: request.itemId, rowId: request.id },
        error
      );
      notifyToast(
        error?.response?.data?.message || 'Could not delete this request.',
        'error'
      );
    }
  }, [
    appliedStatus,
    appliedTechnicianId,
    loadRequests,
    pagination.page,
    requests.length,
  ]);

  return {
    requests: displayedRequests,
    pagination,
    goToPage,
    isLoading,
    fetchError,
    draftTechnicianId,
    setDraftTechnicianId,
    draftStatus,
    setDraftStatus,
    applyFilters,
    clearFilters,
    filtersActive,
    approveRequest,
    rejectRequest,
    deleteRequest,
  };
}
