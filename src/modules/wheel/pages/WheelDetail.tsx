import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { useWheels } from "../hooks/useWheels";
import WheelPreview from "../components/WheelPreview";
import { useNavigate, useParams } from "react-router-dom";

const WheelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detailQuery, deleteMutation, updateMutation } = useWheels();

  const { data: wheel, isLoading } = detailQuery(id!);

  const handleDelete = () => {
    if (!id) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate("/wheels");
      },
    });
  };

  const handleToggleStatus = () => {
    if (!wheel || !id) return;

    const newStatus = wheel.status === "active" ? "inactive" : "active";

    updateMutation.mutate({
      id,
      payload: { ...wheel, status: newStatus },
    });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!wheel) {
    return <Typography>Wheel not found</Typography>;
  }

  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">{wheel.name}</Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/wheel/edit/${id}`)}
          >
            Edit
          </Button>

          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* STATUS */}
      <Stack direction="row" spacing={1} mt={2}>
        <Chip label={wheel.status} color="primary" />
        <Chip label={`Spin Cost: ${wheel.spinCost}`} />
        <Chip label={`Max Spins: ${wheel.maxSpinsPerUser}`} />
      </Stack>

      {/* DESCRIPTION */}
      <Box mt={2}>
        <Typography variant="body1">
          {wheel.description || "No description"}
        </Typography>
      </Box>

      {/* ACTION */}
      <Box mt={2}>
        <Button variant="outlined" onClick={handleToggleStatus}>
          {wheel.status === "active" ? "Deactivate" : "Activate"}
        </Button>
      </Box>

      {/* SEGMENTS */}
      <Box mt={4}>
        <Typography variant="h6">Segments</Typography>

        <Stack spacing={1} mt={2}>
          {wheel.segments.map((segment) => (
            <Box key={segment.id} display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: segment.color,
                }}
              />

              <Typography>{segment.label}</Typography>

              <Chip label={segment.prizeType} size="small" />

              <Typography>Weight: {segment.weight}</Typography>

              <Typography>Prize: {segment.prizeAmount}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* PREVIEW */}
      <Box mt={4}>
        <Typography variant="h6">Preview</Typography>

        <WheelPreview segments={wheel.segments} />
      </Box>
    </Box>
  );
};

export default WheelDetail;
