function determineStockStatus(qty) {
  if (qty === 0) return 'out_of_stock';
  if (qty <= 10) return 'low_stock';
  return 'in_stock';
}

function mapApiItemToUi(item) {
  const id = item._id || item.id;
  const quantity = item.quantity ?? 0;
  return {
    id,
    itemId: id ? String(id).slice(-8) : '',
    name: item.name || '',
    qtyInStock: quantity,
    quantity,
    unitPrice: item.unit_price ?? 0,
    unit_price: item.unit_price ?? 0,
    partStatus: item.part_status || 'usable',
    part_status: item.part_status || 'usable',
    addedDate: item.created_at || item.addedDate,
    created_at: item.created_at,
    updated_at: item.updated_at,
    stockStatus: determineStockStatus(quantity),
  };
}

export { determineStockStatus, mapApiItemToUi };
