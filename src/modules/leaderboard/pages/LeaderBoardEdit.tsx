import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  leaderboardSchema,
  type LeaderboardFormValues,
} from "../schemas/leaderboard.schema";
import { useSnackbar } from "../../../shared/context/SnackbarContext";
import { useLeaderboards } from "../hooks/useLeaderboards";

const LeaderBoardEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { detailQuery, updateMutation } = useLeaderboards();

  const { data, isLoading, isError } = detailQuery(id!);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LeaderboardFormValues>({
    resolver: zodResolver(leaderboardSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes",
  });

  useEffect(() => {
    if (data) {
      console.log(data.status);
      reset({
        title: data.title,
        description: data.description ?? "",
        startDate: data.startDate.split("T")[0],
        endDate: data.endDate.split("T")[0],
        status: data.status,
        scoringType: data.scoringType,
        maxParticipants: data.maxParticipants,
        prizes: data.prizes.map((p) => ({
          ...p,
        })),
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: LeaderboardFormValues) => {
    try {
      const payload = {
        ...formData,
        description: formData.description ?? "",
      };

      await updateMutation.mutateAsync({
        id: id!,
        payload,
      });

      showSnackbar("Leaderboard updated successfully", "success");
      navigate("/leaderboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      showSnackbar(message, "error");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/leaderboard");
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="300px">
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !data) {
    return <Typography>Error loading leaderboard</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={600}>
        Edit Leaderboard
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* BASIC INFO */}
            <Typography variant="h6">Basic Info</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />

              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                {...register("maxParticipants", { valueAsNumber: true })}
                error={!!errors.maxParticipants}
                helperText={errors.maxParticipants?.message}
              />
            </Stack>

            <TextField
              label="Description"
              multiline
              rows={3}
              {...register("description")}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                {...register("startDate")}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />

              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                {...register("endDate")}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    value={field.value ?? "draft"}
                    label="Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="scoringType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    value={field.value ?? "points"}
                    label="Scoring Type"
                    error={!!errors.scoringType}
                    helperText={errors.scoringType?.message}
                  >
                    <MenuItem value="points">Points</MenuItem>
                    <MenuItem value="wins">Wins</MenuItem>
                    <MenuItem value="wagered">Wagered</MenuItem>
                  </TextField>
                )}
              />
            </Stack>

            <Divider />

            {/* PRIZES */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">Prizes</Typography>

              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  append({
                    id: crypto.randomUUID(),
                    rank: fields.length + 1,
                    name: "",
                    type: "coins",
                    amount: 0,
                    imageUrl: "",
                  })
                }
              >
                Add Prize
              </Button>
            </Stack>

            {fields.map((field, index) => (
              <Paper key={field.id} sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Rank"
                      type="number"
                      {...register(`prizes.${index}.rank`, {
                        valueAsNumber: true,
                      })}
                    />

                    <TextField
                      fullWidth
                      label="Name"
                      {...register(`prizes.${index}.name`)}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Controller
                      name={`prizes.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          value={field.value ?? "coins"}
                          label="Type"
                        >
                          <MenuItem value="coins">Coins</MenuItem>
                          <MenuItem value="freeSpin">Free Spin</MenuItem>
                          <MenuItem value="bonus">Bonus</MenuItem>
                        </TextField>
                      )}
                    />

                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      {...register(`prizes.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                      error={!!errors.prizes?.[index]?.amount}
                      helperText={errors.prizes?.[index]?.amount?.message}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      {...register(`prizes.${index}.imageUrl`)}
                    />

                    <IconButton
                      color="error"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            <Divider />

            {/* ACTIONS */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCancel}>Cancel</Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || updateMutation.isPending}
              >
                Update Leaderboard
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
};

export default LeaderBoardEdit;
