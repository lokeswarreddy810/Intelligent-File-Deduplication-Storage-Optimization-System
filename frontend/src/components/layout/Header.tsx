import {
  AccountCircleOutlined,
  NotificationsNoneOutlined
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";

function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(11, 17, 32, 0.82)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider"
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700
            }}
          >
            Intelligent File Deduplication
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Storage optimization platform
          </Typography>
        </Box>

        <IconButton color="inherit">
          <NotificationsNoneOutlined />
        </IconButton>

        <Avatar
          sx={{
            width: 38,
            height: 38,
            ml: 1,
            backgroundColor: "primary.main"
          }}
        >
          <AccountCircleOutlined />
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}

export default Header;