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
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { raffleSchema, type RaffleFormValues } from "../schemas/raffle.schema";

import { useRaffles } from "../hooks/useRaffles";
import { useSnackbar } from "../../../shared/context/SnackbarContext";

const RaffleCreate = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { createMutation } = useRaffles();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RaffleFormValues>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      drawDate: "",
      status: "draft",
      ticketPrice: 1,
      maxTicketsPerUser: 1,
      totalTicketLimit: null,
      prizes: [
        {
          id: crypto.randomUUID(),
          name: "",
          type: "coins",
          amount: 0,
          quantity: 1,
          imageUrl: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes",
  });

  // ------------------------
  // SUBMIT
  // ------------------------
  const onSubmit = async (data: RaffleFormValues) => {
    try {
      const payload = {
        ...data,
        description: data.description ?? "", // ✅ fix
      };

      await createMutation.mutateAsync(payload);

      showSnackbar("Raffle created successfully", "success");
      navigate("/raffle");
    } catch (error) {
      showSnackbar("Failed to create raffle", "error");
    }
  };

  // ------------------------
  // CANCEL (dirty check)
  // ------------------------
  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Leave anyway?"
      );
      if (!confirmLeave) return;
    }
    navigate("/raffle");
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={600}>
        Create Raffle
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* BASIC */}
            <Typography variant="h6">Basic Info</Typography>

            <TextField
              label="Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

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

              <TextField
                fullWidth
                type="date"
                label="Draw Date"
                InputLabelProps={{ shrink: true }}
                {...register("drawDate")}
                error={!!errors.drawDate}
                helperText={errors.drawDate?.message}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                type="number"
                label="Ticket Price"
                {...register("ticketPrice", { valueAsNumber: true })}
                error={!!errors.ticketPrice}
                helperText={errors.ticketPrice?.message}
              />

              <TextField
                type="number"
                label="Max Tickets Per User"
                {...register("maxTicketsPerUser", { valueAsNumber: true })}
                error={!!errors.maxTicketsPerUser}
                helperText={errors.maxTicketsPerUser?.message}
              />

              <TextField
                type="number"
                label="Total Ticket Limit (optional)"
                {...register("totalTicketLimit", {
                  valueAsNumber: true,
                })}
              />
            </Stack>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Status">
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
              <Paper key={field.id} sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={2}>
                  <TextField
                    label="Prize Name"
                    {...register(`prizes.${index}.name`)}
                    error={!!errors.prizes?.[index]?.name}
                    helperText={errors.prizes?.[index]?.name?.message}
                  />

                  <Stack direction="row" spacing={2}>
                    <Controller
                      name={`prizes.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} select fullWidth label="Type">
                          <MenuItem value="coins">Coins</MenuItem>
                          <MenuItem value="freeSpin">Free Spin</MenuItem>
                          <MenuItem value="bonus">Bonus</MenuItem>
                        </TextField>
                      )}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label="Amount"
                      {...register(`prizes.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      {...register(`prizes.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      error={!!errors.prizes?.[index]?.quantity}
                      helperText={errors.prizes?.[index]?.quantity?.message}
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
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={handleCancel}>Cancel</Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || createMutation.isPending}
              >
                Create Raffle
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
};

export default RaffleCreate;
