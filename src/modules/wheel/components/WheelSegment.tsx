import {
  Button,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Divider,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFieldArray, type Control } from "react-hook-form";
import type { WheelFormValues } from "../schemas/wheel.schema";

const WheelSegment = ({ control }: { control: Control<WheelFormValues> }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "segments",
  });

  return (
    <Stack direction={"column"} spacing={3}>
      {fields.map((field, index) => (
        <Box key={field.id}>
          <Stack direction={"column"} spacing={1}>
            <Stack direction={"row"} spacing={1}>
              <TextField
                label="Label"
                {...control.register(`segments.${index}.label`)}
              />

              <TextField
                label="Color"
                {...control.register(`segments.${index}.color`)}
              />

              <TextField
                label="Weight"
                type="number"
                {...control.register(`segments.${index}.weight`, {
                  valueAsNumber: true,
                })}
              />
            </Stack>

            <Stack direction={"row"} spacing={1}>
              <TextField
                fullWidth
                select
                label="Prize Type"
                {...control.register(`segments.${index}.prizeType`)}
                sx={{ minWidth: "100px" }}
              >
                <MenuItem value="coins">Coins</MenuItem>
                <MenuItem value="freeSpin">Free Spin</MenuItem>
                <MenuItem value="bonus">Bonus</MenuItem>
                <MenuItem value="nothing">Nothing</MenuItem>
              </TextField>

              <TextField
                label="Amount"
                type="number"
                {...control.register(`segments.${index}.prizeAmount`, {
                  valueAsNumber: true,
                })}
              />

              <IconButton
                onClick={() => remove(index)}
                disabled={fields.length === 2}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Divider />
        </Box>
      ))}

      <Button
        onClick={() =>
          append({
            label: "",
            color: "#000000",
            weight: 10,
            prizeType: "coins",
            prizeAmount: 1,
            imageUrl: "",
          })
        }
      >
        Add Segment
      </Button>
    </Stack>
  );
};

export default WheelSegment;
