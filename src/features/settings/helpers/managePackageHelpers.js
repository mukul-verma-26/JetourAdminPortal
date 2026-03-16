/**
 * Transforms API pricing + vehicles to table format.
 * Uses pricing as primary source so Manage Package pre-fills exactly what API returns.
 * Supports both legacy and new vehicle keys: vehicle_Id / vehicle_id / _id / id.
 */
export function transformToTableFormat(vehicles, pricing) {
  const getVehicleId = (vehicle) =>
    vehicle?.vehicle_Id || vehicle?.vehicle_id || vehicle?._id || vehicle?.id;
  const getVehicleName = (vehicle, fallbackId = '') =>
    (vehicle?.vehicle_model || vehicle?.modelName || vehicle?.name || String(fallbackId)).trim() || 'Unknown';

  const registerColumn = (columnsMap, aliasMap, id, name, aliases = []) => {
    if (!id) return;
    const canonicalId = String(id);
    if (!columnsMap.has(canonicalId)) {
      columnsMap.set(canonicalId, { id: canonicalId, name: getVehicleName({ name }, canonicalId) });
    }
    [canonicalId, ...aliases]
      .filter(Boolean)
      .forEach((alias) => {
        aliasMap.set(String(alias), canonicalId);
      });
  };

  const pricingList = Array.isArray(pricing) ? pricing : [];
  const vehicleList = Array.isArray(vehicles) ? vehicles : [];
  const columnsMap = new Map();
  const aliasToCanonicalId = new Map();

  pricingList.forEach((item) => {
    (item?.vehicles || []).forEach((vehicle) => {
      const id = getVehicleId(vehicle);
      registerColumn(columnsMap, aliasToCanonicalId, id, getVehicleName(vehicle, id));
    });
  });

  vehicleList.forEach((vehicle) => {
    const primaryId = vehicle?.id || vehicle?.vehicle_id || vehicle?.vehicle_Id || vehicle?._id;
    registerColumn(
      columnsMap,
      aliasToCanonicalId,
      primaryId,
      getVehicleName(vehicle, primaryId),
      [vehicle?._id, vehicle?.id, vehicle?.vehicle_id, vehicle?.vehicle_Id]
    );
  });

  const vehicleColumns = Array.from(columnsMap.values());
  const mileageMap = new Map();
  pricingList.forEach((item) => {
    const mileage = item.mileage ?? '';
    const prices = {};
    vehicleColumns.forEach((col) => { prices[col.id] = ''; });
    (item?.vehicles || []).forEach((vehicle) => {
      const rawId = getVehicleId(vehicle);
      if (!rawId) return;
      const canonicalId = aliasToCanonicalId.get(String(rawId)) || String(rawId);
      if (canonicalId in prices) {
        prices[canonicalId] = vehicle?.price ?? '';
      }
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
 * Payload: { pricing: [{ mileage, vehicles: [{ id|vehicle_Id, name, price }] }] }
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
          return {
            id: col.id,
            vehicle_Id: col.id,
            name: col.name || '',
            price: num,
          };
        })
        .filter(Boolean);
      return {
        mileage: parseInt(String(row.mileage || '0').replace(/\D/g, ''), 10) || 0,
        vehicles,
      };
    }).filter((p) => p.mileage > 0 || p.vehicles.length > 0),
  };
}
