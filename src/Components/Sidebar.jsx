import { useState, useEffect } from "react";

/* MUI COMPONENTS */
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

/* MUI ICONS - FIXED IMPORTS */
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import VerifiedIcon from "@mui/icons-material/Verified";  // ✅ FIXED: Correct path

const drawerWidth = 240;

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  p: 2,
  cursor: "pointer",
  borderRadius: 1,
  "&:hover": {
    backgroundColor: "#245f52",
  },
};

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("Dashboard");

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <>
      <GlobalStyles styles={{
        body: { overflowX: 'hidden' },
        html: { overflowX: 'hidden' },
        '*': { boxSizing: 'border-box' }
      }} />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* ================= TOPBAR ================= */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#1a3d35",
            marginLeft: open ? `${drawerWidth}px` : 0,
            width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
            transition: "0.3s",
          }}
        >
          <Toolbar>
            <IconButton color="inherit" onClick={() => setOpen(!open)}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ ml: 1 }}>
              Training Dashboard
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>

            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* ================= SIDEBAR ================= */}
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#1a3d35",
              color: "white",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ textAlign: "center", py: 2, fontWeight: "bold", fontSize: "20px", letterSpacing: 1 }}>
            Training Institute
          </Box>

          <Box sx={{ p: 1 }}>
            <Box sx={menuItemStyle} onClick={() => {setPage("Dashboard"); setOpen(false);}}>
              <DashboardIcon />
              <Typography>Dashboard</Typography>
            </Box>

            <Box sx={menuItemStyle} onClick={() => {setPage("Course"); setOpen(false);}}>
              <SchoolIcon />
              <Typography>Course Enrollment Metrics</Typography>
            </Box>

            <Box sx={menuItemStyle} onClick={() => {setPage("Placement"); setOpen(false);}}>
              <VerifiedIcon />
              <Typography>Placement Success Rate</Typography>
            </Box>

            <Box sx={menuItemStyle} onClick={() => {setPage("Trainer"); setOpen(false);}}>
              <PeopleIcon />
              <Typography>Trainers Performance</Typography>
            </Box>

            <Box sx={menuItemStyle} onClick={() => {setPage("Certification"); setOpen(false);}}>
              <CardMembershipIcon />
              <Typography>Certification Issuance</Typography>
            </Box>

            <Box sx={menuItemStyle} onClick={() => {setPage("Industry"); setOpen(false);}}>
              <WorkIcon />
              <Typography>Industry Partnership Tracker</Typography>
            </Box>
          </Box>
        </Drawer>

        {/* ================= MAIN CONTENT ================= */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: open ? `${drawerWidth}px` : 0,
            marginTop: '64px',
            transition: "0.3s",
            width: '100%',
            overflowX: 'hidden',
            backgroundColor: '#f7fff7'
          }}
        >
          <Toolbar />

          {page === "Dashboard" && <DashboardContent />}
          {page === "Course" && <Typography variant="h4" sx={{color: '#1a3d35'}}>Course Enrollment Metrics</Typography>}
          {page === "Placement" && <Typography variant="h4" sx={{color: '#1a3d35'}}>Placement Success Rate</Typography>}
          {page === "Trainer" && <Typography variant="h4" sx={{color: '#1a3d35'}}>Trainers Performance</Typography>}
          {page === "Certification" && <Typography variant="h4" sx={{color: '#1a3d35'}}>Certification Issuance</Typography>}
          {page === "Industry" && <Typography variant="h4" sx={{color: '#1a3d35'}}>Industry Partnership Tracker</Typography>}
        </Box>
      </Box>
    </>
  );
}

// ✅ Complete DashboardContent with no external dependencies
function DashboardContent() {
  const enrollmentData = [
    { month: 'Jan', enrollments: 120 },
    { month: 'Feb', enrollments: 135 },
    { month: 'Mar', enrollments: 150 },
    { month: 'Apr', elevations: 142 },
    { month: 'May', enrollments: 156 }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1a3d35' }}>
        Training Institutes Dashboard
      </Typography>
      
      {/* Stats Cards - Matches your screenshot */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{color: '#666', mb: 1}}>Total Students</Typography>
          <Typography variant="h2" sx={{color: '#1a3d35', fontWeight: 'bold'}}>1,245</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{color: '#666', mb: 1}}>New Enrollments</Typography>
          <Typography variant="h2" sx={{color: '#4caf50', fontWeight: 'bold'}}>156</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{color: '#666', mb: 1}}>Placement Rate</Typography>
          <Typography variant="h2" sx={{color: '#4caf50', fontWeight: 'bold'}}>92%</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{color: '#666', mb: 1}}>Attendance</Typography>
          <Typography variant="h2" sx={{color: '#4caf50', fontWeight: 'bold'}}>95%</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{color: '#666', mb: 1}}>Active Trainers</Typography>
          <Typography variant="h2" sx={{color: '#1a3d35', fontWeight: 'bold'}}>28</Typography>
        </Box>
      </Box>

      {/* Chart Container - No scroll */}
      <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom sx={{color: '#1a3d35'}}>
          Enrollment Trend
        </Typography>
        <div style={{ 
          width: '100%', 
          height: 300, 
          overflowX: 'hidden',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#666',
            fontSize: '18px'
          }}>
            📊 Chart Ready - Install recharts for bar chart visualization
          </Box>
        </div>
      </Box>
    </Box>
  );
}

