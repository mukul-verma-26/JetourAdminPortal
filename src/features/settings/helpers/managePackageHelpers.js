/**
 * Transforms API pricing + vehicles to table format.
 * Vehicles define columns; pricing fills the cells.
 * API pricing: [{ mileage, vehicles: [{ vehicle_Id, vehicle_model, price }] }]
 * Vehicles API: [{ _id, vehicle_id, vehicle_model }]
 * Table: { rows: [{ mileage, prices: { [vehicle_Id]: price } }], vehicleColumns: [{ id, name }] }
 */
export function transformToTableFormat(vehicles, pricing) {
  const vehicleList = Array.isArray(vehicles) ? vehicles : [];
  const vehicleColumns = vehicleList.map((v) => ({
    id: v.vehicle_Id || v.vehicle_id || v._id || v.id,
    name: (v.vehicle_model || v.modelName || v.name || String(v.id || '')).trim() || 'Unknown',
  })).filter((v) => v.id);

  const pricingList = Array.isArray(pricing) ? pricing : [];
  const mileageMap = new Map();
  pricingList.forEach((item) => {
    const mileage = item.mileage ?? '';
    const prices = {};
    vehicleColumns.forEach((col) => { prices[col.id] = ''; });
    (item.vehicles || []).forEach((v) => {
      const vid = v.vehicle_Id || v.vehicle_id || v._id || v.id;
      if (vid) prices[vid] = v.price ?? '';
    });
    mileageMap.set(mileage, prices);
  });

  const rows = mileageMap.size > 0
    ? Array.from(mileageMap.entries()).map(([mileage, prices]) => ({ mileage, prices }))
    : [{ mileage: '', prices: Object.fromEntries(vehicleColumns.map((c) => [c.id, ''])) }];

  return { rows, vehicleColumns };
}

/**
 * Builds API update payload from table rows.
 * Payload: { pricing: [{ mileage, vehicles: [{ vehicle_Id, price }] }] }
 * Only includes vehicles with non-empty price.
 */
export function buildPricingPayload(rows, vehicleColumns) {
  const cols = Array.isArray(vehicleColumns) ? vehicleColumns : [];
  return {
    pricing: rows.map((row) => {
      const vehicles = cols
        .map((col) => {
          const price = row.prices?.[col.id];
          const num = parseFloat(String(price || '').trim(), 10);
          if (Number.isNaN(num) || num < 0) return null;
          return { vehicle_Id: col.id, price: num };
        })
        .filter(Boolean);
      return {
        mileage: parseInt(String(row.mileage || '0').replace(/\D/g, ''), 10) || 0,
        vehicles,
      };
    }).filter((p) => p.mileage > 0 || p.vehicles.length > 0),
  };
}
