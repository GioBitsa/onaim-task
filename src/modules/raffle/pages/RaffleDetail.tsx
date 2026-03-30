import { useParams, useNavigate } from "react-router-dom";
import {
  Stack,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { useRaffles } from "../hooks/useRaffles";

const RaffleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { detailQuery } = useRaffles();
  const { data, isLoading, isError } = detailQuery(id!);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError || !data) return <Typography>Error loading raffle</Typography>;

  const getStatusColor = () => {
    switch (data.status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "drawn":
        return "info";
      case "cancelled":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Stack spacing={3}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={600}>
            {data.name}
          </Typography>

          <Chip
            label={data.status.toUpperCase()}
            color={getStatusColor()}
            sx={{ width: "fit-content" }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate("/raffle")}>
            Back
          </Button>

          {data.status !== "drawn" && (
            <Button
              variant="contained"
              onClick={() => navigate(`/raffle/edit/${data.id}`)}
            >
              Edit
            </Button>
          )}
        </Stack>
      </Stack>

      {/* BASIC INFO */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Basic Information</Typography>
          <Divider />

          <Stack spacing={1}>
            <Typography variant="caption">Description</Typography>
            <Typography>{data.description || "No description"}</Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* DATES & SETTINGS */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Schedule & Settings</Typography>
          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="caption">Start Date</Typography>
              <Typography>
                {new Date(data.startDate).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption">End Date</Typography>
              <Typography>{new Date(data.endDate).toLocaleString()}</Typography>
            </Box>

            <Box>
              <Typography variant="caption">Draw Date</Typography>
              <Typography>
                {new Date(data.drawDate).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption">Ticket Price</Typography>
              <Typography>{data.ticketPrice}</Typography>
            </Box>

            <Box>
              <Typography variant="caption">Max Tickets / User</Typography>
              <Typography>{data.maxTicketsPerUser}</Typography>
            </Box>

            <Box>
              <Typography variant="caption">Total Ticket Limit</Typography>
              <Typography>{data.totalTicketLimit ?? "Unlimited"}</Typography>
            </Box>

            <Box>
              <Typography variant="caption">Created At</Typography>
              <Typography>
                {new Date(data.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* PRIZES */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Prizes</Typography>
          <Divider />

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {data.prizes.map((prize) => (
              <Box
                key={prize.id}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "30%" },
                  border: "1px solid #eee",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack spacing={1}>
                  <Typography fontWeight={600}>{prize.name}</Typography>

                  <Typography variant="body2">Type: {prize.type}</Typography>

                  <Typography variant="body2">
                    Amount: {prize.amount}
                  </Typography>

                  <Typography variant="body2">
                    Quantity: {prize.quantity}
                  </Typography>

                  {prize.imageUrl && (
                    <Box
                      component="img"
                      src={prize.imageUrl}
                      alt={prize.name}
                      sx={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default RaffleDetail;
