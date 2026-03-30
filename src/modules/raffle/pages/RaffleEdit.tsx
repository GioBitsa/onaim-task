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

import { raffleSchema, type RaffleFormValues } from "../schemas/raffle.schema";

import { useRaffles } from "../hooks/useRaffles";
import { useSnackbar } from "../../../shared/context/SnackbarContext";

const RaffleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { detailQuery, updateMutation } = useRaffles();
  const { data, isLoading, isError } = detailQuery(id!);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes",
  });

  // ❗ important rule
  const isLocked = data?.status === "drawn";

  // ------------------------
  // PREFILL
  // ------------------------
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        description: data.description ?? "",
        startDate: data.startDate.split("T")[0],
        endDate: data.endDate.split("T")[0],
        drawDate: data.drawDate.split("T")[0],
        status: data.status,
        ticketPrice: data.ticketPrice,
        maxTicketsPerUser: data.maxTicketsPerUser,
        totalTicketLimit: data.totalTicketLimit,
        prizes: data.prizes.map((p) => ({ ...p })),
      });
    }
  }, [data, reset]);

  // ------------------------
  // SUBMIT
  // ------------------------
  const onSubmit = async (formData: RaffleFormValues) => {
    if (isLocked) return;

    try {
      const payload = {
        ...formData,
        description: formData.description ?? "",
      };

      await updateMutation.mutateAsync({
        id: id!,
        payload,
      });

      showSnackbar("Raffle updated successfully", "success");
      navigate("/raffle");
    } catch {
      showSnackbar("Failed to update raffle", "error");
    }
  };

  // ------------------------
  // CANCEL
  // ------------------------
  const handleCancel = () => {
    if (isDirty && !isLocked) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Leave anyway?"
      );
      if (!confirmLeave) return;
    }
    navigate("/raffle");
  };

  // ------------------------
  // STATES
  // ------------------------
  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height={300}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !data) {
    return <Typography>Error loading raffle</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={600}>
        Edit Raffle
      </Typography>

      {isLocked && (
        <Typography color="error">
          This raffle is already drawn and cannot be edited.
        </Typography>
      )}

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* BASIC */}
            <Typography variant="h6">Basic Info</Typography>

            <TextField
              label="Name"
              disabled={isLocked}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              disabled={isLocked}
              {...register("description")}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                type="date"
                label="Start Date"
                disabled={isLocked}
                InputLabelProps={{ shrink: true }}
                {...register("startDate")}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />

              <TextField
                type="date"
                label="End Date"
                disabled={isLocked}
                InputLabelProps={{ shrink: true }}
                {...register("endDate")}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />

              <TextField
                type="date"
                label="Draw Date"
                disabled={isLocked}
                InputLabelProps={{ shrink: true }}
                {...register("drawDate")}
                error={!!errors.drawDate}
                helperText={errors.drawDate?.message}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                type="number"
                label="Ticket Price"
                disabled={isLocked}
                {...register("ticketPrice", { valueAsNumber: true })}
              />

              <TextField
                type="number"
                label="Max Tickets Per User"
                disabled={isLocked}
                {...register("maxTicketsPerUser", {
                  valueAsNumber: true,
                })}
              />

              <TextField
                type="number"
                label="Total Ticket Limit"
                disabled={isLocked}
                {...register("totalTicketLimit", {
                  valueAsNumber: true,
                })}
              />
            </Stack>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select disabled={isLocked} label="Status">
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="drawn">Drawn</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              )}
            />

            <Divider />

            {/* PRIZES */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">Prizes</Typography>

              <Button
                disabled={isLocked}
                startIcon={<AddIcon />}
                onClick={() =>
                  append({
                    id: crypto.randomUUID(),
                    name: "",
                    type: "coins",
                    amount: 0,
                    quantity: 1,
                    imageUrl: "",
                  })
                }
              >
                Add Prize
              </Button>
            </Stack>

            {fields.map((field, index) => (
              <Paper key={field.id} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    label="Prize Name"
                    disabled={isLocked}
                    {...register(`prizes.${index}.name`)}
                  />

                  <Stack direction="row" spacing={2}>
                    <Controller
                      name={`prizes.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          disabled={isLocked}
                          fullWidth
                          label="Type"
                        >
                          <MenuItem value="coins">Coins</MenuItem>
                          <MenuItem value="freeSpin">Free Spin</MenuItem>
                          <MenuItem value="bonus">Bonus</MenuItem>
                        </TextField>
                      )}
                    />

                    <TextField
                      type="number"
                      label="Amount"
                      disabled={isLocked}
                      {...register(`prizes.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                    />

                    <TextField
                      type="number"
                      label="Quantity"
                      disabled={isLocked}
                      {...register(`prizes.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Image URL"
                      disabled={isLocked}
                      fullWidth
                      {...register(`prizes.${index}.imageUrl`)}
                    />

                    <IconButton
                      disabled={isLocked || fields.length === 1}
                      color="error"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            <Divider />

            {/* ACTIONS */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={handleCancel}>Back</Button>

              {!isLocked && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || updateMutation.isPending}
                >
                  Update Raffle
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
};

export default RaffleEdit;
