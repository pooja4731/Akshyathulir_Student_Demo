import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  MenuItem,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import Api from "./api";
import Search from "@mui/icons-material/Search";
import Download from "@mui/icons-material/Download";
import FileCopy from "@mui/icons-material/FileCopy";
import Print from "@mui/icons-material/Print";
import Visibility from "@mui/icons-material/Visibility";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Schedule from "@mui/icons-material/Schedule";
import Close from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Ads from "./ads"


/* -------------------- DATA -------------------- */

/* -------------------- COMPONENT -------------------- */
const Certificates = () => {
  const [certificates, setCertificates] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [genOpen, setGenOpen] = React.useState(false);
  const [verifyId, setVerifyId] = React.useState("");
  const [verifiedCert, setVerifiedCert] = React.useState(null);
  const adminEmail = localStorage.getItem("userEmail");
  const [selectedCertificate, setSelectedCertificate] = React.useState(null);
  const previewRef = React.useRef(null);
  const certificateRef = React.useRef(null);

  const [formData, setFormData] = React.useState({
    studentName: "",
    course: "",
    grade: "",
    score: "",
    issueDate: "",
    expiryDate: "",
    status: "Pending",
  });
  const filteredCertificates = certificates.filter((c) => {
    const query = searchTerm.toLowerCase();

    return (
      c.studentName?.toLowerCase().includes(query) ||
      c.course?.toLowerCase().includes(query) ||
      c._id?.toLowerCase().includes(query)
    );
  });

  const handleIssueCertificate = async () => {
    try {
      const payload = {
        studentName: formData.studentName,
        course: formData.course,
        completionDate: formData.expiryDate,
        issuedDate: formData.issueDate || "-",
        status: formData.status,
        adminEmail: adminEmail,

        ...(formData.grade && { grade: formData.grade }),
        ...(formData.score && { score: Number(formData.score) }),
      };

      await Api.post("/certificates/", payload);

      await fetchCertificates();

      setFormData({
        studentName: "",
        course: "",
        grade: "",
        score: "",
        issueDate: "",
        expiryDate: "",
        status: "Pending",
      });

      setGenOpen(false);
      alert("✅ Certificate issued successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Error issuing certificate");
    }
  };

  const fetchCertificates = React.useCallback(async () => {
    try {
      const res = await Api.get(`/certificates/${adminEmail}`);

      const formatted = res.data.map((c) => ({
        ...c,
        id: c._id,
      }));

      setCertificates(formatted);
    } catch (err) {
      console.error(err);
    }
  }, [adminEmail]);

  React.useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleVerifyCertificate = async () => {
    try {
      const res = await Api.get(`/certificates/${adminEmail}`);

      const found = res.data.find((c) => c._id === verifyId);

      if (!found) {
        alert("❌ Certificate not found");
        return;
      }

      setVerifiedCert(found);
      alert("✅ Certificate verified successfully!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("❌ Verification failed");
    }
  };
  React.useEffect(() => {
    if (verifiedCert) {
      console.log("Verified Certificate:", verifiedCert);
    }
  }, [verifiedCert]);
  const handleDownloadPDF = async () => {
    const element = certificateRef.current;

    if (!element) return;

    const canvas = await html2canvas(element);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${selectedCertificate?.studentName || "certificate"}.pdf`);
  };
  return (
    <Box p={4}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Certificates
          </Typography>
          <Typography color="text.secondary">
            Issue and manage student certificates.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => setOpen(true)}
            sx={{
              borderColor: "#1f4d3a",
              color: "#1f4d3a",
              "&:hover": {
                borderColor: "#1f4d3a",
                backgroundColor: "rgba(9,75,0,0.04)",
              },
            }}
          >
            Verify Certificate
          </Button>
          <Button
            variant="contained"
            startIcon={<FileCopy />}
            sx={{
              backgroundColor: "#1f4d3a",
              "&:hover": { backgroundColor: "#1f4d3a" },
            }}
            onClick={() => setGenOpen(true)}
          >
            Issue Certificate
          </Button>
        </Stack>
      </Grid>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              flex: { xs: "100%", sm: 1 },
              minWidth: { xs: "100%", sm: 240 },
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
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">Total Issued</Typography>
                  <Typography variant="h5">2,150</Typography>
                </Box>
                <EmojiEvents color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              flex: { xs: "100%", sm: 1 },
              minWidth: { xs: "100%", sm: 240 },
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
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">
                    Verified This Month
                  </Typography>
                  <Typography variant="h5">156</Typography>
                </Box>
                <CheckCircle color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              flex: { xs: "100%", sm: 1 },
              minWidth: { xs: "100%", sm: 240 },
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
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">Pending Issue</Typography>
                  <Typography variant="h5">24</Typography>
                </Box>
                <Schedule color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/*Certificate Pre View*/}
      <Card ref={previewRef} sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="bold">
              Certificate Template Preview
            </Typography>
          }
        />

        <CardContent>
          <Box
            ref={certificateRef}
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 3,
              p: 4,
              bgcolor: "action.hover",
            }}
          >
            <Box maxWidth="600px" mx="auto" textAlign="center">
              {/* Icon */}
              <Box mb={2} display="flex" justifyContent="center">
                <EmojiEvents sx={{ fontSize: 64, color: "primary.main" }} />
              </Box>

              {/* Title */}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Certificate of Completion
              </Typography>

              <Typography color="text.secondary" mb={2}>
                This is to certify that
              </Typography>

              <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
                {selectedCertificate?.studentName || "[Student Name]"}
              </Typography>

              <Typography color="text.secondary" mb={2}>
                has successfully completed the course
              </Typography>

              <Typography variant="h6" fontWeight="medium" mb={4}>
                {selectedCertificate?.course || "[Course Name]"}
              </Typography>

              {/* Footer */}
              <Grid container justifyContent="center" spacing={6}>
                <Grid item>
                  <Typography fontWeight="bold">Date</Typography>
                  <Typography color="text.secondary">
                    {selectedCertificate?.completionDate || "[Completion Date]"}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography fontWeight="bold">Certificate ID</Typography>
                  <Typography color="text.secondary">
                    {selectedCertificate?.id || "[CERT-XXXXX]"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search by student name or certificate ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Certificate ID</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Completion Date</TableCell>
                <TableCell>Issued Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCertificates.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell sx={{ fontFamily: "monospace" }}>{c.id}</TableCell>
                  <TableCell>{c.studentName}</TableCell>
                  <TableCell>{c.course}</TableCell>
                  <TableCell>{c.grade ?? "-"}</TableCell>
                  <TableCell>{c.score != null ? c.score : "-"}</TableCell>

                  <TableCell>{c.completionDate}</TableCell>
                  <TableCell>{c.issuedDate}</TableCell>

                  <TableCell>
                    <Chip
                      label={c.status}
                      color={c.status === "Issued" ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setSelectedCertificate(c);

                        setTimeout(() => {
                          previewRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    {c.status === "Issued" && (
                      <>
                        <IconButton
                          onClick={handleDownloadPDF}
                          disabled={!selectedCertificate}
                        >
                          <Download />
                        </IconButton>
                        <IconButton>
                          <Print />
                        </IconButton>
                      </>
                    )}
                    {c.status === "Pending" && (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          backgroundColor: "#1f4d3a",
                          "&:hover": { backgroundColor: "#1f4d3a" },
                        }}
                      >
                        Issue
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Verify Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box p={3}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight="bold">Verify Certificate</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Stack>

          <Stack spacing={2} mt={2}>
            <TextField
              label="Certificate ID"
              placeholder="Paste certificate ID"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1f4d3a",
                "&:hover": { backgroundColor: "#1f4d3a" },
              }}
              onClick={handleVerifyCertificate}
            >
              Verify
            </Button>
          </Stack>
        </Box>
      </Dialog>
      {/* Issue New Certificate Dialog */}
      <Dialog
        open={genOpen}
        onClose={() => setGenOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Issue New Certificate
            </Typography>
            <IconButton onClick={() => setGenOpen(false)}>
              <Close />
            </IconButton>
          </Stack>

          <Stack spacing={2} mt={2}>
            <TextField
              label="Student Name *"
              placeholder="e.g. Arjun Mehta"
              fullWidth
              value={formData.studentName}
              onChange={(e) =>
                setFormData({ ...formData, studentName: e.target.value })
              }
            />

            <TextField
              select
              label="Course *"
              fullWidth
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
            >
              <MenuItem value="">Select course</MenuItem>
              <MenuItem value="Full Stack">Full Stack</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="UI/UX">UI/UX</MenuItem>
              <MenuItem value="Cyber Security">Cyber Security</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Grade"
                fullWidth
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
              >
                <MenuItem value="">Select grade</MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B">B</MenuItem>
              </TextField>

              <TextField
                label="Score"
                placeholder="e.g. 95%"
                fullWidth
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
              />
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="Issue Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="Expiry Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <TextField
              select
              label="Status"
              fullWidth
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Issued">Issued</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="outlined" onClick={() => setGenOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1f4d3a",
                  "&:hover": { backgroundColor: "#1f4d3a" },
                }}
                onClick={handleIssueCertificate}
              >
                Issue Certificate
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>
     <Ads page="certificates" />
    </Box>
  );
};

export default Certificates;
