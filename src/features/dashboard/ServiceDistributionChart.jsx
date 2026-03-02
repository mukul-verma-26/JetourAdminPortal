import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './ServiceDistributionChart.module.scss';

function ServiceDistributionChart({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Service Distribution</h3>
      <div className={styles.chartWrap}>
        {!hasData ? (
          <p className={styles.empty}>No service distribution data.</p>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, 'Share']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>
      <div className={styles.legend}>
        {data.map((item) => (
          <div key={`${item.name}-${item.value}`} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: item.color }}
              aria-hidden
            />
            <span>{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceDistributionChart;
