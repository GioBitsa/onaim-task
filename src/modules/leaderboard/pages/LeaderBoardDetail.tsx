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
import { useLeaderboards } from "../hooks/useLeaderboards";

const LeaderBoardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { detailQuery } = useLeaderboards();
  const { data, isLoading, isError } = detailQuery(id!);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError || !data)
    return <Typography>Error loading leaderboard</Typography>;

  return (
    <Stack spacing={3}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={600}>
            {data.title}
          </Typography>

          <Chip
            label={data.status.toUpperCase()}
            color={
              data.status === "active"
                ? "success"
                : data.status === "draft"
                ? "warning"
                : "default"
            }
            sx={{ width: "fit-content" }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate("/leaderboard")}>
            Back
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate(`/leaderboard/edit/${data.id}`)}
          >
            Edit
          </Button>
        </Stack>
      </Stack>

      {/* BASIC INFO */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Basic Information</Typography>
          <Divider />

          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flex="1 1 250px">
              <Typography variant="caption">Title</Typography>
              <Typography>{data.title}</Typography>
            </Box>

            <Box flex="1 1 250px">
              <Typography variant="caption">Scoring Type</Typography>
              <Typography>{data.scoringType}</Typography>
            </Box>

            <Box flex="1 1 100%">
              <Typography variant="caption">Description</Typography>
              <Typography>{data.description || "No description"}</Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* DATES & SETTINGS */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Schedule & Settings</Typography>
          <Divider />

          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flex="1 1 250px">
              <Typography variant="caption">Start Date</Typography>
              <Typography>
                {new Date(data.startDate).toLocaleString()}
              </Typography>
            </Box>

            <Box flex="1 1 250px">
              <Typography variant="caption">End Date</Typography>
              <Typography>{new Date(data.endDate).toLocaleString()}</Typography>
            </Box>

            <Box flex="1 1 250px">
              <Typography variant="caption">Max Participants</Typography>
              <Typography>{data.maxParticipants}</Typography>
            </Box>

            <Box flex="1 1 250px">
              <Typography variant="caption">Created At</Typography>
              <Typography>
                {new Date(data.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* PRIZES */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Prizes</Typography>
          <Divider />

          <Box display="flex" flexWrap="wrap" gap={2}>
            {data.prizes.map((prize) => (
              <Box
                key={prize.id}
                sx={{
                  flex: "1 1 250px",
                  border: "1px solid #eee",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack spacing={1}>
                  <Typography fontWeight={600}>
                    #{prize.rank} - {prize.name}
                  </Typography>

                  <Typography variant="body2">Type: {prize.type}</Typography>

                  <Typography variant="body2">
                    Amount: {prize.amount}
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
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default LeaderBoardDetail;
