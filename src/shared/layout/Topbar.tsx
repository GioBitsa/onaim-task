import {
  AppBar,
  Box,
  Breadcrumbs,
  breadcrumbsClasses,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { IconButton } from "@mui/material";
import { useThemeMode } from "../theme/ThemeProvider";
import { useLocation } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { mode, toggleTheme } = useThemeMode();

  const location = useLocation();

  const getPageTitle = () => {
    const segment = location.pathname.split("/")[1]; // "leaderboard" from "/leaderboard/edit"

    if (!segment) return "Home";

    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={onMenuClick} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>

          <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
          >
            <Typography variant="body1">Dashboard</Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {getPageTitle()}
            </Typography>
          </StyledBreadcrumbs>
        </Box>

        <IconButton
          onClick={toggleTheme}
          color="inherit"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 1,
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));
