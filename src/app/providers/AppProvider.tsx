import { type ReactNode } from "react";
import { AppThemeProvider } from "../../shared/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "../../shared/context/SnackbarContext";

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};
