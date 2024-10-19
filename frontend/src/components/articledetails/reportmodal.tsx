// ReportModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import axios from "axios";

interface ReportModalProps {
  open: boolean;
  articleId: string; // Added article ID for direct backend interaction
  onClose: () => void; // Function to close the modal
}

const ReportModal: React.FC<ReportModalProps> = ({ open, articleId, onClose }) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReason(event.target.value);
  };

  const handleCustomReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomReason(event.target.value);
  };

  const handleSubmit = async () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason;
    if (!reason) {
      setError("Please select or specify a reason.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await axios.post(`/api/articles/report/${articleId}`, { reason });
      console.log("Report successfully submitted.");
      onClose(); // Close the modal after submitting
    } catch (error) {
      console.error("Error submitting report:", error);
      setError("Failed to submit the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Article</DialogTitle>
      <DialogContent>
        <Typography>Please select the reason for reporting this article:</Typography>
        <RadioGroup value={selectedReason} onChange={handleReasonChange}>
          <FormControlLabel value="Inappropriate content" control={<Radio />} label="Inappropriate content" />
          <FormControlLabel value="Spam" control={<Radio />} label="Spam or misleading" />
          <FormControlLabel value="Copyright violation" control={<Radio />} label="Copyright violation" />
          <FormControlLabel value="Other" control={<Radio />} label="Other (Please specify)" />
        </RadioGroup>
        {selectedReason === "Other" && (
          <TextField
            fullWidth
            label="Please specify"
            variant="outlined"
            margin="normal"
            value={customReason}
            onChange={handleCustomReasonChange}
          />
        )}

        {error && (
          <Typography color="error" variant="body2" style={{ marginTop: 10 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="secondary" variant="contained" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
