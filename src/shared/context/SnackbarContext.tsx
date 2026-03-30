// SnackbarContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import CustomSnackbar from "../components/CustomSnackbar";

type SnackbarType = "success" | "error" | "info" | "warning";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: SnackbarType;
};

type SnackbarContextType = {
  showSnackbar: (message: string, severity?: SnackbarType) => void;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message: string,
    severity: SnackbarType = "success"
  ) => {
    setState({ open: true, message, severity });
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* GLOBAL SNACKBAR UI */}
      <CustomSnackbar state={state} onClose={handleClose} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }
  return context;
};
