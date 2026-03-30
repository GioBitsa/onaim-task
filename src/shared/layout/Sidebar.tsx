import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Raffle", path: "/raffle" },
  { label: "Wheel", path: "/wheel" },
];

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const content = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          OnAim
        </Typography>
      </Box>

      {/* MENU */}
      <Box sx={{ p: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: isActive ? "action.selected" : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* SPACER */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* BOTTOM SECTION */}
      <Box sx={{ p: 1 }}>
        <List>
          <ListItemButton
            sx={{
              borderRadius: 1,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ListItemText primary="Settings" />
          </ListItemButton>

          <ListItemButton
            sx={{
              borderRadius: 1,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ListItemText primary="Help" />
          </ListItemButton>
        </List>

        {/* ACCOUNT CARD */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mt: 1,
            p: 1.5,
            borderRadius: 1,
            backgroundColor: "background.default",
          }}
        >
          <Avatar sx={{ width: 36, height: 36 }} />

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Giorgi Bitsadze
            </Typography>
            <Typography variant="caption" color="text.secondary">
              giorgi.bitsadze01@gmail.com
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
        }}
      >
        {content}
      </Box>

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
};
