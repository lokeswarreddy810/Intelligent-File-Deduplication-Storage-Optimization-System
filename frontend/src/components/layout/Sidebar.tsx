import {
  AssessmentOutlined,
  DashboardOutlined,
  DescriptionOutlined,
  FolderCopyOutlined,
  HistoryOutlined
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { colors } from "../../theme/colors";

const drawerWidth = 250;

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlined />
  },
  {
    label: "Files",
    path: "/files",
    icon: <DescriptionOutlined />
  },
  {
    label: "Duplicates",
    path: "/duplicates",
    icon: <FolderCopyOutlined />
  },
  {
    label: "Deletion History",
    path: "/deletion-history",
    icon: <HistoryOutlined />
  },
  {
    label: "Audit Logs",
    path: "/audit-logs",
    icon: <AssessmentOutlined />
  }
];

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: {
          xs: "none",
          md: "block"
        },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: colors.sidebar,
          borderRight: `1px solid ${colors.border}`
        }
      }}
    >
      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          px: 3
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em"
            }}
          >
            FileGuard
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Storage Optimization
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, py: 2 }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              color: "text.secondary",
              "& .MuiListItemIcon-root": {
                color: "inherit",
                minWidth: 42
              },
              "&.active": {
                color: "#FFFFFF",
                backgroundColor: "rgba(99, 102, 241, 0.18)"
              },
              "&.active .MuiListItemIcon-root": {
                color: colors.primary
              },
              "&:hover": {
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                color: "#FFFFFF"
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: "0.9rem",
                    fontWeight: 600
                  }
                }
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;