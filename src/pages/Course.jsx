import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Chip,
  Dialog,
  MenuItem,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import Api from "./api";
import Search from "@mui/icons-material/Search";
import Visibility from "@mui/icons-material/Visibility";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Ads from "./ads";

/* -------------------- INITIAL STATE -------------------- */
const initialState = {
  name: "",
  category: "",
  duration: "",
  fees: "",
  status: "",
  startDate: "",
  trainer: "",
  description: "",
  syllabus: "",
  outcomes: "",
  email: "",
};

const Courses = () => {
  // add course
  const [courses, setCourses] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [newCourse, setNewCourse] = useState(initialState);
  // const email = localStorage.getItem("userEmail");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

 const fetchCourses = async () => {
  try {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      console.error("Email not found");
      return;
    }

    const res = await Api.get(`/courses/${email}`);
    setCourses(res.data);
  } catch (err) {
    console.error(err);
  }
};

  /* -------------------- ADD COURSE -------------------- */

  const filteredCourses = courses.filter(
    (c) => c.name && c.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* -------------------- DELETE COURSE -------------------- */
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await Api.delete(`/courses/${id}/`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  const handleAddCourse = async () => {

  if (!localStorage.getItem("userEmail")) {
    alert("User not logged in");
    return;
  }


  if (!validateForm()) return;

  try {
    const payload = {
      name: newCourse.name,
      category: newCourse.category,
      duration: newCourse.duration,
      fees: newCourse.fees,
      trainer: newCourse.trainer,
      status: newCourse.status,
      description: newCourse.description,
      syllabus: newCourse.syllabus
        ? newCourse.syllabus.split(",").map((s) => s.trim())
        : [],
      outcomes: newCourse.outcomes
        ? newCourse.outcomes.split(",").map((o) => o.trim())
        : [],
      email: localStorage.getItem("userEmail"), // ✅ FIX
    };

    if (isEdit) {
      await Api.put(`/courses/${editId}/`, payload);
    } else {
      await Api.post("/courses/", { ...payload, enrolled: 0 });
    }

    await fetchCourses();

    setOpenAdd(false);
    setNewCourse(initialState);
    setIsEdit(false);
    setEditId(null);
  } catch (err) {
    console.error(err.response?.data || err);
    alert("❌ Failed to save course");
  }
};
 
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};

    if (!newCourse.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!newCourse.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!newCourse.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!newCourse.fees.trim()) {
      newErrors.fees = "Fees is required";
    } else if (!/^[0-9]+$/.test(newCourse.fees)) {
      newErrors.fees = "Fees must contain only numbers";
    }

    if (!newCourse.trainer.trim()) {
      newErrors.trainer = "Trainer name is required";
    } else if (!/^[A-Za-z\s]+$/.test(newCourse.trainer)) {
      newErrors.trainer = "Trainer name must contain only letters";
    }

    if (!newCourse.status.trim()) {
      newErrors.status = "Status is required";
    }

    if (!newCourse.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!newCourse.syllabus || !newCourse.syllabus.trim()) {
      newErrors.syllabus = "Syllabus is required";
    }

    if (!newCourse.outcomes || !newCourse.outcomes.trim()) {
      newErrors.outcomes = "Outcomes are required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <Box p={4}>
      {/* HEADER */}
      {/* stack arrange the component */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Courses
          </Typography>
          <Typography color="gray">Explore available courses</Typography>
        </Box>

        <Button
          variant="outlined" //border
          onClick={() => setOpenAdd(true)}
          sx={{
            borderColor: "#1f4d3a",
            color: "#1f4d3a",
            height: 32,
            px: 1.5,
            fontSize: "0.8rem",
          }}
        >
          Add Course
        </Button>
      </Stack>

      {/* SEARCH */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* COURSE CARDS */}
      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid
            item
            xs={12}
            md={4}
            key={course._id}
            sx={{ width: 300, height: 350 }}
          >
            <Card
              sx={{
                borderRadius: 2,
                flexDirection: "column",
                overflow: "hidden",
                "&:hover": { boxShadow: 8 },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#1b5e20",
                  color: "white",
                  p: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {course.name}
                </Typography>
              </Box>

              {/* Body Content */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Description */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  {course.description}
                </Typography>

                {/* Details */}
                <Box>
                  <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Typography variant="body2">⏱ {course.duration}</Typography>
                    <Typography variant="body2">₹ {course.fees}</Typography>
                    <Typography variant="body2">
                      👥 {course.enrolled} Students
                    </Typography>
                    <Typography variant="body2">👤 {course.trainer}</Typography>
                  </Stack>
                </Box>

                {/* Category Tag and Actions */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={course.category || "IT & Software"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedCourse(course);
                        setDetailsOpen(true);
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setIsEdit(true);
                        setEditId(course._id);
                        setNewCourse({
                          name: course.name || "",
                          category: course.category || "",
                          duration: course.duration || "",
                          fees: course.fees || "",
                          trainer: course.trainer || "",
                          status: course.status || "Active",
                          description: course.description || "",
                          syllabus: (course.syllabus || []).join(", "),
                          outcomes: (course.outcomes || []).join(", "),
                        });
                        setOpenAdd(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      sx={{ color: "error.main" }}
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ADD COURSE DIALOG */}
      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setIsEdit(false);
          setEditId(null);
          setNewCourse(initialState);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEdit ? "Edit Course" : "Add Course"}
          </Typography>

          <Grid container spacing={2}>
            {/* Row 1 */}
            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Course Name *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Full Stack Development"
                name="name"
                value={newCourse.name}
                error={!!errors.name}
                helperText={errors.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
              />
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Category
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="category"
                value={newCourse.category}
                error={!!errors.category}
                helperText={errors.category}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, category: e.target.value })
                }
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (selected === "") {
                      return (
                        <span style={{ color: "#aaa" }}>Select Category</span>
                      );
                    }
                    return selected;
                  },
                }}
              >
                <MenuItem value="IT & Software">IT & Software</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </TextField>
            </Grid>

            {/* Row 2 */}
            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Duration *
              </Typography>

              <TextField
                select
                fullWidth
                size="small"
                name="duration"
                value={newCourse.duration}
                error={!!errors.duration}
                helperText={errors.duration}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, duration: e.target.value })
                }
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (selected === "") {
                      return (
                        <span style={{ color: "#aaa" }}>Select Duration</span>
                      );
                    }
                    return selected;
                  },
                }}
              >
                <MenuItem value="1 month">1 Month</MenuItem>
                <MenuItem value="2 month">2 Months</MenuItem>
                <MenuItem value="3 month">3 Months</MenuItem>
                <MenuItem value="5 month">5 Months</MenuItem>
                <MenuItem value="6 month">6 Months</MenuItem>
              </TextField>
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Fees *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. ₹ 25,000"
                name="fees"
                value={newCourse.fees}
                error={!!errors.fees}
                helperText={errors.fees}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, fees: e.target.value })
                }
              />
            </Grid>

            {/* Row 3 */}
            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Trainer
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Trainer Name"
                name="trainer"
                value={newCourse.trainer}
                error={!!errors.trainer}
                helperText={errors.trainer}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, trainer: e.target.value })
                }
              />
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Status
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="status"
                value={newCourse.status}
                error={!!errors.status}
                helperText={errors.status}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, status: e.target.value })
                }
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (selected === "") {
                      return (
                        <span style={{ color: "#aaa" }}>Select Status</span>
                      );
                    }
                    return selected;
                  },
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            {/* Row 4 */}
            <Grid size={12}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Description
              </Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                name="description"
                value={newCourse.description}
                error={!!errors.description}
                helperText={errors.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
              />
            </Grid>

            {/* Row 5 */}
            <Grid size={12}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Syllabus (comma separated)
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="syllabus"
                placeholder="HTML, CSS, React, Node"
                value={newCourse.syllabus || ""}
                error={!!errors.syllabus}
                helperText={errors.syllabus}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, syllabus: e.target.value })
                }
              />
            </Grid>

            <Grid size={12}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Outcomes (comma separated)
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="outcomes"
                placeholder="Build apps, Deploy projects"
                value={newCourse.outcomes || ""}
                error={!!errors.outcomes}
                helperText={errors.outcomes}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, outcomes: e.target.value })
                }
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} md={6} textAlign="right">
              <Button
                variant="contained"
                sx={{ backgroundColor: "#1b5e20" }}
                onClick={handleAddCourse}
              >
                {isEdit ? "Update Course" : "Add Course"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      {/* VIEW DETAILS */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "16px",
            padding: 2,
          },
        }}
      >
        {selectedCourse && (
          <Box p={3}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#1e293b", letterSpacing: 1 }}
                >
                  DATA • IT & SOFTWARE
                </Typography>

                <Typography variant="h4" fontWeight="bold" mt={1}>
                  {selectedCourse.name}
                </Typography>

                <Typography variant="body2" color="gray" mt={1}>
                  Master data analysis, visualization, and machine learning
                  techniques.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3, backgroundColor: "#1e293b" }} />

            {/* Content Section */}
            <Box display="flex" gap={6} flexWrap="wrap">
              {/* SYLLABUS */}
              <Box flex={1} minWidth="250px">
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#1e293b", mb: 2, letterSpacing: 1 }}
                >
                  SYLLABUS
                </Typography>

                {(selectedCourse.syllabus || []).map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Typography
                      sx={{
                        color: "#1e293b",
                        fontWeight: "bold",
                        width: 30,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Box>

              {/* OUTCOMES */}
              <Box flex={1} minWidth="250px">
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#1e293b", mb: 2, letterSpacing: 1 }}
                >
                  OUTCOMES
                </Typography>

                {(selectedCourse.outcomes || []).map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Typography sx={{ color: "#1e293b", mr: 1 }}>→</Typography>
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
      <Ads page="courses" />
    </Box>
  );
};

export default Courses;
