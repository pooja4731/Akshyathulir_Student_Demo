import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Api from "../pages/api";

function Ads({ page }) {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);

  const currentAd = ads[currentAdIndex];

  /* FETCH ADS FROM BACKEND */
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const email = localStorage.getItem("userEmail");

        const res = await Api.get(`/ads/${email}/${page}`);

        setAds(res.data);

        if (res.data.length > 0) {
          setShowAd(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAds();
  }, [page]);

  /* ROTATE ADS EVERY 10s */
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      setShowAd(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [ads]);

  if (!currentAd) return null;

  return (
    <Slide direction="left" in={showAd} mountOnEnter unmountOnExit>
      <Card
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 340,
          zIndex: 999,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <CardContent sx={{ p: 0, position: "relative" }}>
          
          {/* Close Button */}
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "#fff",
            }}
            onClick={() => setShowAd(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Ad Image */}
          <Box
            component="img"
            src={currentAd.image}
            alt="ad"
            sx={{
              width: "100%",
              height: 170,
              objectFit: "cover",
            }}
          />

          {/* Ad Content */}
          <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography fontWeight="bold">
                {currentAd.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {currentAd.description}
              </Typography>

              <Button
                size="small"
                variant="contained"
                href={currentAd.link}
                sx={{
                  mt: 1,
                  backgroundColor: "#1f4d3a",
                  "&:hover": { backgroundColor: "#1f4d3a" },
                }}
              >
                {currentAd.button}
              </Button>
            </Stack>
          </Box>

        </CardContent>
      </Card>
    </Slide>
  );
}

export default Ads;