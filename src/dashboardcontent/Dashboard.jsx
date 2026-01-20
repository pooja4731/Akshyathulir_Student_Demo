
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Sample data matching screenshot (replace with your real data)
const enrollmentData = [
  { month: 'Jan', enrollments: 120 },
  { month: 'Feb', enrollments: 135 },
  { month: 'Mar', enrollments: 150 },
  { month: 'Apr', enrollments: 142 },
  { month: 'May', enrollments: 156 }
];

function EnrollmentTrendChart() {
  return (
    <div style={{ width: '100%', height: 300, overflowX: 'hidden' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={enrollmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="enrollments" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Include this in your Dashboard component JSX
