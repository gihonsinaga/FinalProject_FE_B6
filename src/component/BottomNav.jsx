import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";
import { useSelector } from "react-redux";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";

export default function BottomNav() {
  const [value, setValue] = React.useState("Beranda");
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    // Update value based on the current path
    if (location.pathname === "/history" && isLogin) {
      setValue("Riwayat");
    } else if (location.pathname === "/") {
      setValue("Beranda");
    } else if (location.pathname === "/notifikasi" && isLogin) {
      setValue("Notifikasi");
    } else if (
      location.pathname === "/profile" ||
      location.pathname === "/login"
    ) {
      setValue("Profil");
    } else if (location.pathname === "/about-us") {
      setValue("About Us");
    } else if (location.pathname === "/plane") {
      setValue("Pesawat");
    }
  }, [location.pathname, isLogin]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "Riwayat" && isLogin) {
      navigate("/history");
    } else if (newValue === "Beranda") {
      navigate("/");
    } else if (newValue === "Notifikasi" && isLogin) {
      navigate("/notifikasi");
    } else if (newValue === "Profil") {
      navigate(isLogin ? "/profile" : "/login");
    } else if (newValue === "About Us") {
      navigate("/about-us");
    } else if (newValue === "Pesawat") {
      navigate("/plane");
    }
  };

  const loggedInNav = (
    <BottomNavigation
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        label="Beranda"
        value="Beranda"
        icon={<HomeIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
      <BottomNavigationAction
        label="Riwayat"
        value="Riwayat"
        icon={<HistoryIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
      <BottomNavigationAction
        label="Notifikasi"
        value="Notifikasi"
        icon={<NotificationsIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
      <BottomNavigationAction
        label="Profil"
        value="Profil"
        icon={<PersonIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
    </BottomNavigation>
  );

  const loggedOutNav = (
    <BottomNavigation
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        label="Beranda"
        value="Beranda"
        icon={<HomeIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
      <BottomNavigationAction
        label="Pesawat"
        value="Pesawat"
        icon={<AirplanemodeActiveIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
      <BottomNavigationAction
        label="About Us"
        value="About Us"
        icon={<HelpIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
      <BottomNavigationAction
        label="Masuk"
        value="Profil"
        icon={<PersonIcon sx={{ fontSize: "20px" }} />}
        sx={{
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.65rem !important",
          },
        }}
      />
    </BottomNavigation>
  );

  return <div>{isLogin ? loggedInNav : loggedOutNav}</div>;
}
