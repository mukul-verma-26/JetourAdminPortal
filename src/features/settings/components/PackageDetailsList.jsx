import { FiTrash2 } from 'react-icons/fi';
import styles from './PackageDetailsList.module.scss';

function PackageDetailsList({ items, onChange }) {
  const handleAdd = () => {
    const newItem = {
      id: `detail-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      label: '',
      checked: true,
    };
    onChange([...items, newItem]);
  };

  const handleToggle = (id) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleLabelChange = (id, label) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, label } : item))
    );
  };

  const handleRemove = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.row}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
                className={styles.checkbox}
                aria-label={`Include ${item.label || 'detail'}`}
              />
              <input
                type="text"
                className={styles.input}
                placeholder="Detail description"
                value={item.label}
                onChange={(e) => handleLabelChange(item.id, e.target.value)}
                aria-label="Detail description"
              />
            </label>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemove(item.id)}
              aria-label="Remove detail"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={styles.addBtn}
        onClick={handleAdd}
      >
        Package details
      </button>
    </div>
  );
}

export default PackageDetailsList;
