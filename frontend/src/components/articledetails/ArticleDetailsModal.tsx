// Import necessary dependencies from React and Material UI
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
import { Article } from "../article/Article"; // Import the Article interface for type safety

// Define the props type for the ArticleDetailsModal component
interface ArticleDetailsModalProps {
  open: boolean; // Controls whether the modal is open or closed
  loading: boolean; // Indicates whether the data is still loading
  selectedArticle: Article | null; // The article to be displayed (or null if no article is selected)
  onClose: () => void; // Function to handle closing the modal
}

// Functional component to display article details in a modal
const ArticleDetailsModal: React.FC<ArticleDetailsModalProps> = ({
  open, // Whether the modal is open
  loading, // Whether the article details are loading
  selectedArticle, // The selected article object (if available)
  onClose, // Function to close the modal
}) => {
  return (
    // Material UI Dialog component to show the modal
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      
      {/* Modal Title */}
      <DialogTitle>Article Details</DialogTitle>

      {/* Modal Content */}
      <DialogContent>
        {loading ? (
          // If loading is true, show a CircularProgress loader
          <CircularProgress />
        ) : selectedArticle ? (
          // If an article is selected, display its details
          <Box>
            <Typography variant="h6">Journal Name: {selectedArticle.JournalName}</Typography>
            <Typography variant="body1">
              Authors: {selectedArticle.Authors.join(", ")}
            </Typography>
            <Typography variant="body1">Year: {selectedArticle.PubYear}</Typography>
            <Typography variant="body1">Volume: {selectedArticle.Volume}</Typography>
            <Typography variant="body1">Number: {selectedArticle.Number}</Typography>
            <Typography variant="body1">Pages: {selectedArticle.Pages}</Typography>
            {/* Link to the article */}
            <Typography variant="body1">
              Link: <a href={selectedArticle.Link}>{selectedArticle.Link}</a>
            </Typography>
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
          // If no article is selected, show a message
          <Typography variant="body1">No article details found.</Typography>
        )}
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions>
        {/* Close button to close the modal */}
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Export the ArticleDetailsModal component as the default export
export default ArticleDetailsModal;
