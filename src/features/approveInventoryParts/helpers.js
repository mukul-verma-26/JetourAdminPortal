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
  if (!dateStr || dateStr === 'pending') return 'Pending';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Pending';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * @param {string} technicianId - trimmed match is substring of technician.id (case-insensitive)
 * @param {string} status - 'all' or pending | approved | rejected
 */
export function filterInventoryPartRequests(requests, { technicianId, status }) {
  let list = requests;
  const tech = String(technicianId ?? '').trim().toLowerCase();
  if (tech) {
    list = list.filter((request) =>
      String(request.technician?.id ?? '')
        .toLowerCase()
        .includes(tech)
    );
  }
  if (status && status !== 'all') {
    list = list.filter((request) => request.status === status);
  }
  return list;
}

/**
 * Maps one row from GET /inventory_item/all-request into the shape used by the table.
 * Rows can share the same request_id; index keeps React keys and local updates unique.
 */
export function mapInventoryRequestFromApi(item, index) {
  const tech = item?.technician && typeof item.technician === 'object' ? item.technician : {};
  const rawDecision = item?.approve_reject_date;
  const decisionDate =
    rawDecision === 'pending' || rawDecision == null || rawDecision === ''
      ? null
      : rawDecision;
  const techRawId = tech.technicianId ?? tech._id ?? tech.id;
  const technicianIdForApi =
    techRawId != null && String(techRawId).trim() !== ''
      ? String(techRawId)
      : item?.technician_id != null && String(item.technician_id).trim() !== ''
        ? String(item.technician_id)
        : '';

  return {
    id: `${item?.request_id ?? 'req'}-${index}`,
    requestId: item?.request_id ?? '',
    itemId: item?.item_id ?? '',
    technicianId: technicianIdForApi,
    technician: {
      id:
        tech.id != null && String(tech.id).trim() !== ''
          ? String(tech.id)
          : tech._id != null && String(tech._id).trim() !== ''
            ? String(tech._id)
            : '—',
      name: tech.name != null && tech.name !== '' ? String(tech.name) : '—',
    },
    partName: item?.part != null && item.part !== '' ? String(item.part) : '—',
    requestedQty: item?.requested_qty ?? 0,
    companyQty: item?.company_qty ?? 0,
    requestDate: item?.request_date ?? null,
    decisionDate,
    status: item?.status ?? 'pending',
  };
}
