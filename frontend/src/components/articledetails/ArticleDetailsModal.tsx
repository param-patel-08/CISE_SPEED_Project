import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Article } from "../article/Article";

interface ArticleDetailsModalProps {
  open: boolean;
  loading: boolean;
  selectedArticle: Article | null;
  onClose: () => void;
}

const ArticleDetailsModal: React.FC<ArticleDetailsModalProps> = ({
  open,
  loading,
  selectedArticle,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Article Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : selectedArticle ? (
          <Box>
            <Typography variant="h6">Journal Name: {selectedArticle.JournalName}</Typography>
            <Typography variant="body1">
              Authors: {selectedArticle.Authors.join(", ")}
            </Typography>
            <Typography variant="body1">Year: {selectedArticle.PubYear}</Typography>
            <Typography variant="body1">Volume: {selectedArticle.Volume}</Typography>
            <Typography variant="body1">Number: {selectedArticle.Number}</Typography>
            <Typography variant="body1">Pages: {selectedArticle.Pages}</Typography>
            <Typography variant="body1">Link: <a href={selectedArticle.Link}>{selectedArticle.Link}</a></Typography>
            <Typography variant="body1">
              SE Practice: {selectedArticle.SEPractice}
            </Typography>
            <Typography variant="body1"> 
              Summary: {selectedArticle.Summary}
            </Typography>
            <Typography variant="body1">
              Perspective: {selectedArticle.Perspective}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1">No article details found.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleDetailsModal;
