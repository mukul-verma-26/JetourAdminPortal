import {
  formatDecisionDate,
  formatRequestDate,
} from '../helpers';
import RequestRowActions from './RequestRowActions';
import styles from '../ApproveInventoryPartsScreen.module.scss';

const STATUS_CLASS_MAP = {
  pending: styles.statusPending,
  approved: styles.statusApproved,
  rejected: styles.statusRejected,
};

function RequestsTable({ requests, onApprove, onReject, onDelete }) {
  if (requests.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No requests match your filters.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Technician</th>
            <th className={styles.th}>Part</th>
            <th className={styles.th}>Requested Qty</th>
            <th className={styles.th}>Company Qty</th>
            <th className={styles.th}>Request Date</th>
            <th className={styles.th}>Approve/Reject Date</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className={styles.tr}>
              <td className={styles.td} data-label="Technician">
                <p className={styles.techName}>{request.technician.name}</p>
                <p className={styles.techId}>ID: {request.technician.id}</p>
              </td>
              <td className={styles.td} data-label="Part">
                <span className={styles.partName}>{request.partName}</span>
              </td>
              <td className={styles.td} data-label="Requested Qty">
                {request.requestedQty}
              </td>
              <td className={styles.td} data-label="Company Qty">
                {request.companyQty}
              </td>
              <td className={styles.td} data-label="Request Date">
                {formatRequestDate(request.requestDate)}
              </td>
              <td className={styles.td} data-label="Approve/Reject Date">
                {formatDecisionDate(request.decisionDate)}
              </td>
              <td className={styles.td} data-label="Status">
                <span className={`${styles.statusBadge} ${STATUS_CLASS_MAP[request.status]}`}>
                  {request.status}
                </span>
              </td>
              <td className={styles.td} data-label="Actions">
                <RequestRowActions
                  request={request}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RequestsTable;
