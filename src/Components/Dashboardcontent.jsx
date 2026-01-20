import { useState, useEffect } from "react";
/* MUI */
import {
  AppBar,
  Toolbar,
  Drawer,
  Box,
  Typography,
  IconButton,
  CssBaseline,
  GlobalStyles
} from "@mui/material";

/* ICONS */
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

/* PAGES */
import Dashboard from "../dashboardcontent/Dashboard.jsx";
import CourseForm from "../dashboardcontent/Course.jsx";
import TrainerForm from "../dashboardcontent/Trainer.jsx";
import PlacementForm from "../dashboardcontent/Placement.jsx";
import CertificationForm from "../dashboardcontent/Certificate.jsx";
import IndustryForm from "../dashboardcontent/Industry.jsx";

const drawerWidth = 240;

export default function DashboardContent() {
  const enrollmentData = [
    { month: 'Jan', enrollments: 120 },
    { month: 'Feb', enrollments: 135 },
    { month: 'Mar', enrollments: 150 },
    { month: 'Apr', enrollments: 142 },
    { month: 'May', enrollments: 156 }
  ];

  return (
    <Box sx={{ maxWidth: '1400px' }}>
      {/* HEADER */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          color: '#1a3d35',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}
      >
        Training Institutes Dashboard
      </Typography>
      
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: 3, 
        mb: 5 
      }}>
        <MetricCard 
          title="Total Students" 
          value="1,245" 
          color="#1a3d35"
          icon="👨‍🎓"
        />
        <MetricCard 
          title="New Enrollments" 
          value="156" 
          color="#4caf50"
          icon="➕"
        />
        <MetricCard 
          title="Placement Rate" 
          value="92%" 
          color="#4caf50"
          icon="✅"
        />
        <MetricCard 
          title="Attendance" 
          value="95%" 
          color="#4caf50"
          icon="📊"
        />
        <MetricCard 
          title="Active Trainers" 
          value="28" 
          color="#1a3d35"
          icon="👨‍🏫"
        />
      </Box>

      {/* CHARTS ROW */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        {/* ENROLLMENT TREND CHART */}
        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#1a3d35', fontWeight: 600 }}>
            📈 Enrollment Trend
          </Typography>
          <Box sx={{ height: 280, width: '100%', overflowX: 'hidden' }}>
            <EnrollmentTrendChart data={enrollmentData} />
          </Box>
        </Box>

        {/* PLACEMENT SUCCESS CHART */}
        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#1a3d35', fontWeight: 600 }}>
            🎯 Placement Success
          </Typography>
          <PlacementSuccessChart />
        </Box>
      </Box>

      {/* RECENT ACTIVITY TABLE */}
      <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#1a3d35', fontWeight: 600 }}>
          📋 Recent Activity
        </Typography>
        <RecentActivityTable />
      </Box>
    </Box>
  );
}

// METRIC CARD COMPONENT
function MetricCard({ title, value, color, icon }) {
  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: 'white', 
      borderRadius: 3, 
      boxShadow: 3, 
      textAlign: 'center',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)' }
    }}>
      <Box sx={{ fontSize: '2.5rem', mb: 1 }}>{icon}</Box>
      <Typography variant="h6" sx={{ color: '#666', mb: 1, fontSize: '0.9rem' }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{ color, fontWeight: 800, fontSize: '2.2rem' }}>
        {value}
      </Typography>
    </Box>
  );
}

// ENROLLMENT TREND CHART 
function EnrollmentTrendChart({ data }) {
  return (
    <Box sx={{ 
      height: '100%', 
      position: 'relative',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: 2,
      p: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: '80%', mb: 2 }}>
        {data.map((item, idx) => (
          <Box key={idx} sx={{ 
            flex: 1, 
            mx: 0.5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            position: 'relative'
          }}>
            <Box sx={{ 
              width: 20, 
              height: `${(item.enrollments / 160) * 100}%`, 
              background: `linear-gradient(180deg, #4caf50 0%, #45a049 100%)`,
              borderRadius: '10px 10px 0 0',
              mx: 'auto',
              position: 'relative',
              mb: 1,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 6,
                height: 6,
                bgcolor: '#4caf50',
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(76, 175, 80, 0.5)'
              }
            }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#555', fontWeight: 500 }}>
              {item.month}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
              {item.enrollments}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
        Monthly enrollment growth trend
      </Box>
    </Box>
  );
}

// PLACEMENT SUCCESS CHART 
function PlacementSuccessChart() {
  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ 
        display: 'flex', 
        height: '70%', 
        alignItems: 'end', 
        justifyContent: 'space-around',
        mt: 2
      }}>
        <Box sx={{ width: 50, height: '85%', bgcolor: '#4caf50', borderRadius: 3, mx: 1 }} />
        <Box sx={{ width: 50, height: '15%', bgcolor: '#ff9800', borderRadius: 3, mx: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 600, color: '#1a3d35' }}>Placed</Typography>
          <Typography sx={{ fontSize: '1.1rem', color: '#4caf50' }}>92%</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 600, color: '#1a3d35' }}>Pending</Typography>
          <Typography sx={{ fontSize: '1.1rem', color: '#ff9800' }}>8%</Typography>
        </Box>
      </Box>
    </Box>
  );
}

// RECENT ACTIVITY TABLE
function RecentActivityTable() {
  const activities = [
    { id: 1, student: 'Ravi Kumar', action: 'Enrolled in Web Dev', date: 'Today 2:30 PM', status: 'success' },
    { id: 2, student: 'Priya S', action: 'Placement Confirmed', date: 'Today 1:15 PM', status: 'success' },
    { id: 3, student: 'Arun M', action: 'Course Completed', date: 'Yesterday', status: 'primary' },
    { id: 4, student: 'Sneha R', action: 'Attendance Marked', date: 'Today 10:00 AM', status: 'info' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>Showing last 10 activities</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#4caf50', cursor: 'pointer' }}>View All →</Typography>
      </Box>
      {activities.map((activity) => (
        <Box key={activity.id} sx={{ 
          display: 'flex', 
          p: 2, 
          borderBottom: '1px solid #eee',
          '&:hover': { bgcolor: '#f8f9fa' }
        }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: 2, 
            bgcolor: activity.status === 'success' ? '#4caf50' : '#2196f3',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.1rem',
            mr: 2
          }}>
            {activity.status === 'success' ? '✅' : '📘'}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, color: '#1a3d35', mb: 0.5 }}>
              {activity.student}
            </Typography>
            <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
              {activity.action}
            </Typography>
          </Box>
          <Typography sx={{ color: '#888', fontSize: '0.85rem', minWidth: 100 }}>
            {activity.date}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
