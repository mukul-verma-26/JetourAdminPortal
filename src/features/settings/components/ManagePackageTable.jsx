import { VEHICLE_MODELS, createEmptyPricingRow } from '../constants';
import styles from './ManagePackageTable.module.scss';

function createEmptyRowForVehicles(vehicleColumns) {
  const prices = {};
  vehicleColumns.forEach((col) => {
    const id = typeof col === 'object' ? col.id : col;
    prices[id] = '';
  });
  return { mileage: '', prices };
}

function normalizeVehicleColumns(vehicleColumnsProp) {
  if (vehicleColumnsProp?.length) {
    return vehicleColumnsProp.map((col) =>
      typeof col === 'object' ? col : { id: col, name: col }
    );
  }
  return VEHICLE_MODELS.map((v) => ({ id: v.id, name: v.name }));
}

function ManagePackageTable({ rows, onRowsChange, onAddRow, vehicleColumns: vehicleColumnsProp }) {
  const vehicleColumns = normalizeVehicleColumns(vehicleColumnsProp);
  const handleMileageChange = (rowIndex, value) => {
    const cleaned = value.replace(/[^\d]/g, '');
    onRowsChange(
      rows.map((row, i) =>
        i === rowIndex ? { ...row, mileage: cleaned } : row
      )
    );
  };

  const handlePriceChange = (rowIndex, vehicleId, value) => {
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    onRowsChange(
      rows.map((row, i) =>
        i === rowIndex
          ? { ...row, prices: { ...row.prices, [vehicleId]: sanitized } }
          : row
      )
    );
  };

  const handleRemoveRow = (rowIndex) => {
    if (rows.length <= 1) return;
    onRowsChange(rows.filter((_, i) => i !== rowIndex));
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.mileageCol}>Mileage</th>
            {vehicleColumns.map((col) => (
              <th key={col.id} className={styles.priceCol}>
                {col.name}
              </th>
            ))}
            <th className={styles.actionsCol} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className={styles.mileageCol}>
                <input
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  placeholder="e.g. 10000"
                  value={row.mileage}
                  onChange={(e) => handleMileageChange(rowIndex, e.target.value)}
                  aria-label={`Mileage row ${rowIndex + 1}`}
                />
              </td>
              {vehicleColumns.map((col) => (
                <td key={col.id} className={styles.priceCol}>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={styles.input}
                    placeholder="0.00"
                    value={row.prices?.[col.id] ?? ''}
                    onChange={(e) =>
                      handlePriceChange(rowIndex, col.id, e.target.value)
                    }
                    aria-label={`Price for ${col.name} row ${rowIndex + 1}`}
                  />
                </td>
              ))}
              <td className={styles.actionsCol}>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveRow(rowIndex)}
                  disabled={rows.length <= 1}
                  aria-label={`Remove row ${rowIndex + 1}`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className={styles.addRowBtn}
        onClick={() => onAddRow(vehicleColumns.length ? createEmptyRowForVehicles(vehicleColumns) : createEmptyPricingRow())}
      >
        Add new row
      </button>
    </div>
  );
}

export default ManagePackageTable;
