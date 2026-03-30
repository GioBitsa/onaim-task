import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  IconButton,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Wheel } from "../types/wheel.types";
import { WheelStatusChip } from "./WheelStatusChip";

interface WheelTableProps {
  data: Wheel[];
  sortBy: keyof Wheel;
  order: "asc" | "desc";
  onSort: (field: keyof Wheel) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const WheelTable = ({
  data,
  sortBy,
  order,
  onSort,
  onView,
  onEdit,
  onDelete,
}: WheelTableProps) => {
  const createSortHandler = (field: keyof Wheel) => () => {
    onSort(field);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          {/* NAME */}
          <TableCell>
            <TableSortLabel
              active={sortBy === "name"}
              direction={sortBy === "name" ? order : "asc"}
              onClick={createSortHandler("name")}
            >
              Name
            </TableSortLabel>
          </TableCell>

          {/* STATUS */}
          <TableCell>Status</TableCell>

          {/* SPIN COST */}
          <TableCell>
            <TableSortLabel
              active={sortBy === "spinCost"}
              direction={sortBy === "spinCost" ? order : "asc"}
              onClick={createSortHandler("spinCost")}
            >
              Spin Cost
            </TableSortLabel>
          </TableCell>

          {/* MAX SPINS */}
          <TableCell>
            <TableSortLabel
              active={sortBy === "maxSpinsPerUser"}
              direction={sortBy === "maxSpinsPerUser" ? order : "asc"}
              onClick={createSortHandler("maxSpinsPerUser")}
            >
              Max Spins
            </TableSortLabel>
          </TableCell>

          {/* CREATED */}
          <TableCell>
            <TableSortLabel
              active={sortBy === "createdAt"}
              direction={sortBy === "createdAt" ? order : "asc"}
              onClick={createSortHandler("createdAt")}
            >
              Created At
            </TableSortLabel>
          </TableCell>

          {/* ACTIONS */}
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {data.map((wheel) => (
          <TableRow key={wheel.id} hover>
            <TableCell>{wheel.name}</TableCell>

            <TableCell>
              <WheelStatusChip status={wheel.status} />
            </TableCell>

            <TableCell>{wheel.spinCost}</TableCell>

            <TableCell>{wheel.maxSpinsPerUser}</TableCell>

            <TableCell>
              {new Date(wheel.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell align="right">
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <IconButton size="small" onClick={() => onView?.(wheel.id)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" onClick={() => onEdit?.(wheel.id)}>
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete?.(wheel.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
