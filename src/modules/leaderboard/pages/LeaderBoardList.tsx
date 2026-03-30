import { useState, useMemo } from "react";
import {
  Typography,
  Stack,
  Pagination,
  Chip,
  Button,
  Fade,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLeaderboards } from "../hooks/useLeaderboards";
import type { Leaderboard } from "../types/leaderboard.types";
import { TableList } from "../components/TableList";
import { useNavigate } from "react-router-dom";
import type { TableListColumn } from "../types/tableList.types";
import { useSnackbar } from "../../../shared/context/SnackbarContext";
import LeaderBoardListSkeleton from "../components/LeaderBoardListSkeleton";
import ErrorPage from "../../../shared/components/ErrorPage";

// Dummy statuses
const statuses = ["draft", "active", "completed"];

const ITEMS_PER_PAGE = 5;

const LeaderBoardList = () => {
  const navigate = useNavigate();
  const {
    listQuery: { data: leaderboards = [], isLoading, isError },
    updateMutation,
    deleteMutation,
  } = useLeaderboards();
  const { showSnackbar } = useSnackbar();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [bulkIds, setBulkIds] = useState<string[] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleBulkStatusUpdate = async (status: "active" | "draft") => {
    if (!selectedIds.length) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateMutation.mutateAsync({
            id,
            payload: { status },
          })
        )
      );
      showSnackbar("Status updated successfully", "success");

      setSelectedIds([]);
    } catch (error) {
      showSnackbar("Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      deleteMutation.mutateAsync(deleteId);
      showSnackbar("Tournament deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to update status", "error");
    }
  };

  // Filter
  const filtered = useMemo(
    () =>
      filterStatus
        ? leaderboards.filter((lb) => lb.status === filterStatus)
        : leaderboards,
    [leaderboards, filterStatus]
  );

  // Paginate
  const paginated = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page]
  );

  // Columns definition
  const columns = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "scoringType", label: "Scoring Type" },
    {
      key: "startDate",
      label: "Start Date",
      render: (lb: Leaderboard) => new Date(lb.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (lb: Leaderboard) => new Date(lb.endDate).toLocaleDateString(),
    },
    { key: "maxParticipants", label: "Max Participants" },
    {
      key: "createdAt",
      label: "Created",
      render: (lb) => new Date(lb.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      sortable: false,
      render: (lb) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/leaderboard/detail/${lb.id}`);
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
                navigate(`/leaderboard/edit/${lb.id}`);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(lb.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ] satisfies TableListColumn<Leaderboard>[];

  if (isLoading) return <LeaderBoardListSkeleton />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <Dialog open={!!bulkIds} onClose={() => setBulkIds(null)}>
        <DialogTitle>Change to Draft Tournaments</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to change status to draft to selected
            tournaments?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setBulkIds(null)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleBulkStatusUpdate("draft");
              setBulkIds(null);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Tournament</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete tournament?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setBulkIds(null)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleDelete();
              setDeleteId(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Stack spacing={2}>
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            Tournament Management
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("create")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              boxShadow: "0 4px 12px rgba(25,118,210,0.25)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 6px 18px rgba(25,118,210,0.35)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Create New
          </Button>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            maxWidth: "650px",
            lineHeight: 1.6,
          }}
        >
          Use this table to manage tournaments. Select one or multiple rows,
          then use the actions to activate them or move them back to draft
          status.
        </Typography>

        <Stack
          direction={"row"}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          {/* Filters */}
          <Stack direction="row" spacing={1}>
            {statuses.map((status) => {
              const isActive = filterStatus === status;

              return (
                <Chip
                  key={status}
                  label={status.toUpperCase()}
                  clickable
                  onClick={() =>
                    setFilterStatus(
                      (prev) => (prev === status ? "" : status) // toggle
                    )
                  }
                  color={isActive ? "primary" : "default"}
                  variant={isActive ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 600,
                    px: 1,
                    transition: "0.2s",
                    borderRadius: "8px",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              );
            })}
          </Stack>

          {/* Bulk actions */}
          <Fade in={selectedIds.length > 0}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "10px",
                backgroundColor: selectedIds.length
                  ? "rgba(25,118,210,0.08)"
                  : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedIds.length} selected
              </Typography>

              <Button
                size="small"
                variant="contained"
                color="success"
                disabled={!selectedIds.length}
                onClick={() => handleBulkStatusUpdate("active")}
                sx={{ textTransform: "none", borderRadius: "8px" }}
              >
                Activate
              </Button>

              <Button
                size="small"
                variant="contained"
                color="error"
                disabled={!selectedIds.length}
                onClick={() => {
                  setBulkIds(selectedIds);
                }}
                sx={{ textTransform: "none", borderRadius: "8px" }}
              >
                Disable
              </Button>

              {selectedIds.length > 0 && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setSelectedIds([])}
                  sx={{ textTransform: "none" }}
                >
                  Clear
                </Button>
              )}
            </Stack>
          </Fade>
        </Stack>

        <TableList
          columns={columns}
          data={paginated}
          selectedIds={selectedIds}
          onSelect={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            )
          }
          onSelectAll={(ids) => setSelectedIds(ids)}
        />

        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_event, value) => setPage(value)}
          variant="outlined"
          color="primary"
          sx={{ display: "flex", justifyContent: "center" }}
        />
      </Stack>
    </>
  );
};

export default LeaderBoardList;
