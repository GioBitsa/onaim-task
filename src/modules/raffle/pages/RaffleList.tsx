import { useState, useMemo } from "react";
import {
  Typography,
  Stack,
  Pagination,
  Chip,
  Button,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useRaffles } from "../hooks/useRaffles";
import type { Raffle } from "../types/raffle.types";
import { TableList } from "../components/TableList";
import type { TableListColumn } from "../types/tableList.types";

const statuses = ["draft", "active", "drawn", "cancelled"];
const ITEMS_PER_PAGE = 5;

const RaffleList = () => {
  const navigate = useNavigate();

  const {
    listQuery: { data: raffles = [], isLoading, isError },
  } = useRaffles();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);

  // ------------------------
  // FILTERING
  // ------------------------
  const filtered = useMemo(() => {
    return raffles.filter((r) => {
      const matchStatus = filterStatus ? r.status === filterStatus : true;

      const matchStart = startDate
        ? new Date(r.startDate) >= new Date(startDate)
        : true;

      const matchEnd = endDate
        ? new Date(r.endDate) <= new Date(endDate)
        : true;

      return matchStatus && matchStart && matchEnd;
    });
  }, [raffles, filterStatus, startDate, endDate]);

  // ------------------------
  // PAGINATION
  // ------------------------
  const paginated = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page]
  );

  // ------------------------
  // COLUMNS
  // ------------------------
  const columns = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
    {
      key: "ticketPrice",
      label: "Ticket Price",
    },
    {
      key: "startDate",
      label: "Start",
      render: (r: Raffle) => new Date(r.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End",
      render: (r: Raffle) => new Date(r.endDate).toLocaleDateString(),
    },
    {
      key: "drawDate",
      label: "Draw",
      render: (r: Raffle) => new Date(r.drawDate).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      sortable: false,
      render: (r: Raffle) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/raffle/detail/${r.id}`);
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/raffle/edit/${r.id}`);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ] satisfies TableListColumn<Raffle>[];

  if (isLoading) return <Typography>Loading raffles...</Typography>;
  if (isError) return <Typography>Error loading raffles</Typography>;

  return (
    <Stack spacing={2}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" fontWeight={600}>
          Raffle Management
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/raffle/create")}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
          }}
        >
          Create Raffle
        </Button>
      </Stack>

      {/* DESCRIPTION */}
      <Typography variant="body2" color="text.secondary">
        Manage raffles, configure ticket rules, and control prize distributions.
      </Typography>

      {/* FILTERS */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
      >
        {/* STATUS FILTER */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {statuses.map((status) => {
            const active = filterStatus === status;

            return (
              <Chip
                key={status}
                label={status.toUpperCase()}
                clickable
                onClick={() =>
                  setFilterStatus((prev) => (prev === status ? "" : status))
                }
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
              />
            );
          })}
        </Stack>

        {/* DATE FILTER */}
        <Stack direction="row" spacing={2}>
          <TextField
            type="date"
            size="small"
            label="Start From"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <TextField
            type="date"
            size="small"
            label="End To"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Stack>
      </Stack>

      {/* TABLE */}
      <TableList columns={columns} data={paginated} />

      {/* PAGINATION */}
      <Stack alignItems="center">
        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Stack>
    </Stack>
  );
};

export default RaffleList;
