import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  TextField,
  Button,
  Dialog,
  MenuItem,
} from "@mui/material";
import Api from "./api";
// Icons
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Ads from "./ads";

/* -------------------- INITIAL TRAINER STATE -------------------- */
const initialTrainerState = {
  name: "",
  skill: "",
  email: "",
  phone: "",
  qualification: "",
  location: "",
  exp: "",
  trained: "",
  courses: "",
  status: "",
};

function Trainers() {
  const [trainerList, setTrainerList] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [formData, setFormData] = useState(initialTrainerState);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH TRAINERS ================= */
 const fetchTrainers = async () => {
  try {
    const rawEmail = localStorage.getItem("userEmail");

    // ✅ ADD THIS
    if (!rawEmail) {
      console.error("User email not found");
      return;
    }

    const email = rawEmail.trim().toLocaleLowerCase();

    const res = await Api.get(`/trainers/${email}`);

    const formatted = res.data.map((t) => ({
      ...t,
      initials:
        t.name
          ?.split(" ")
          .map((n) => n[0])
          .join("") || "NA",
    }));

    setTrainerList(formatted);
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchTrainers();
  }, []);

  /* ================= DELETE TRAINER ================= */
  const handleDeleteTrainer = async (id) => {
    if (!window.confirm("Delete this trainer?")) return;

    try {
      await Api.delete(`/trainers/${id}`);
      setTrainerList((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const filteredTrainers = trainerList.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleAddTrainer = async () => {

     if (!localStorage.getItem("userEmail")) {
    alert("User not logged in");
    return;
  }

    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name,
        skill: formData.skill,
        location: formData.location,
        exp: formData.exp,
        status: formData.status,
        trained: Number(formData.trained || 0),
        courses: Number(formData.courses || 0),
        email: formData.email,
        phone: formData.phone,
        qualification: formData.qualification,
        adminEmail: localStorage.getItem("userEmail")?.trim().toLocaleLowerCase(),
      };

      if (isEdit) {
        await Api.put(`/trainers/${editId}`, payload);
      } else {
        await Api.post("/trainers", payload);
      }

      await fetchTrainers();

      setOpen(false);
      setFormData(initialTrainerState);
      setErrors({});
      setIsEdit(false);
      setEditId(null);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!formData.skill.trim()) {
      newErrors.skill = "Specialization is required";
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = "Qualification is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.location)) {
      newErrors.location = "Location must contain only letters";
    }

    if (!formData.exp) {
      newErrors.exp = "Experience is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.courses) {
      newErrors.courses = "Courses is required";
    } else if (!/^[0-9]+$/.test(formData.courses)) {
      newErrors.courses = "Courses must contain only numbers";
    }

    if (!formData.trained) {
      newErrors.trained = "Students trained is required";
    } else if (!/^[0-9]+$/.test(formData.trained)) {
      newErrors.trained = "Trained must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#eef8ee", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Trainers
          </Typography>
          <Typography color="text.secondary">
            Manage trainer information
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#2e7d32",
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#1b5e20" },
          }}
          onClick={() => setOpen(true)}
        >
          Add Trainer
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search trainers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,
        }}
        sx={{ mb: 4, backgroundColor: "#fff", borderRadius: 1 }}
      />

      {/* Trainer Cards */}
      <Grid container spacing={3}>
        {filteredTrainers.map((t) => (
          <Grid item xs={12} md={4} key={t._id} sx={{ width: 400 }}>
            <Card sx={{ borderRadius: 3, height: 220 }}>
              <CardContent>
                {/* Top */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e6f4ea",
                      color: "#1b5e20",
                      fontWeight: 700,
                    }}
                  >
                    {t.initials}
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={600}>{t.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.skill}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Chip
                        label={t.status}
                        size="small"
                        color={t.status === "Active" ? "success" : "warning"}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <StarIcon fontSize="small" color="warning" />
                        <Typography variant="body2">
                          {t.rating ?? 4.5}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Details */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <WorkOutlineIcon fontSize="small" />
                      <Typography variant="body2">{t.exp}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <PeopleOutlineIcon fontSize="small" />
                      <Typography variant="body2">
                        {t.trained} trained
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <LocationOnOutlinedIcon fontSize="small" />
                      <Typography variant="body2">{t.location}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <SchoolOutlinedIcon fontSize="small" />
                      <Typography variant="body2">
                        {t.courses} courses
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Actions */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    onClick={() => {
                      setSelectedTrainer(t);
                      setViewOpen(true);
                    }}
                  >
                    <VisibilityOutlinedIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setIsEdit(true);
                      setEditId(t._id);

                      setFormData({
                        name: t.name || "",
                        skill: t.skill || "",
                        email: t.email || "",
                        phone: t.phone || "",
                        qualification: t.qualification || "",
                        location: t.location || "",
                        exp: t.exp || "",
                        trained: t.trained || "",
                        courses: t.courses || "",
                        status: t.status || "",
                      });

                      setOpen(true);
                    }}
                  >
                    <EditOutlinedIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDeleteTrainer(t._id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ADD TRAINER DIALOG */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
          setEditId(null);
          setFormData(initialTrainerState);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography fontWeight={600} fontSize={18}>
              {isEdit ? "Edit Trainer" : "Add New Trainer"}
            </Typography>

            <IconButton
              onClick={() => {
                setOpen(false);
                setIsEdit(false);
                setEditId(null);
                setFormData(initialTrainerState);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form */}
          <Grid container spacing={2}>
            {/* Row 1 */}
            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Full Name *
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Specialization *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Full Stack Development"
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                error={!!errors.skill}
                helperText={errors.skill}
              />
            </Grid>

            {/* Row 2 */}
            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Email *
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="email"
                placeholder="e.g. example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Phone *
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="phone"
                placeholder="e.g. 91XXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            {/* Row 3 */}
            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Qualification
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. M.Tech (CSE)"
                error={!!errors.qualification}
                helperText={errors.qualification}
              />
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                courses
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 5"
                name="courses"
                value={formData.courses}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[0-9]*$/.test(value)) {
                    setFormData({ ...formData, courses: value });
                  }
                }}
                error={!!errors.courses}
                helperText={errors.courses}
              />
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Trained
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 200"
                name="trained"
                value={formData.trained}
                onChange={handleChange}
                error={!!errors.trained}
                helperText={errors.trained}
              />
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Location
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="location"
                placeholder="e.g. Chennai"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>

            {/* Row 4 ✅ Experience BELOW */}
            <Grid container spacing={2}>
              <Grid
                size={6}
                sx={{
                  "& .MuiInputBase-root": { width: 266 },
                }}
              >
                <Typography fontSize={14} fontWeight={500} mb={0.5}>
                  Experience
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  name="exp"
                  value={formData.exp}
                  onChange={handleChange}
                  error={!!errors.exp}
                  helperText={errors.exp}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#aaa" }}>
                            Select Experience
                          </span>
                        );
                      }
                      return selected;
                    },
                  }}
                >
                  <MenuItem value="Select experience"></MenuItem>
                  <MenuItem value="1-3 Years">1–3 Years</MenuItem>
                  <MenuItem value="3-5 Years">3–5 Years</MenuItem>
                  <MenuItem value="5-10 Years">5–10 Years</MenuItem>
                  <MenuItem value="10+ Years">10+ Years</MenuItem>
                </TextField>
              </Grid>

              <Grid
                size={6}
                sx={{
                  "& .MuiInputBase-root": { width: 266 },
                }}
              >
                <Typography fontSize={14} fontWeight={500} mb={0.5}>
                  Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  error={!!errors.status}
                  helperText={errors.status}
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
                  <MenuItem value="On Leave">On Leave</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
          >
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
              }}
              onClick={handleAddTrainer}
            >
              {isEdit ? "Update Trainer" : "Add Trainer"}
            </Button>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
      >
        {selectedTrainer && (
          <Box>
            {/* Close Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={() => setViewOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* ================= HEADER SECTION ================= */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                px: 4,
                pb: 3,
                mt: -2,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 32,
                  fontWeight: 700,
                  bgcolor: "#e6f4ea",
                  color: "#1b5e20",
                }}
              >
                {selectedTrainer.initials}
              </Avatar>

              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {selectedTrainer.name}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {selectedTrainer.skill}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StarIcon sx={{ color: "#ff9800" }} />
                  <Typography fontWeight={600}>
                    {selectedTrainer.rating ?? 4.8}
                  </Typography>
                  <Typography color="text.secondary">(142 reviews)</Typography>
                  {/* Status */}
                  <Chip label={selectedTrainer.status} color="success" />
                </Box>

                {/* Centered Info Columns */}
                <Grid container spacing={3} sx={{ mt: 3, textAlign: "center" }}>
                  <Grid item xs={6} md={3}>
                    <Typography color="text.secondary" fontSize={14}>
                      Experience
                    </Typography>
                    <Typography fontWeight={600} mt={1}>
                      {selectedTrainer.exp}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography color="text.secondary" fontSize={14}>
                      Students Trained
                    </Typography>
                    <Typography fontWeight={600} mt={1}>
                      {selectedTrainer.trained}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography color="text.secondary" fontSize={14}>
                      Courses
                    </Typography>
                    <Typography fontWeight={600} mt={1}>
                      {selectedTrainer.courses}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Typography color="text.secondary" fontSize={14}>
                      Qualification
                    </Typography>
                    <Typography fontWeight={600} mt={1}>
                      {selectedTrainer.qualification}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* ================= CONTACT SECTION ================= */}
            <Box
              sx={{
                borderTop: "1px solid #eee",
                px: 2,
                py: 3,
                display: "flex",
                justifyContent: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography>{selectedTrainer.email}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography>{selectedTrainer.phone}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnOutlinedIcon fontSize="small" />
                <Typography>{selectedTrainer.location}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
      <Ads page="trainers" />
    </Box>
  );
}

export default Trainers;
