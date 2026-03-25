import React, { useState, useEffect, useCallback } from "react";

import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  FormHelperText,
  Select,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import Api from "./api";

// --- THEME CONFIGURATION ---
const theme = createTheme({
  typography: {
    h1: { fontSize: "34px" },
    h5: { fontSize: "20px" },
    h6: { fontSize: "16px" },
    body1: { fontSize: "16px" },
    body2: { fontSize: "14px" },
    button: { fontSize: "15px" },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: { width: "100%" },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: { fontSize: "16px" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "14px" },
      },
    },
  },
});
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// --- HELPER COMPONENT FOR GRID LAYOUT ---
const FormRow = ({ children }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
    {React.Children.map(children, (child) => (
      <Box sx={{ flex: 1, minWidth: "250px" }}>{child}</Box>
    ))}
  </Box>
);

// --- PHONE COUNTRY CODES ---
const PHONE_COUNTRIES = [
  { name: "India", code: "+91", maxLength: 10 },
  { name: "United States", code: "+1", maxLength: 10 },
  { name: "United Kingdom", code: "+44", maxLength: 10 },
  { name: "Australia", code: "+61", maxLength: 9 },
  { name: "Canada", code: "+1", maxLength: 10 },
];

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  linkedin: "",
  website: "",
  dateOfBirth: "",
  gender: "",
  designation: "",
  cin: "",
  instituteName: "",
  legalStatus: "",
  dateOfEstablishment: "",
  primarySector: "",
  companyPAN: "",
  currentTeamSize: "",
  maleCount: "",
  femaleCount: "",
  gstin: "",
  companyWebsite: "",
  numberOfBranches: "1",
  branchAddresses: [
    {
      fullAddress: "",
      country: "",
      state: "",
      district: "",
      city: "",
      area: "",
      pinCode: "",
      isPrimary: true,
    },
  ],
  founderEmail: "",
  founderFirstName: "",
  founderLastName: "",
  founderPhoneCountry: "India",
  founderPhoneCode: "",
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
  secondarySector: "",
  placementOffered: "",
  placementType: "",
  internshipOffered: "",
  internshipType: "",
  trainingOffered: "",
  trainingType: [],
  fypOffered: "",
  phoneCountry: "India",
  phoneCode: "",
  phone: "",
};
const initialAddress = {
  fullAddress: "",
  country: "",
  state: "",
  district: "",
  city: "",
  area: "",
  pinCode: "",
  isPrimary: false,
};

function App() {
  // --- DATE CALCULATIONS ---
  const today = new Date().toISOString().split("T")[0];
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  const twoYearsAgo = d.toISOString().split("T")[0];

  const [errors, setErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [addressArrays, setAddressArrays] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [isEditable, setIsEditable] = useState(false);

  const [isLoading, setIsLoading] = useState({
    countries: false,
    states: false,
    districts: false,
    cities: false,
    cin: false,
    email: false,
  });
  //fetching the required lists based on the selected country, state, and district.
  const preloadAddressDropdowns = async (addresses) => {
    const newAddressArrays = {};

    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i];
      newAddressArrays[i] = { states: [], districts: [], cities: [] };

      if (addr.country) {
        const statesRes = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: addr.country },
        );
        newAddressArrays[i].states =
          statesRes.data.data?.states?.map((s) => s.name) || [];
      }

      if (addr.country && addr.state) {
        const districtRes = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          { country: addr.country, state: addr.state },
        );
        newAddressArrays[i].districts = districtRes.data.data || [];
      }

      if (addr.country === "India" && addr.district) {
        const cityRes = await axios.get(
          `https://api.postalpincode.in/postoffice/${addr.district}`,
        );
        if (cityRes.data?.[0]?.PostOffice) {
          newAddressArrays[i].cities = cityRes.data[0].PostOffice.map((po) => ({
            name: po.Name,
            pin: po.Pincode,
          }));
        }
      }
    }

    setAddressArrays(newAddressArrays);
  };

  const handleReset = () => {
    localStorage.removeItem("userEmail");
    setFormData(initialFormState);
    setErrors({});
    setIsEditMode(false);
    setIsEditable(true);
  };

  const handleDelete = async () => {
    try {
      await Api.delete(`/startup/${encodeURIComponent(formData.email)}/`);
      alert("Startup deleted successfully.");
      handleReset();
    } catch (error) {
      alert(
        error.response?.status === 404
          ? "Record not found."
          : "Server error. Could not delete.",
      );
    }
  };

  // ---LOAD EMAIL FROM LOCAL STORAGE ---
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: storedEmail.trim().toLowerCase(),
      }));
    }
  }, []);
  //----FETCH COMPANY BY EMAIL---
  useEffect(() => {
    if (!formData.email) return;
    if (!EMAIL_REGEX.test(formData.email)) return;

    const fetchCompanyByEmail = async () => {
      setIsLoading((prev) => ({ ...prev, email: true }));

      try {
        const response = await Api.get(
          `/startup/by-email/${encodeURIComponent(formData.email)}`,
        );

        const data = response.data;
        setIsEditMode(true); // record exists
        setIsEditable(false); // initially view-only

        setFormData((prev) => ({
          ...prev,

          // Personal
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || prev.email,
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          phoneCountry: data.phoneCountry || "India",
          phoneCode: data.phoneCode || "",
          phone: data.phone || "",

          // Online
          linkedin: data.linkedin || "",
          website: data.website || "",

          // Company
          designation: data.designation || "",
          cin: data.cin || "",
          instituteName: data.instituteName || "",
          legalStatus: data.legalStatus || "",
          dateOfEstablishment: data.dateOfEstablishment || "",
          primarySector: data.primarySector || "",
          secondarySector: data.secondarySector || "",
          companyPAN: data.companyPAN || "",
          gstin: data.gstin || "",
          companyWebsite: data.companyWebsite || "",
          numberOfBranches: data.numberOfBranches || "1",

          // Address
          // ✅ Address (CORRECT) - Handle both branchAddresses array and individual fields
          branchAddresses:
            data.branchAddresses && data.branchAddresses.length > 0
              ? data.branchAddresses.map((addr, index) => ({
                fullAddress: addr.fullAddress || "",
                country: addr.country || "",
                state: addr.state || "",
                district: addr.district || "",
                city: addr.city || "",
                area: addr.area || "",
                pinCode: addr.pinCode || "",
                isPrimary: addr.isPrimary ?? index === 0,
              }))
              : data.country ||
                data.state ||
                data.district ||
                data.city ||
                data.area ||
                data.pinCode ||
                data.address
                ? [
                  {
                    fullAddress: data.address || "",
                    country: data.country || "",
                    state: data.state || "",
                    district: data.district || "",
                    city: data.city || "",
                    area: data.area || "",
                    pinCode: data.pinCode || "",
                    isPrimary: true,
                  },
                ]
                : [
                  {
                    fullAddress: "",
                    country: "",
                    state: "",
                    district: "",
                    city: "",
                    area: "",
                    pinCode: "",
                    isPrimary: true,
                  },
                ],

          // Team
          currentTeamSize: data.currentTeamSize || "",
          maleCount: data.maleCount || "",
          femaleCount: data.femaleCount || "",

          // Founder
          founderFirstName: data.founderFirstName || "",
          founderLastName: data.founderLastName || "",
          founderEmail: data.founderEmail || "",
          founderPhoneCountry: data.founderPhoneCountry || "India",
          founderPhoneCode: data.founderPhoneCode || "",
          founderPhone: data.founderPhone || "",
          founderDOB: data.founderDOB || "",
          founderGender: data.founderGender || "",
          founderLinkedIn: data.founderLinkedIn || "",
          founderFacebook: data.founderFacebook || "",

          // Support
          fundingNeeded: data.fundingNeeded || "",
          mentorshipNeeded: data.mentorshipNeeded || "",
          technologySupport: data.technologySupport || "",
          incubationSpace: data.incubationSpace || "",
          registrationNeeded: data.registrationNeeded || "",
          supportInterest: data.supportInterest || "",
          governmentSchemes: data.governmentSchemes || "",

          // Opportunities
          placementOffered: data.placementOffered || "",
          placementType: data.placementType || "",
          internshipOffered: data.internshipOffered || "",
          internshipType: data.internshipType || "",
          trainingOffered: data.trainingOffered || "",
          trainingType: data.trainingType || [],
          fypOffered: data.fypOffered || "",
        }));
        await preloadAddressDropdowns(data.branchAddresses || []);

        setErrors((prev) => ({ ...prev, email: "" }));
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          email:
            error.response?.status === 404
              ? "No application found for this email"
              : "Server error while fetching data",
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, email: false }));
      }
    };

    fetchCompanyByEmail();
  }, [formData.email]);
  //---from an API, and stores the country names while showing a loading state.---
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading((prev) => ({ ...prev, countries: true }));
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/iso",
        );
        const data = await response.json();
        if (data.data) {
          setCountryList(data.data.map((c) => c.name).sort());
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading((prev) => ({ ...prev, countries: false }));
    };
    fetchCountries();
  }, []);

  // --- LOGIC: SET PRIMARY/MAIN ADDRESS ---
  const handleSetMainAddress = (index) => {
    const updated = formData.branchAddresses.map((addr, i) => ({
      ...addr,
      isPrimary: i === index,
    }));
    setFormData({ ...formData, branchAddresses: updated });
  };

  // --- LOGIC: HANDLE BRANCH COUNT CHANGE ---
  const handleBranchCountChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setFormData({ ...formData, numberOfBranches: "", branchAddresses: [] });
      setErrors((prev) => ({
        ...prev,
        numberOfBranches: "Number of branches is required",
      }));
      return;
    }
    let count = Number(value);
    if (isNaN(count) || count < 1) return;
    if (count > 20) {
      setErrors((prev) => ({
        ...prev,
        numberOfBranches: "Maximum allowed branches is 20",
      }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, numberOfBranches: "" }));
    }
    const updatedAddresses = [...formData.branchAddresses];
    if (count > updatedAddresses.length) {
      for (let i = updatedAddresses.length; i < count; i++) {
        updatedAddresses.push({ ...initialAddress });
      }
    } else if (count < updatedAddresses.length) {
      const removedPrimary = updatedAddresses
        .slice(count)
        .some((a) => a.isPrimary);
      updatedAddresses.length = count;
      if (removedPrimary && updatedAddresses.length > 0)
        updatedAddresses[0].isPrimary = true;
    }
    setFormData({
      ...formData,
      numberOfBranches: value,
      branchAddresses: updatedAddresses,
    });
  };

  // --- LOGIC: UPDATE INDIVIDUAL ADDRESS FIELDS ---
  const handleAddressFieldChange = (index, field, value) => {
    const updatedAddresses = [...formData.branchAddresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
    setFormData({ ...formData, branchAddresses: updatedAddresses });
  };

  // --- API: HANDLE COUNTRY SELECTION ---
  const handleCountryChange = useCallback(
    async (index, event) => {
      const selectedCountry = event.target.value;

      const updatedAddresses = [...formData.branchAddresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        country: selectedCountry,
        state: "",
        district: "",
        city: "",
        pinCode: "",
      };

      setFormData((prev) => ({ ...prev, branchAddresses: updatedAddresses }));

      setAddressArrays((prev) => ({
        ...prev,
        [index]: { states: [], districts: [], cities: [] },
      }));

      if (selectedCountry) {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: selectedCountry },
        );

        setAddressArrays((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            states: response.data.data?.states?.map((s) => s.name) || [],
          },
        }));
      }
    },
    [formData.branchAddresses],
  );

  // --- API: HANDLE STATE SELECTION ---
  const handleStateChange = useCallback(
    async (index, event) => {
      const selectedState = event.target.value;
      const country = formData.branchAddresses[index].country;

      const updatedAddresses = [...formData.branchAddresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        state: selectedState,
        district: "",
        city: "",
        pinCode: "",
      };

      setFormData((prev) => ({ ...prev, branchAddresses: updatedAddresses }));

      if (selectedState && country) {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          { country, state: selectedState },
        );

        setAddressArrays((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            districts: response.data.data || [],
          },
        }));
      }
    },
    [formData.branchAddresses],
  );

  // --- API: HANDLE DISTRICT SELECTION ---
  const handleDistrictChange = async (index, event) => {
    const selectedDistrict = event.target.value;
    const currentCountry = formData.branchAddresses[index].country;
    const updatedAddresses = [...formData.branchAddresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      district: selectedDistrict,
      city: "",
      pinCode: "",
    };
    setFormData({ ...formData, branchAddresses: updatedAddresses });
    if (selectedDistrict && currentCountry === "India") {
      setIsLoading((prev) => ({ ...prev, cities: true }));
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/postoffice/${selectedDistrict}`,
        );
        if (response.data?.[0]?.PostOffice) {
          const uniqueCities = [
            ...new Set(
              response.data[0].PostOffice.map((po) => ({
                name: po.Name,
                pin: po.Pincode,
              })),
            ),
          ];
          setAddressArrays((prev) => ({
            ...prev,
            [index]: {
              ...prev[index],
              cities: uniqueCities.sort((a, b) => a.name.localeCompare(b.name)),
            },
          }));
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  // --- FROM THE branch address automatically fills the pin code based on that city. ---
  const handleCityChange = (index, event) => {
    const selectedCityName = event.target.value;
    const selectedCityObj = addressArrays[index]?.cities.find(
      (c) => c.name === selectedCityName,
    );
    const updatedAddresses = [...formData.branchAddresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      city: selectedCityName,
      pinCode: selectedCityObj?.pin || "",
    };
    setFormData({ ...formData, branchAddresses: updatedAddresses });
  };

  // --- COUNT THE MALE & FEMALE = TOTAL TEAM ---
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    if (
      [
        "currentTeamSize",
        "maleCount",
        "femaleCount",
        "numberOfBranches",
      ].includes(field)
    ) {
      if (value !== "" && Number(value) < 0) return;
    }
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const teamSize = Number(updated.currentTeamSize || 0);
      const male = Number(updated.maleCount || 0);
      const female = Number(updated.femaleCount || 0);
      if (teamSize > 0 && male + female !== teamSize) {
        setErrors((prevErr) => ({
          ...prevErr,
          maleCount: "Male + Female must equal Team Size",
          femaleCount: "Male + Female must equal Team Size",
        }));
      } else {
        setErrors((prevErr) => ({
          ...prevErr,
          maleCount: "",
          femaleCount: "",
        }));
      }
      return updated;
    });
    if (errors[field]) setErrors((prevErr) => ({ ...prevErr, [field]: "" }));
  };
  //---choose the country related phone number---
  const handlePhoneCountryChange = (e) => {
    const selected = PHONE_COUNTRIES.find((c) => c.name === e.target.value);
    setFormData((prev) => ({
      ...prev,
      phoneCountry: selected.name,
      phoneCode: selected.code,
      phone: "",
    }));
  };
  //---Form Validation---
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    const checkRequired = (field, label) => {
      if (!formData[field]) {
        tempErrors[field] = `${label} is required`;
        isValid = false;
      }
    };
    checkRequired("cin", "cin");
    checkRequired("firstName", "First Name");
    checkRequired("lastName", "Last Name");
    checkRequired("email", "Email");
    checkRequired("phone", "Phone Number");
    checkRequired("dateOfBirth", "Date of Birth");
    checkRequired("gender", "Gender");
    checkRequired("designation", "Designation");
    if (formData.email && !EMAIL_REGEX.test(formData.email)) {
      tempErrors.email = "Enter a valid email address";
      isValid = false;
    }
    checkRequired("instituteName", "Institute Name");
    checkRequired("legalStatus", "Legal Status");
    checkRequired("dateOfEstablishment", "Date of Establishment");
    checkRequired("primarySector", "Primary Sector");
    checkRequired("companyPAN", "Company PAN");
    checkRequired("gstin", "GSTIN");
    checkRequired("currentTeamSize", "Team Size");
    checkRequired("maleCount", "Male Employees");
    checkRequired("femaleCount", "Female Employees");
    checkRequired("numberOfBranches", "Number of Branches");
    checkRequired("founderEmail", "Founder Email");
    checkRequired("founderFirstName", "Founder First Name");
    checkRequired("founderLastName", "Founder Last Name");
    checkRequired("founderPhone", "Founder Phone");
    checkRequired("founderDOB", "Founder Date of Birth");
    checkRequired("founderGender", "Founder Gender");

    formData.branchAddresses.forEach((addr, index) => {
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
      if (!addr.area) {
        tempErrors[`address_${index}_area`] = "Area / Locality is required";
        isValid = false;
      }
      if (!addr.fullAddress) {
        tempErrors[`address_${index}_fullAddress`] = "Full Address is required";
        isValid = false;
      }
    });

    checkRequired("placementOffered", "Placement Offered");
    checkRequired("internshipOffered", "Internship Offered");
    checkRequired("trainingOffered", "Training Offered");
    checkRequired("fypOffered", "Final Year Project");
    checkRequired("fundingNeeded", "Funding Needed");
    checkRequired("mentorshipNeeded", "Mentorship Needed");
    checkRequired("technologySupport", "Technology Support Needed");
    checkRequired("incubationSpace", "Incubation Space Needed");
    checkRequired("registrationNeeded", "Registration Needed");

    setErrors(tempErrors);
    return isValid;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please correct errors before submitting.");
      return;
    }

    try {
      const payload = {
        ...formData,

        currentTeamSize: parseInt(formData.currentTeamSize) || 0,
        numberOfBranches: parseInt(formData.numberOfBranches) || 1,
      };

      const response = isEditMode
        ? await Api.put("/startup/", payload)
        : await Api.post("/startup/", payload);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("userEmail", formData.email.trim().toLowerCase());
        alert(isEditMode ? "Updated successfully!" : "Submitted successfully!");
        window.location.href = "/allform";
      }
    } catch (error) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ mb: 4, color: "#1f4d3a", fontWeight: "bold", fontSize: "34px" }}
        >
          Training Institute Form
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 2,
          }}
        >
          {isEditMode && !isEditable && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1f4d3a",
                "&:hover": {
                  backgroundColor: "#173b2d",
                },
              }}
              onClick={() => {
                setOriginalData(JSON.parse(JSON.stringify(formData)));
                setIsEditable(true);
              }}
            >
              Edit
            </Button>
          )}
        </Box>

        {/* --- SECTION: COMPANY DETAILS --- */}
        <Card sx={{ mb: 3, border: "2px solid #1f4d3a" }}>
          <Box sx={{ backgroundColor: "#1f4d3a", color: "white", p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Institute Details
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <FormRow>
              <TextField
                label="CIN (Corporate Identification Number)"
                value={formData.cin}
                disabled={isEditMode && !isEditable}
                error={!!errors.cin}
                helperText={errors.cin}
                onChange={(e) =>
                  handleInputChange("cin")({
                    target: { value: e.target.value.toUpperCase() },
                  })
                }
                inputProps={{ maxLength: 21 }}
                placeholder="Ex: U74140DL2015PTC284344"
                InputProps={{
                  endAdornment: isLoading.cin ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
              />

              <TextField
                label="Institute Name *"
                value={formData.instituteName}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("instituteName")}
                error={!!errors.instituteName}
                helperText={errors.instituteName}
                placeholder="Enter Company Registered Name"
              />
              <TextField
                label="GSTIN *"
                value={formData.gstin}
                disabled={isEditMode && !isEditable}
                onChange={(e) =>
                  handleInputChange("gstin")({
                    target: { value: e.target.value.toUpperCase() },
                  })
                }
                inputProps={{ maxLength: 15 }}
                error={!!errors.gstin}
                helperText={errors.gstin || "Enter 15-digit GSTIN"}
                placeholder="Ex: 07AAAAA0000A1Z5"
              />
              <TextField
                label="Company PAN *"
                value={formData.companyPAN}
                disabled={isEditMode && !isEditable}
                onChange={(e) =>
                  handleInputChange("companyPAN")({
                    target: { value: e.target.value.toUpperCase() },
                  })
                }
                placeholder="Ex: ABCDE1234F"
                inputProps={{ maxLength: 10 }}
                error={!!errors.companyPAN}
                helperText={errors.companyPAN}
              />
            </FormRow>

            <FormRow>
              <TextField
                select
                label="Legal Status *"
                value={formData.legalStatus}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("legalStatus")}
                error={!!errors.legalStatus}
                helperText={errors.legalStatus}
              >
                <MenuItem value="Private Limited">Private Limited</MenuItem>
                <MenuItem value="LLP">LLP</MenuItem>
                <MenuItem value="Partnership">Partnership</MenuItem>
                <MenuItem value="Sole Proprietorship">
                  Sole Proprietorship
                </MenuItem>
              </TextField>
              <TextField
                label="Date of Establishment *"
                type="date"
                value={formData.dateOfEstablishment}
                disabled={isEditMode && !isEditable}
                InputLabelProps={{ shrink: true }}
                onChange={handleInputChange("dateOfEstablishment")}
                error={!!errors.dateOfEstablishment}

                inputProps={{ min: twoYearsAgo, max: today }}
              />
              <TextField
                select
                label="Primary Sector *"
                value={formData.primarySector}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("primarySector")}
                error={!!errors.primarySector}
                helperText={errors.primarySector}
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
              <TextField
                select
                label="Secondary Sector"
                value={formData.secondarySector}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("secondarySector")}
                helperText="Optional focus area"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="HealthTech">HealthTech</MenuItem>
                <MenuItem value="FinTech">FinTech</MenuItem>
                <MenuItem value="EdTech">EdTech</MenuItem>
                <MenuItem value="AI / ML">AI / ML</MenuItem>
              </TextField>
            </FormRow>

            <FormRow>
              <TextField
                label="Current Team Size *"
                type="number"
                value={formData.currentTeamSize}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("currentTeamSize")}
                placeholder="Total Employees Excl. Founders"
                error={!!errors.currentTeamSize}
                helperText={errors.currentTeamSize}
              />
              <TextField
                label="Male Employees *"
                type="number"
                value={formData.maleCount}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("maleCount")}
                error={!!errors.maleCount}
                helperText={errors.maleCount}
                placeholder="Number of Male Staff"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Female Employees *"
                type="number"
                value={formData.femaleCount}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("femaleCount")}
                error={!!errors.femaleCount}
                helperText={errors.femaleCount}
                placeholder="Number of Female Staff"
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Number of Branches *"
                type="number"
                value={formData.numberOfBranches}
                disabled={isEditMode && !isEditable}
                onChange={handleBranchCountChange}
                error={!!errors.numberOfBranches}
                helperText={errors.numberOfBranches}
                inputProps={{ min: 1, max: 20 }}
              />
              <TextField
                label="Company Website"
                value={formData.companyWebsite}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("companyWebsite")}
                placeholder="Ex: https://www.startup.com"
              />
            </FormRow>
          </CardContent>
        </Card>

        {/* --- SECTION: BRANCH ADDRESSES --- */}
        {formData.branchAddresses.map((address, index) => {
          const currentLists = {
            states: addressArrays[index]?.states || [],
            districts: addressArrays[index]?.districts || [],
            cities: addressArrays[index]?.cities || [],
          };

          return (
            <Card key={index} sx={{ mb: 3, border: "2px solid #1f4d3a" }}>
              <Box
                sx={{
                  backgroundColor: "#1f4d3a",
                  color: "white",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  {`Registered Office Address ${index + 1}`}{" "}
                  {address.isPrimary ? "(Main)" : ""}
                </Typography>
                {!address.isPrimary && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSetMainAddress(index)}
                    sx={{
                      backgroundColor: "white",
                      color: "#1f4d3a",
                      "&:hover": { backgroundColor: "#e0e0e0" },
                    }}
                  >
                    Set as Main
                  </Button>
                )}
              </Box>
              <CardContent sx={{ p: 3 }}>
                <FormRow>
                  <TextField
                    select
                    label="Country *"
                    value={address.country}
                    onChange={(e) => handleCountryChange(index, e)}
                    disabled={
                      (isEditMode && !isEditable) || isLoading.countries
                    }
                    error={!!errors[`address_${index}_country`]}
                    helperText={
                      errors[`address_${index}_country`] ? "Required" : ""
                    }
                  >
                    {countryList.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="State *"
                    value={
                      currentLists.states.includes(address.state)
                        ? address.state
                        : ""
                    }
                    onChange={(e) => handleStateChange(index, e)}
                    disabled={
                      (isEditMode && !isEditable) ||
                      !address.country ||
                      isLoading.states
                    }
                    error={!!errors[`address_${index}_state`]}
                    helperText={
                      errors[`address_${index}_state`] ? "Required" : ""
                    }
                  >
                    {currentLists.states.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="District *"
                    value={
                      currentLists.districts.includes(address.district)
                        ? address.district
                        : ""
                    }
                    onChange={(e) => handleDistrictChange(index, e)}
                    disabled={
                      (isEditMode && !isEditable) ||
                      !address.state ||
                      isLoading.districts
                    }
                    error={!!errors[`address_${index}_district`]}
                    helperText={
                      errors[`address_${index}_district`] ? "Required" : ""
                    }
                  >
                    {currentLists.districts.map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </TextField>
                  {address.country === "India" ? (
                    <TextField
                      select
                      label="City *"
                      value={
                        currentLists.cities.some((c) => c.name === address.city)
                          ? address.city
                          : ""
                      }
                      onChange={(e) => handleCityChange(index, e)}
                      disabled={
                        (isEditMode && !isEditable) ||
                        !address.district ||
                        isLoading.cities
                      }
                      error={!!errors[`address_${index}_city`]}
                      helperText={errors[`address_${index}_city`] || ""}
                    >
                      {currentLists.cities.map((c, i) => (
                        <MenuItem key={`${c.name}-${i}`} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      label="City *"
                      value={address.city}
                      disabled={isEditMode && !isEditable}
                      onChange={(e) =>
                        handleAddressFieldChange(index, "city", e.target.value)
                      }
                      placeholder="Enter City Name"
                      error={!!errors[`address_${index}_city`]}
                      helperText={
                        errors[`address_${index}_city`] ? "Required" : ""
                      }
                    />
                  )}
                </FormRow>
                <FormRow>
                  <TextField
                    label="Area / Locality *"
                    value={address.area}
                    disabled={isEditMode && !isEditable}
                    onChange={(e) =>
                      handleAddressFieldChange(index, "area", e.target.value)
                    }
                    placeholder="Enter locality details"
                    error={!!errors[`address_${index}_area`]}
                    helperText={
                      errors[`address_${index}_area`]
                        ? "Area / Locality is required"
                        : ""
                    }
                  />
                  <TextField
                    label="Pin Code *"
                    value={address.pinCode}
                    disabled={isEditMode && !isEditable}
                    onChange={(e) =>
                      handleAddressFieldChange(index, "pinCode", e.target.value)
                    }
                    placeholder="Ex: 110001"
                    error={!!errors[`address_${index}_pinCode`]}
                    helperText={
                      errors[`address_${index}_pinCode`] ? "Required" : ""
                    }
                  />
                </FormRow>
                <FormRow>
                  <TextField
                    label="Full Address (Street / Building / Door No) *"
                    multiline
                    rows={2}
                    value={address.fullAddress}
                    disabled={isEditMode && !isEditable}
                    onChange={(e) =>
                      handleAddressFieldChange(
                        index,
                        "fullAddress",
                        e.target.value,
                      )
                    }
                    placeholder="Enter detailed street address"
                    error={!!errors[`address_${index}_fullAddress`]}
                    helperText={
                      errors[`address_${index}_fullAddress`]
                        ? "Full Address is required"
                        : ""
                    }
                  />
                </FormRow>
              </CardContent>
            </Card>
          );
        })}

        {/* --- SECTION: PERSONAL INFORMATION --- */}
        <Card sx={{ mb: 3, border: "2px solid #1f4d3a" }}>
          <Box sx={{ backgroundColor: "#1f4d3a", color: "white", p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Personal Information
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <FormRow>
              <TextField
                label="First Name *"
                value={formData.firstName}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName}
                placeholder="Applicant First Name"
              />
              <TextField
                label="Last Name *"
                value={formData.lastName}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName}
                placeholder="Applicant Last Name"
              />
              <TextField
                label="Email Address *"
                type="email"
                value={formData.email}
                disabled={isEditMode}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange("email")(e);
                  if (val && !EMAIL_REGEX.test(val))
                    setErrors((prev) => ({
                      ...prev,
                      email: "Enter a valid email address",
                    }));
                }}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="Ex: name@gmail.com"
              />
            </FormRow>
            <FormRow>
              <TextField
                label="Phone Number *"
                value={formData.phone}
                disabled={isEditMode && !isEditable}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    phone: e.target.value.replace(/\D/g, ""),
                  }))
                }
                inputProps={{ maxLength: 10 }}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="10-digit mobile number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Select
                        value={formData.phoneCountry}
                        disabled={isEditMode && !isEditable}
                        onChange={handlePhoneCountryChange}
                        variant="standard"
                        disableUnderline
                      >
                        {PHONE_COUNTRIES.map((c) => (
                          <MenuItem key={c.name} value={c.name}>
                            {c.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="LinkedIn Profile URL"
                value={formData.linkedin}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("linkedin")}
                placeholder="Ex: https://linkedin.com/in/username"
              />
              <TextField
                label="Date of Birth *"
                type="date"
                value={formData.dateOfBirth}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("dateOfBirth")}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                inputProps={{ max: today }}
              />
            </FormRow>
            <FormRow>
              <TextField
                label="Designation *"
                value={formData.designation}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("designation")}
                error={!!errors.designation}
                helperText={errors.designation}
                placeholder="Ex: CEO / Managing Director"
                sx={{ flex: 1 }}
              />
              <FormControl component="fieldset" error={!!errors.gender}>
                <FormLabel component="legend" sx={{ fontSize: "14px" }}>
                  Gender *
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.gender}
                  onChange={handleInputChange("gender")}
                >
                  <FormControlLabel
                    value="Male"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Others"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Others"
                  />
                </RadioGroup>
                {errors.gender && (
                  <FormHelperText>{errors.gender}</FormHelperText>
                )}
              </FormControl>
            </FormRow>
          </CardContent>
        </Card>

        {/* --- SECTION: FOUNDER DETAILS --- */}
        <Card sx={{ mb: 3, border: "2px solid #1f4d3a" }}>
          <Box sx={{ backgroundColor: "#1f4d3a", color: "white", p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Founder Details
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <FormRow>
              <TextField
                label="Founder First Name *"
                value={formData.founderFirstName}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("founderFirstName")}
                error={!!errors.founderFirstName}
                helperText={errors.founderFirstName}
                placeholder="First Name"
              />
              <TextField
                label="Founder Last Name *"
                value={formData.founderLastName}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("founderLastName")}
                error={!!errors.founderLastName}
                helperText={errors.founderLastName}
                placeholder="Last Name"
              />
              <TextField
                label="Founder Email *"
                type="email"
                value={formData.founderEmail}
                disabled={isEditMode && !isEditable}
                onChange={(e) => {
                  const val = e.target.value;
                  handleInputChange("founderEmail")(e);
                  if (val && !EMAIL_REGEX.test(val))
                    setErrors((prev) => ({
                      ...prev,
                      founderEmail: "Enter a valid email",
                    }));
                }}
                error={!!errors.founderEmail}
                helperText={errors.founderEmail}
                placeholder="Ex: founder@startup.com"
              />
            </FormRow>
            <FormRow>
              <TextField
                label="Founder Phone Number *"
                value={formData.founderPhone}
                disabled={isEditMode && !isEditable}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    founderPhone: e.target.value.replace(/\D/g, ""),
                  }))
                }
                inputProps={{ maxLength: 10 }}
                error={!!errors.founderPhone}
                helperText={errors.founderPhone}
                placeholder="Mobile number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Select
                        value={formData.founderPhoneCountry}
                        disabled={isEditMode && !isEditable}
                        onChange={(e) => {
                          const sel = PHONE_COUNTRIES.find(
                            (c) => c.name === e.target.value,
                          );
                          setFormData((p) => ({
                            ...p,
                            founderPhoneCountry: sel.name,
                            founderPhoneCode: sel.code,
                            founderPhone: "",
                          }));
                        }}
                        variant="standard"
                        disableUnderline
                      >
                        {PHONE_COUNTRIES.map((c) => (
                          <MenuItem key={c.name} value={c.name}>
                            {c.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Founder LinkedIn Profile"
                value={formData.founderLinkedIn}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("founderLinkedIn")}
                placeholder="LinkedIn Profile URL"
              />
              <TextField
                label="Founder Facebook Profile"
                value={formData.founderFacebook}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("founderFacebook")}
                placeholder="Facebook Profile URL"
              />
            </FormRow>
            <FormRow>
              <TextField
                label="Founder Date of Birth *"
                type="date"
                value={formData.founderDOB}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("founderDOB")}
                InputLabelProps={{ shrink: true }}
                error={!!errors.founderDOB}
                helperText={errors.founderDOB}
                inputProps={{ max: today }}
              />
              <FormControl
                component="fieldset"
                error={!!errors.founderGender}
                sx={{ minWidth: 250 }}
              >
                <FormLabel component="legend" sx={{ fontSize: "14px" }}>
                  Founder Gender *
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.founderGender}
                  onChange={handleInputChange("founderGender")}
                >
                  <FormControlLabel
                    value="Male"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Others"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Others"
                  />
                </RadioGroup>
                {errors.founderGender && (
                  <FormHelperText>{errors.founderGender}</FormHelperText>
                )}
              </FormControl>
            </FormRow>
          </CardContent>
        </Card>

        {/* --- SECTION: OPPORTUNITIES --- */}
        <Card sx={{ mb: 3, border: "2px solid #1f4d3a" }}>
          <Box sx={{ backgroundColor: "#1f4d3a", color: "white", p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Opportunities for Students / Job Seekers
            </Typography>
          </Box>
          <CardContent sx={{ px: 4, py: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                columnGap: 6,
                rowGap: 4,
              }}
            >
              <FormControl error={!!errors.placementOffered}>
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Do you offer Placements?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.placementOffered}
                  onChange={handleInputChange("placementOffered")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
                {errors.placementOffered && (
                  <FormHelperText>{errors.placementOffered}</FormHelperText>
                )}
              </FormControl>
              {formData.placementOffered === "Yes" && (
                <FormControl error={!!errors.placementType}>
                  <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                    Placement Type
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.placementType}
                    onChange={handleInputChange("placementType")}
                  >
                    <FormControlLabel
                      value="On-Campus"
                      disabled={isEditMode && !isEditable}
                      control={<Radio />}
                      label="On-Campus"
                    />
                    <FormControlLabel
                      value="Off-Campus"
                      disabled={isEditMode && !isEditable}
                      control={<Radio />}
                      label="Off-Campus"
                    />
                    <FormControlLabel
                      value="Both"
                      disabled={isEditMode && !isEditable}
                      control={<Radio />}
                      label="Both"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              <FormControl error={!!errors.internshipOffered}>
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Do you provide Internships?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.internshipOffered}
                  onChange={handleInputChange("internshipOffered")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              {formData.internshipOffered === "Yes" && (
                <FormControl error={!!errors.internshipType}>
                  <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                    Internship Type
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.internshipType}
                    onChange={handleInputChange("internshipType")}
                  >
                    <FormControlLabel
                      value="Paid"
                      disabled={isEditMode && !isEditable}
                      control={<Radio />}
                      label="Paid"
                    />
                    <FormControlLabel
                      value="Unpaid"
                      disabled={isEditMode && !isEditable}
                      control={<Radio />}
                      label="Unpaid"
                    />
                    <FormControlLabel
                      value="Performance-Based"
                      disabled={isEditMode && !isEditable}
                      control={<Radio />}
                      label="Performance"
                    />
                  </RadioGroup>
                </FormControl>
              )}
              <FormControl error={!!errors.trainingOffered}>
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Do you offer Training / Apprenticeship?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.trainingOffered}
                  onChange={handleInputChange("trainingOffered")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              {formData.trainingOffered === "Yes" && (
                <FormControl>
                  <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                    Program Type
                  </FormLabel>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 4,
                      flexWrap: "nowrap",
                      alignItems: "center",
                    }}
                  >
                    {[
                      "Industrial Training",
                      "Apprenticeship",
                      "Skill Development",
                    ].map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={formData.trainingType.includes(option)}
                            disabled={isEditMode && !isEditable}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => ({
                                ...prev,
                                trainingType: checked
                                  ? [...prev.trainingType, option]
                                  : prev.trainingType.filter(
                                    (v) => v !== option,
                                  ),
                              }));
                            }}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </Box>
                </FormControl>
              )}
              <FormControl
                sx={{ gridColumn: { md: "span 2" } }}
                error={!!errors.fypOffered}
              >
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Do you provide Final Year Projects?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.fypOffered}
                  onChange={handleInputChange("fypOffered")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
                {errors.fypOffered && (
                  <FormHelperText>{errors.fypOffered}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* --- SECTION: REQUIREMENTS --- */}
        <Card sx={{ mb: 3, border: "2px solid #1f4d3a" }}>
          <Box sx={{ backgroundColor: "#1f4d3a", color: "white", p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Startup Requirements
            </Typography>
          </Box>
          <CardContent sx={{ px: 4, py: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                columnGap: 6,
                rowGap: 4,
              }}
            >
              <FormControl error={!!errors.fundingNeeded}>
                <FormLabel sx={{ mb: 1, fontSize: "14px", textAlign: "left" }}>
                  Funding Needed ?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.fundingNeeded}
                  onChange={handleInputChange("fundingNeeded")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl error={!!errors.mentorshipNeeded}>
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Mentorship Needed ?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.mentorshipNeeded}
                  onChange={handleInputChange("mentorshipNeeded")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl error={!!errors.technologySupport}>
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Technology Support Needed ?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.technologySupport}
                  onChange={handleInputChange("technologySupport")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl error={!!errors.incubationSpace}>
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Do you require Incubation / Co-working Space ?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.incubationSpace}
                  onChange={handleInputChange("incubationSpace")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl
                sx={{ gridColumn: { md: "span 2" } }}
                error={!!errors.registrationNeeded}
              >
                <FormLabel sx={{ mb: 1, textAlign: "left" }}>
                  Registration Needed ?
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.registrationNeeded}
                  onChange={handleInputChange("registrationNeeded")}
                >
                  <FormControlLabel
                    value="Yes"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="No"
                    disabled={isEditMode && !isEditable}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                multiline
                rows={3}
                label="Internship interest"
                value={formData.supportInterest || ""}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("supportInterest")}
                placeholder="Briefly describe your interest in providing internship support"
              />
              <TextField
                multiline
                rows={3}
                label="Govt schemes eligibility"
                value={formData.governmentSchemes || ""}
                disabled={isEditMode && !isEditable}
                onChange={handleInputChange("governmentSchemes")}
                placeholder="List specific schemes you are interested in checking eligibility for"
              />
            </Box>
          </CardContent>
        </Card>

        {/* --- SECTION: SUBMIT BUTTONS --- */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {isEditMode && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
          {isEditMode && isEditable && (
            <Button
              variant="outlined"
              onClick={() => {
                setFormData(originalData);
                setIsEditable(false);
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1f4d3a",
              "&:hover": {
                backgroundColor: "#173b2d",
              },
            }}
            onClick={handleSubmit}
            disabled={isEditMode && !isEditable}
          >
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
