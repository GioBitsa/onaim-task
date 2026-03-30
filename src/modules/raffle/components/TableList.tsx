import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TableSortLabel,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { TableListColumn } from "../types/tableList.types";
import { useNavigate } from "react-router-dom";

type TableListProps<T> = {
  columns: TableListColumn<T>[];
  data: T[];
};

export const TableList = <T extends { id: string }>({
  columns,
  data,
}: TableListProps<T>) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      if (sortOrder === "desc") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortKey(null);
        setSortOrder(null);
      } else {
        setSortOrder("desc");
      }
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortOrder === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      })
    : data;

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        borderRadius: 2,
        "&::-webkit-scrollbar": {
          height: 6,
        },
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 800,
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={String(col.key)}>
                <TableSortLabel
                  active={sortKey === col.key}
                  direction={sortKey === col.key ? sortOrder ?? "asc" : "asc"}
                  hideSortIcon={sortKey !== col.key || !sortOrder}
                  onClick={() => {
                    if (col.sortable !== false) {
                      handleSort(col.key as keyof T);
                    }
                  }}
                >
                  <Typography noWrap variant="subtitle2">
                    {col.label}
                  </Typography>
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => {
            return (
              <TableRow key={row.id} hover sx={{ cursor: "pointer" }}>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 200,
                    }}
                    onClick={() => navigate(`/raffle/detail/${row.id}`)}
                  >
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {"render" in col && col.render
                        ? col.render(row)
                        : col.key in row
                        ? (row[col.key as keyof T] as React.ReactNode)
                        : null}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {sortedData.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography>No data available</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
