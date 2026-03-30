import { Box } from "@mui/material";
import type { WheelSegment } from "../types/wheel.types";

type WheelPreviewSegment = Omit<WheelSegment, "id">;

interface Props {
  segments: WheelPreviewSegment[];
}

const WheelPreview = ({ segments }: Props) => {
  const total = segments.reduce((sum, s) => sum + s.weight, 0);

  let currentAngle = 0;

  const gradients = segments
    .map((segment) => {
      const angle = (segment.weight / total) * 360;
      const start = currentAngle;
      const end = currentAngle + angle;
      currentAngle += angle;

      return `${segment.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <Box
      sx={{
        width: 250,
        height: 250,
        borderRadius: "50%",
        border: "6px solid",
        borderColor: "black",
        background: `conic-gradient(${gradients})`,
      }}
    />
  );
};

export default WheelPreview;
