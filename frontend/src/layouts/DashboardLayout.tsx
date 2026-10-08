import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 32%), #0B1120"
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Header />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: {
              xs: 2,
              sm: 3,
              md: 4
            }
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;