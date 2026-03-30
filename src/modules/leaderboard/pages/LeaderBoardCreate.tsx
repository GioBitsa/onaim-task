import { useNavigate } from "react-router-dom";
import {
  Stack,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  leaderboardSchema,
  type LeaderboardFormValues,
} from "../schemas/leaderboard.schema";
import { useSnackbar } from "../../../shared/context/SnackbarContext";
import { useLeaderboards } from "../hooks/useLeaderboards";

const LeaderBoardCreate = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { createMutation } = useLeaderboards();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LeaderboardFormValues>({
    resolver: zodResolver(leaderboardSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "draft",
      scoringType: "points",
      maxParticipants: 2,
      prizes: [
        {
          id: crypto.randomUUID(),
          rank: 1,
          name: "",
          type: "coins",
          amount: 0,
          imageUrl: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes",
  });

  const onSubmit = async (data: LeaderboardFormValues) => {
    try {
      const payload = {
        ...data,
        description: data.description ?? "",
      };

      await createMutation.mutateAsync(payload);

      showSnackbar("Leaderboard created successfully", "success");
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

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={600}>
        Create Leaderboard
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
              <TextField
                fullWidth
                select
                label="Status"
                {...register("status")}
                error={!!errors.status}
                helperText={errors.status?.message && "Please choose status"}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>

              <TextField
                fullWidth
                select
                label="Scoring Type"
                {...register("scoringType")}
              >
                <MenuItem value="points">Points</MenuItem>
                <MenuItem value="wins">Wins</MenuItem>
                <MenuItem value="wagered">Wagered</MenuItem>
              </TextField>
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

            {errors.prizes && (
              <Typography color="error" variant="body2">
                {errors.prizes.message}
              </Typography>
            )}

            {fields.map((field, index) => (
              <Paper
                key={field.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #eee",
                }}
              >
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Rank"
                      type="number"
                      {...register(`prizes.${index}.rank`, {
                        valueAsNumber: true,
                      })}
                      error={
                        !!errors.prizes?.[index]?.rank || !!errors.prizes?.root
                      }
                      helperText={
                        errors.prizes?.[index]?.rank?.message ||
                        errors.prizes?.root?.message
                      }
                    />

                    <TextField
                      fullWidth
                      label="Name"
                      {...register(`prizes.${index}.name`)}
                      error={!!errors.prizes?.[index]?.name}
                      helperText={errors.prizes?.[index]?.name?.message}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      select
                      label="Type"
                      {...register(`prizes.${index}.type`)}
                      error={!!errors.prizes?.[index]?.type}
                      helperText={
                        errors.prizes?.[index]?.type?.message &&
                        "Please choose prize type"
                      }
                    >
                      <MenuItem value="coins">Coins</MenuItem>
                      <MenuItem value="freeSpin">Free Spin</MenuItem>
                      <MenuItem value="bonus">Bonus</MenuItem>
                    </TextField>

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

                  <Stack direction={"row"} spacing={2}>
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
              <Button
                onClick={handleCancel}
                sx={{ textTransform: "capitalize" }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ textTransform: "capitalize" }}
              >
                Create Leaderboard
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
};

export default LeaderBoardCreate;
