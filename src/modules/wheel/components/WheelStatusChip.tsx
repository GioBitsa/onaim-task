import { Chip } from "@mui/material";
import type { Wheel } from "../types/wheel.types";

interface WheelStatusChipProps {
  status: Wheel["status"];
}

const statusConfig: Record<
  Wheel["status"],
  { label: string; color: "default" | "success" | "warning" }
> = {
  active: {
    label: "Active",
    color: "success",
  },
  draft: {
    label: "Draft",
    color: "warning",
  },
  inactive: {
    label: "Inactive",
    color: "default",
  },
};

export const WheelStatusChip = ({ status }: WheelStatusChipProps) => {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 500,
        textTransform: "capitalize",
      }}
    />
  );
};
