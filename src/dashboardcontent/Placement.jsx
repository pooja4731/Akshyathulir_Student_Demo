import React, { useState } from "react";
import {
    Container,
    Box,
    Grid,
    TextField,
    Typography,
    Button,
    MenuItem
} from "@mui/material";

/* ---------- STYLES ---------- */
const titleStyle = {
    fontSize: "32px",
    fontWeight: 600,
    color: "#006400",
    textAlign: "center",
    marginBottom: "30px"
};

const sectionHeaderStyle = {
    backgroundColor: "#006400",
    color: "#fff",
    padding: "8px 20px",
    fontSize: "18px",
    fontWeight: 500,
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px"
};

const sectionBodyStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    border: "1px solid #ccc",
    borderTop: "none",
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px"
};

const course = [
    "Full Stack Development",
    "Frontend Development",
    "Backend Development",
    "Data Science",
    "UI / UX Design"
];

const status = ["Placed", "Not Placed", "In Progress"];

/* ---------- INITIAL FORM DATA ---------- */
const initialFormData = {
    StudentName: "",
    CourseName: "",
    CompanyName: "",
    Role: "",
    Package: "",
    PlacementDate: "",
    Status: "",
    SummaryCards: "",
    TotalPlacedStudent: "",
    AveragePackages: "",
    TopHiringCompany: "",
};

export default function Placement() {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ backgroundColor: "#f4f6f9", minHeight: "100vh", py: 4 }}>
            <Container maxWidth="lg">
                <Typography sx={titleStyle}>
                    Placement Form
                </Typography>

                {/* ---------- Institute Details ---------- */}
                <Box mb={4}>
                    <Box sx={sectionHeaderStyle}>Placement Details</Box>
                    <Box sx={sectionBodyStyle}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Student Name"
                                    name="StudentName"
                                    value={formData.StudentName}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Course Name"
                                    name="CourseName"
                                    value={formData.CourseName}
                                    onChange={handleChange}
                                >
                                    {course.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Company Name"
                                    name="CompanyName"
                                    value={formData.CompanyName}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Role"
                                    name="Role"
                                    value={formData.Role}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Package (CTC)"
                                    name="Package"
                                    value={formData.Package}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Placement Date"
                                    name="PlacementDate"
                                    value={formData.PlacementDate}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>


                            <Grid size={{ xs: 12, md: 5 }}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Status"
                                    name="Status"
                                    value={formData.Status}
                                    onChange={handleChange}
                                >
                                    {status.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}

                                </TextField>

                            </Grid>
                        </Grid>
                    </Box>
                </Box>


                {/* ---------- Button ---------- */}
                <Box textAlign="center" mt={3}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#006400",
                            fontSize: "16px",
                            px: 4,
                            borderRadius: "999px"
                        }}
                    >
                        Save Details
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}