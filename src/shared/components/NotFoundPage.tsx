import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3">404</Typography>
      <Typography variant="h6" mt={2}>
        Page Not Found
      </Typography>

      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Box>
  );
};
