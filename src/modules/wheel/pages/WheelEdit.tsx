import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WheelPreview from "../components/WheelPreview";
import { wheelSchema, type WheelFormValues } from "../schemas/wheel.schema";
import { useWheels } from "../hooks/useWheels";
import WheelSegment from "../components/WheelSegment";
import { useSnackbar } from "../../../shared/context/SnackbarContext";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const WheelEdit = () => {
  const navigate = useNavigate();
  const { id: wheelId } = useParams<{ id: string }>();

  if (!wheelId) {
    return <Typography>Invalid wheel ID</Typography>;
  }

  const { detailQuery, updateMutation } = useWheels();
  const { showSnackbar } = useSnackbar();

  const { data: wheel, isLoading } = detailQuery(wheelId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<WheelFormValues>({
    resolver: zodResolver(wheelSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "draft",
      spinCost: 0,
      maxSpinsPerUser: 1,
      backgroundColor: "#ffffff",
      borderColor: "#000000",
      segments: [],
    },
  });

  const segments = watch("segments");

  // ✅ Populate form when data is loaded
  useEffect(() => {
    if (wheel) {
      reset({
        ...wheel,
        description: wheel.description ?? "",
      });
    }
  }, [wheel, reset]);

  const onSubmit = (data: WheelFormValues) => {
    try {
      updateMutation.mutate({
        id: wheelId,
        payload: {
          ...data,
          description: data.description ?? "",
          segments: data.segments.map((segment) => ({
            ...segment,
            id: crypto.randomUUID(),
          })),
        },
      });

      showSnackbar("Wheel updated successfully", "success");
      navigate("/wheel");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      showSnackbar(message, "error");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack direction={{ xs: "column-reverse", md: "row" }} spacing={2}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h5">Edit Wheel</Typography>

        <TextField
          label="Name"
          fullWidth
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Description"
          fullWidth
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <TextField
          select
          label="Status"
          {...register("status")}
          error={!!errors.status}
          helperText={errors.status?.message}
        >
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>

        <TextField
          type="number"
          label="Spin Cost"
          {...register("spinCost", { valueAsNumber: true })}
          error={!!errors.spinCost}
          helperText={errors.spinCost?.message}
        />

        <TextField
          type="number"
          label="Max Spins"
          {...register("maxSpinsPerUser", { valueAsNumber: true })}
          error={!!errors.maxSpinsPerUser}
          helperText={errors.maxSpinsPerUser?.message}
        />

        <WheelSegment control={control} />

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={updateMutation.isPending}
        >
          Update
        </Button>
      </Stack>

      {/* PREVIEW */}
      <Stack sx={{ alignItems: "center" }}>
        <WheelPreview segments={segments} />
      </Stack>
    </Stack>
  );
};

export default WheelEdit;
