import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './BookingTrendsChart.module.scss';

const CHART_COLOR = '#1ba9a5';

function BookingTrendsChart({ data = [] }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Booking Trends (Lifetime)</h3>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
              }}
              formatter={(value) => [value, 'Bookings']}
            />
            <Bar dataKey="bookings" fill={CHART_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BookingTrendsChart;
