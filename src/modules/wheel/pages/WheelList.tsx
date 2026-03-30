import {
  Box,
  Typography,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { Wheel } from "../types/wheel.types";
import { useWheels } from "../hooks/useWheels";
import { WheelTable } from "../components/WheelTable";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../../shared/context/SnackbarContext";

const ITEMS_PER_PAGE = 10;

const WheelListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { listQuery, deleteMutation } = useWheels();
  const { data, isLoading } = listQuery;

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<keyof Wheel>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleDelete = async (id: string) => {
    try {
      deleteMutation.mutateAsync(id);
      showSnackbar("Deleted successfully", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      showSnackbar(message, "error");
    }
  };

  // ✅ FILTER + SORT (client-side)
  const processedData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // filter
    if (status) {
      result = result.filter((w) => w.status === status);
    }

    // sort
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return result;
  }, [data, status, sortBy, order]);

  // ✅ PAGINATION (client-side)
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return processedData.slice(start, start + ITEMS_PER_PAGE);
  }, [processedData, page]);

  const handleSort = (field: keyof Wheel) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Wheels
      </Typography>

      <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
        {/* FILTER */}
        <Box>
          <Select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            displayEmpty
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </Box>

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
            height: "50px",
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

      {/* LOADING */}
      {isLoading ? (
        <CircularProgress />
      ) : processedData.length === 0 ? (
        <Typography>No wheels found</Typography>
      ) : (
        <WheelTable
          data={paginatedData}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          onEdit={(id) => navigate(`edit/${id}`)}
          onView={(id) => navigate(`detail/${id}`)}
          onDelete={handleDelete}
        />
      )}

      {/* PAGINATION */}
      <Pagination
        count={Math.ceil(processedData.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default WheelListPage;
