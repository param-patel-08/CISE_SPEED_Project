// Import necessary dependencies from React and Material UI
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// Define props for ReportModal
interface ReportModalProps {
  open: boolean; // Controls whether the modal is open or closed
  onClose: () => void; // Function to handle closing the modal
  onSubmit: (reason: string) => void; // Function to handle report submission
}

// Functional component for report modal
const ReportModal: React.FC<ReportModalProps> = ({ open, onClose, onSubmit }) => {
  const [reason, setReason] = useState(""); // State to store the selected reason
  const [customReason, setCustomReason] = useState(""); // State to store custom reason

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason((event.target as HTMLInputElement).value);
  };

  const handleSubmit = () => {
    if (reason === "Other") {
      onSubmit(customReason); // Submit custom reason
    } else {
      onSubmit(reason); // Submit selected reason
    }
    onClose(); // Close the modal after submission
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Article</DialogTitle>
      <DialogContent>
        <Typography>Please select the reason for reporting this article:</Typography>
        <RadioGroup value={reason} onChange={handleRadioChange}>
          <FormControlLabel value="Inappropriate content" control={<Radio />} label="Inappropriate content" />
          <FormControlLabel value="Spam" control={<Radio />} label="Spam or misleading" />
          <FormControlLabel value="Copyright violation" control={<Radio />} label="Copyright violation" />
          <FormControlLabel value="Other" control={<Radio />} label="Other (Please specify)" />
        </RadioGroup>

        {/* Text field to collect custom reason if "Other" is selected */}
        {reason === "Other" && (
          <TextField
            fullWidth
            label="Please specify"
            variant="outlined"
            margin="normal"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="secondary" variant="contained">
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
