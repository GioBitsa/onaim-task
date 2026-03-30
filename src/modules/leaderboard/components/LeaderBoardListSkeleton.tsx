import {
  Stack,
  Skeleton,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ROWS = 5;
const COLUMNS = 7;

const LeaderBoardListSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack spacing={2}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between">
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rounded" width={140} height={40} />
      </Stack>

      {/* Description */}
      <Skeleton variant="text" width="60%" height={20} />

      {/* Filters */}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={80} height={32} />
        ))}
      </Stack>

      {/* Table (Desktop only) */}
      {!isMobile && (
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from({ length: COLUMNS }).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from({ length: ROWS }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: COLUMNS }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {colIndex === COLUMNS - 1 ? (
                        <Stack direction="row" spacing={1}>
                          <Skeleton variant="circular" width={24} height={24} />
                          <Skeleton variant="circular" width={24} height={24} />
                          <Skeleton variant="circular" width={24} height={24} />
                        </Stack>
                      ) : (
                        <Skeleton variant="text" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Mobile Card Skeleton */}
      {isMobile && (
        <Stack spacing={2}>
          {Array.from({ length: ROWS }).map((_, i) => (
            <Box
              key={i}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={1}>
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="40%" />

                <Stack direction="row" spacing={1} mt={1}>
                  <Skeleton variant="circular" width={28} height={28} />
                  <Skeleton variant="circular" width={28} height={28} />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      <Stack direction="row" justifyContent="center">
        <Skeleton variant="rounded" width={200} height={40} />
      </Stack>
    </Stack>
  );
};

export default LeaderBoardListSkeleton;
