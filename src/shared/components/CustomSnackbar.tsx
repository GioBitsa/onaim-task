import { Alert, Snackbar } from "@mui/material";

interface CustomSnackbarProps {
  state: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  };
  onClose: () => void;
}

const CustomSnackbar = ({
  state: { open, message, severity },
  onClose,
}: CustomSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
