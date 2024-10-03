import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  MenuItem,
} from "@mui/material";

interface Article {
  _id: string;
  Title: string;
  Authors: string[];
  Impressions?: number;
  Source?: string;
  PubYear?: string;
  SEPractice?: string;
  Perspective?: string;
  Status: string; // Adding status field
  DateOfSubmission: string; // Adding submission date field
}

export default function Moderator() {
  const [analytics, setAnalytics] = useState<Article[]>([]);
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State for status filter

  useEffect(() => {
    // Fetching all approved articles for analytics
    axios
      .get<Article[]>("/api/articles")
      .then((response) => {
        const articles = response.data;
        setAnalytics(articles);
      })
      .catch((error) => console.error("Error fetching articles:", error));

    // Fetching all pending articles for moderation
    axios
      .get<Article[]>("/api/articles/pending")
      .then((response) => {
        setPendingArticles(response.data);
      })
      .catch((error) => console.error("Error fetching pending articles:", error));
  }, []);

  const handleApproval = (id: string, status: "Approved" | "Rejected") => {
    axios
      .put("/api/articles/article", { id, status })
      .then((response) => {
        console.log(response.data);
        // Update the pending articles list
        setPendingArticles((prevArticles) =>
          prevArticles.filter((article) => article._id !== id)
        );
      })
      .catch((error) => console.error("Error updating article status:", error));
  };

  // Function to fetch article details by ID and open the modal
  const handleClick = async (id: string) => {
    setLoading(true);
    setOpen(true); // Open modal
    try {
      const response = await axios.get(`/api/articles/article`, {
        params: { id },
      });
      setSelectedArticle(response.data);
    } catch (error) {
      console.error("Error fetching article by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedArticle(null);
  };

  // Filter articles based on selected status
  const filteredAnalytics = selectedStatus
    ? analytics.filter((article) => article.Status === selectedStatus)
    : analytics;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Moderator Page
      </Typography>

      {/* Filter by Status Dropdown */}
      <Box marginBottom={4}>
        <TextField
          select
          label="Filter by Status"
          variant="outlined"
          fullWidth
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <MenuItem value="">
            <em>All Statuses</em>
          </MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </TextField>
      </Box>

      {/* Analytics Section */}
      <Box marginBottom={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Analytics
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Authors</TableCell>
                <TableCell>Impressions</TableCell>
                <TableCell>Status</TableCell> {/* Add Status Column */}
                <TableCell>Date of Submission</TableCell> {/* Add Date Column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAnalytics.map((article) => (
                <TableRow key={article._id} onClick={() => handleClick(article._id)}>
                  <TableCell>{article.Title}</TableCell>
                  <TableCell>{article.Authors.join(", ")}</TableCell>
                  <TableCell>{article.Impressions}</TableCell>
                  <TableCell>{article.Status}</TableCell> {/* Show Status */}
                  <TableCell>{article.DateOfSubmission}</TableCell> {/* Show Date */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Moderate Articles Section */}
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Moderate Articles
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Authors</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date of Submission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingArticles.map((article) => (
                <TableRow key={article._id} onClick={() => handleClick(article._id)}>
                  <TableCell>{article.Title}</TableCell>
                  <TableCell>{article.Authors.join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering the modal on button click
                        handleApproval(article._id, "Approved");
                      }}
                      sx={{ marginRight: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering the modal on button click
                        handleApproval(article._id, "Rejected");
                      }}
                    >
                      Reject
                    </Button>
                  </TableCell>
                  <TableCell>{article.Status}</TableCell> {/* Show Status */}
                  <TableCell>{article.DateOfSubmission}</TableCell> {/* Show Date */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal Popup for showing article details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Article Details</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : selectedArticle ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Title: {selectedArticle.Title}
              </Typography>
              <Typography variant="body1">
                <strong>Authors:</strong> {selectedArticle.Authors.join(", ")}
              </Typography>
              <Typography variant="body1">
                <strong>Source:</strong>{" "}
                <a href={selectedArticle.Source}>{selectedArticle.Source}</a>
              </Typography>
              <Typography variant="body1">
                <strong>Year:</strong> {selectedArticle.PubYear}
              </Typography>
              <Typography variant="body1">
                <strong>SE Practice:</strong> {selectedArticle.SEPractice}
              </Typography>
              <Typography variant="body1">
                <strong>Perspective:</strong> {selectedArticle.Perspective}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedArticle.Status} {/* Show Status */}
              </Typography>
              <Typography variant="body1">
                <strong>Date of Submission:</strong> {selectedArticle.DateOfSubmission}{" "}
                {/* Show Date */}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1">No article details found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
