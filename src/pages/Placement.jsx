import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// InfoOutlinedIcon was removed because it's not used in this file
import Ads from "./ads";
import Api from "./api";
const EDU_COLORS = {
  primary: "#1a3e36",
  secondary: "#8db596",
  background: "#f1f8f4",
  accent: "#4caf50",
};

const initialAddress = {
  country: "",
  state: "",
  district: "",
  city: "",
  pinCode: "",
};

const Placements = () => {
  const eduCompanyData = [
    {
      id: 1,
      name: "TCS",
      role: "System Engineer",
      students: 157,
      package: "7.5 LPA",
      growth: "+8%",
    },
    {
      id: 2,
      name: "Infosys",
      role: "Power Programmer",
      students: 90,
      package: "9.0 LPA",
      growth: "+12%",
    },
    {
      id: 3,
      name: "Wipro",
      role: "Project Engineer",
      students: 70,
      package: "6.5 LPA",
      growth: "+5%",
    },
    {
      id: 4,
      name: "Cognizant",
      role: "Analyst",
      students: 50,
      package: "6.0 LPA",
      growth: "+10%",
    },
    {
      id: 5,
      name: "Accenture",
      role: "Associate Software Engineer",
      students: 102,
      package: "8.2 LPA",
      growth: "+15%",
    },
  ];

  /* eslint-disable-next-line no-unused-vars */
  const EduFormRow = ({ children }) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
      {React.Children.map(children, (child) => (
        <Box
          sx={{
            flex: 1,
            minWidth: "250px",
            display: "flex",
            alignItems: "flex-start",
            "& > *": { width: "100%" },
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );

  const eduToday = new Date().toISOString().split("T")[0];

  const eduDate = new Date();
  eduDate.setFullYear(eduDate.getFullYear() - 2);
  const eduTwoYearsAgo = eduDate.toISOString().split("T")[0];
  const [eduFormData, setEduFormData] = useState({
    startupName: "",
    legalStatus: "",
    dateOfEstablishment: "",
    primarySector: "",
    secondarySector: "",
    companyPAN: "",
    gstin: "",
    currentTeamSize: "",
    maleCount: "",
    femaleCount: "",
    companyWebsite: "",
    numberOfBranches: "1",
    branchAddresses: [{ ...initialAddress }],
  });

  const [eduErrors, setEduErrors] = useState({});
  const [, setLoading] = useState(false);

  const eduHandleBranchCountChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setEduFormData({
        ...eduFormData,
        numberOfBranches: "",
        branchAddresses: [],
      });

      setEduErrors((prev) => ({
        ...prev,
        numberOfBranches: "Number of branches is required",
      }));
      return;
    }

    let count = Number(value);

    if (isNaN(count) || count < 1) {
      return;
    }

    if (count > 20) {
      setEduErrors((prev) => ({
        ...prev,
        numberOfBranches: "Maximum allowed branches is 20",
      }));
      return;
    } else {
      setEduErrors((prev) => ({
        ...prev,
        numberOfBranches: "",
      }));
    }

    const updatedAddresses = [...eduFormData.branchAddresses];

    if (count > updatedAddresses.length) {
      for (let i = updatedAddresses.length; i < count; i++) {
        updatedAddresses.push({ ...initialAddress });
      }
    } else if (count < updatedAddresses.length) {
      updatedAddresses.length = count;
    }

    setEduFormData({
      ...eduFormData,
      numberOfBranches: value,
      branchAddresses: updatedAddresses,
    });
  };

  const eduHandleInputChange = (field) => (event) => {
    const value = event.target.value;

    // enforce letters-only for startup name
    if (field === "startupName") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        setEduErrors((prevErr) => ({
          ...prevErr,
          startupName: "Letters only",
        }));
        return;
      } else if (eduErrors.startupName) {
        setEduErrors((prevErr) => ({ ...prevErr, startupName: "" }));
      }
    }

    setEduFormData((prev) => {
      const updated = { ...prev, [field]: value };

      const teamSize = Number(updated.currentTeamSize || 0);
      const male = Number(updated.maleCount || 0);
      const female = Number(updated.femaleCount || 0);

      if (teamSize > 0 && male + female > teamSize) {
        setEduErrors((prevErr) => ({
          ...prevErr,
          maleCount: "Male + Female employees cannot exceed team size",
          femaleCount: "Male + Female employees cannot exceed team size",
        }));
      } else {
        setEduErrors((prevErr) => ({
          ...prevErr,
          maleCount: "",
          femaleCount: "",
        }));
      }

      return updated;
    });

    if (eduErrors[field]) {
      setEduErrors((prevErr) => ({ ...prevErr, [field]: "" }));
    }
  };

  /* eslint-disable-next-line no-unused-vars */
  const eduValidateForm = () => {
    let tempErrors = {};
    let isValid = true;

    const checkRequired = (field, label) => {
      if (!eduFormData[field]) {
        tempErrors[field] = `${label} is required`;
        isValid = false;
      }
    };

    checkRequired("firstName", "First Name");
    checkRequired("lastName", "Last Name");
    checkRequired("email", "Email");
    checkRequired("phone", "Phone");
    checkRequired("dateOfBirth", "DOB");
    checkRequired("gender", "Gender");
    checkRequired("designation", "Designation");

    checkRequired("startupName", "Startup Name");
    checkRequired("legalStatus", "Legal Status");
    checkRequired("dateOfEstablishment", "Date of Est.");
    checkRequired("primarySector", "Sector");
    checkRequired("companyPAN", "PAN");
    checkRequired("currentTeamSize", "Team Size");
    checkRequired("maleCount", "Male Count");
    checkRequired("femaleCount", "Female Count");
    checkRequired("numberOfBranches", "Branches");

    checkRequired("founderName", "Founder Name");
    checkRequired("founderEmail", "Founder Email");
    checkRequired("founderPhone", "Founder Phone");
    checkRequired("founderDOB", "Founder DOB");
    checkRequired("founderGender", "Founder Gender");

    if (eduFormData.dateOfEstablishment) {
      if (eduFormData.dateOfEstablishment < eduTwoYearsAgo) {
        tempErrors.dateOfEstablishment =
          "Startup must be less than 2 years old.";
        isValid = false;
      } else if (eduFormData.dateOfEstablishment > eduToday) {
        tempErrors.dateOfEstablishment = "Date cannot be in the future.";
        isValid = false;
      }
    }

    eduFormData.branchAddresses.forEach((addr, index) => {
      if (!addr.country) {
        tempErrors[`address_${index}_country`] = "Required";
        isValid = false;
      }
      if (!addr.state) {
        tempErrors[`address_${index}_state`] = "Required";
        isValid = false;
      }
      if (!addr.district) {
        tempErrors[`address_${index}_district`] = "Required";
        isValid = false;
      }
      if (!addr.city) {
        tempErrors[`address_${index}_city`] = "Required";
        isValid = false;
      }
      if (!addr.pinCode) {
        tempErrors[`address_${index}_pinCode`] = "Required";
        isValid = false;
      }
    });

    setEduErrors(tempErrors);
    return isValid;
  };

  const eduHandleSubmit = async () => {
    try {
      setLoading(true);

      await Api.post("/placements/", eduFormData);

      alert("✅ Certification Submitted Successfully!");

      // ✅ Clear form after submit
      setEduFormData(eduFormData);
    } catch (error) {
      console.log(error);
      alert("❌ Error while submitting certificate!");
    } finally {
      setLoading(false);
    }
  };

  const eduHandleReset = () => {
    setEduFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      linkedin: "",
      website: "",
      dateOfBirth: "",
      gender: "",
      designation: "",
      startupName: "",
      legalStatus: "",
      dateOfEstablishment: "",
      startupStage: "",
      primarySector: "",
      companyPAN: "",
      currentTeamSize: "",
      maleCount: "",
      femaleCount: "",
      gstin: "",
      companyWebsite: "",
      numberOfBranches: "1",
      branchAddresses: [{ ...initialAddress }],
      founderName: "",
      founderEmail: "",
      founderPhone: "",
      founderDOB: "",
      founderGender: "",
      founderLinkedIn: "",
      founderFacebook: "",
      fundingNeeded: "",
      mentorshipNeeded: "",
      technologySupport: "",
      incubationSpace: "",
      registrationNeeded: "",
      supportInterest: "",
      governmentSchemes: "",
    });
    setEduErrors({});
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: EDU_COLORS.background,
        minHeight: "100vh",
      }}
    >
      {/*header*/}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="800"
          color={EDU_COLORS.primary}
          sx={{
            letterSpacing: "-0.5px",
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Career Launchpad
        </Typography>
      </Box>
      {/* Placement Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              bgcolor: "#f1f8e9",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.06)",
                boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent>
              {/* Top Row */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Students Placed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    375
                  </Typography>
                </Box>

                <PeopleIcon sx={{ fontSize: 36, color: "success.main" }} />
              </Stack>

              {/* Subtext */}
              <Typography variant="caption" color="text.secondary">
                Out of 450 total students
              </Typography>

              {/* Progress */}
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "success.main",
                    },
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  82.0% Placement Rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              bgcolor: "#e3f2fd",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.06)",
                boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <BusinessIcon color="primary" />
                <Typography color="text.secondary">Top Companies</Typography>
              </Stack>

              <AvatarGroup max={5} sx={{ justifyContent: "center", mt: 2 }}>
                <Avatar sx={{ bgcolor: "#1976d2" }}>TCS</Avatar>
                <Avatar sx={{ bgcolor: "#9c27b0" }}>INF</Avatar>
                <Avatar sx={{ bgcolor: "#4caf50" }}>WIP</Avatar>
                <Avatar sx={{ bgcolor: "#1976d2" }}>COG</Avatar>
                <Avatar sx={{ bgcolor: "#9c27b0" }}>ACC</Avatar>
              </AvatarGroup>

              <Typography
                variant="body2"
                textAlign="center"
                mt={3}
                color="text.secondary"
              >
                Most Active Recruiters
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              bgcolor: "#f1f8e9",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.06)",
                boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <BusinessIcon color="success" />
                <Typography color="text.secondary">
                  Companies Registered
                </Typography>
              </Stack>

              <Typography variant="h4" fontWeight="bold">
                150
              </Typography>

              <Chip
                icon={<TrendingUpIcon />}
                label="0%"
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: "#e8f5e9",
                  color: "success.main",
                }}
              />

              <Typography variant="caption" display="block" mt={1}>
                New tie-ups this season
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              maxHeight: 174, // ⬅ makes card taller
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
              bgcolor: "#fff3e0",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)", // ⬅ slightly bigger hover
                boxShadow: "0px 10px 30px rgba(0,0,0,0.18)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TrendingUpIcon sx={{ fontSize: 36 }} color="warning" />
                <Typography color="text.secondary" variant="body1">
                  Avg. Package
                </Typography>
              </Stack>

              {/* Main Value */}
              <Typography variant="h4" fontWeight="bold">
                7.2{" "}
                <Typography component="span" variant="h6" fontWeight="medium">
                  LPA
                </Typography>
              </Typography>

              {/* Footer */}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Highest: 42 LPA (Microsoft)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Placement Company Details Table */}
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: EDU_COLORS.primary }}
      >
        Placement Company Details
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          border: "2px solid #1f4d3a",
          overflow: "hidden",
          elevation: 0,
          mb: 4,
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: EDU_COLORS.primary }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Company
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Job Role
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Students Placed
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Package (LPA)
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Growth
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eduCompanyData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>{row.name}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.students}</TableCell>
                <TableCell>{row.package}</TableCell>
                <TableCell>
                  <Chip
                    label={row.growth}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Company Registration Form */}
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: EDU_COLORS.primary }}
      >
        New Company Registration
      </Typography>
      <Card sx={{ mb: 3, border: "2px solid #1f4d3a" }}>
        <Box sx={{ backgroundColor: EDU_COLORS.primary, color: "white", p: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontSize: "20px" }}
          >
            Company Details
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Form Grid */}
          <Grid container spacing={3}>
            {/* Row 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Startup Name *"
                value={eduFormData.startupName}
                onChange={eduHandleInputChange("startupName")}
                error={!!eduErrors.startupName}
                helperText={eduErrors.startupName}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Legal Status *"
                value={eduFormData.legalStatus}
                onChange={eduHandleInputChange("legalStatus")}
                error={!!eduErrors.legalStatus}
                helperText={eduErrors.legalStatus}
              >
                <MenuItem value="Private Limited">Private Limited</MenuItem>
                <MenuItem value="LLP">LLP</MenuItem>
                <MenuItem value="Partnership">Partnership</MenuItem>
                <MenuItem value="Sole Proprietorship">
                  Sole Proprietorship
                </MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                type="date"
                fullWidth
                label="Date of Establishment *"
                InputLabelProps={{ shrink: true }}
                value={eduFormData.dateOfEstablishment}
                onChange={eduHandleInputChange("dateOfEstablishment")}
                inputProps={{ min: eduTwoYearsAgo, max: eduToday }}
                error={!!eduErrors.dateOfEstablishment}
                helperText={eduErrors.dateOfEstablishment}
              />
            </Grid>

            {/* Row 2 */}
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Primary Sector *"
                value={eduFormData.primarySector}
                onChange={eduHandleInputChange("primarySector")}
                error={!!eduErrors.primarySector}
                helperText={eduErrors.primarySector}
              >
                <MenuItem value="HealthTech">HealthTech</MenuItem>
                <MenuItem value="FinTech">FinTech</MenuItem>
                <MenuItem value="EdTech">EdTech</MenuItem>
                <MenuItem value="AgriTech">AgriTech</MenuItem>
                <MenuItem value="E-Commerce">E-Commerce</MenuItem>
                <MenuItem value="AI / ML">AI / ML</MenuItem>
                <MenuItem value="IoT">IoT</MenuItem>
                <MenuItem value="SaaS">SaaS</MenuItem>
                <MenuItem value="Blockchain">Blockchain</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Secondary Sector"
                value={eduFormData.secondarySector}
                onChange={eduHandleInputChange("secondarySector")}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="HealthTech">HealthTech</MenuItem>
                <MenuItem value="FinTech">FinTech</MenuItem>
                <MenuItem value="EdTech">EdTech</MenuItem>
                <MenuItem value="AgriTech">AgriTech</MenuItem>
                <MenuItem value="E-Commerce">E-Commerce</MenuItem>
                <MenuItem value="AI / ML">AI / ML</MenuItem>
                <MenuItem value="IoT">IoT</MenuItem>
                <MenuItem value="SaaS">SaaS</MenuItem>
                <MenuItem value="Blockchain">Blockchain</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="Company PAN *"
                value={eduFormData.companyPAN}
                onChange={eduHandleInputChange("companyPAN")}
                inputProps={{ maxLength: 10 }}
                error={!!eduErrors.companyPAN}
                helperText={eduErrors.companyPAN}
              />
            </Grid>

            {/* Row 3 */}
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="GSTIN / CIN"
                value={eduFormData.gstin}
                onChange={eduHandleInputChange("gstin")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Current Team Size *"
                value={eduFormData.currentTeamSize}
                onChange={eduHandleInputChange("currentTeamSize")}
                inputProps={{ min: 0 }}
                error={!!eduErrors.currentTeamSize}
                helperText={eduErrors.currentTeamSize}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Male Employees *"
                value={eduFormData.maleCount}
                onChange={eduHandleInputChange("maleCount")}
                inputProps={{ min: 0 }}
                error={!!eduErrors.maleCount}
                helperText={eduErrors.maleCount}
              />
            </Grid>

            {/* Row 4 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Female Employees *"
                value={eduFormData.femaleCount}
                onChange={eduHandleInputChange("femaleCount")}
                inputProps={{ min: 0 }}
                error={!!eduErrors.femaleCount}
                helperText={eduErrors.femaleCount}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Company Website"
                value={eduFormData.companyWebsite}
                onChange={eduHandleInputChange("companyWebsite")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Number of Branches *"
                value={eduFormData.numberOfBranches}
                onChange={eduHandleBranchCountChange}
                inputProps={{ min: 1, max: 20 }}
                error={!!eduErrors.numberOfBranches}
                helperText={eduErrors.numberOfBranches}
              />
            </Grid>

            {/* Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  onClick={eduHandleSubmit}
                  sx={{ backgroundColor: EDU_COLORS.primary, px: 4 }}
                >
                  Submit Application
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={eduHandleReset}
                >
                  Reset Form
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Ads page="placements" />
    </Box>
  );
};

export default Placements;









