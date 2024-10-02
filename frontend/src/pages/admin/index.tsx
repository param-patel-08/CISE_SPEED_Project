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
}

export default function Moderator() {
  const [analytics, setAnalytics] = useState<Article[]>([]);
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Moderator Page
      </Typography>

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
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.map((article) => (
                <TableRow key={article._id} onClick={() => handleClick(article._id)}>
                  <TableCell>{article.Title}</TableCell>
                  <TableCell>{article.Authors.join(", ")}</TableCell>
                  <TableCell>{article.Impressions}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal Popup for showing article details */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Article Details</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : selectedArticle ? (
            <Box>
              <Typography variant="h6">Title: {selectedArticle.Title}</Typography>
              <Typography variant="body1">
                Authors: {selectedArticle.Authors.join(", ")}
              </Typography>
              <Typography variant="body1">Source: {selectedArticle.Source}</Typography>
              <Typography variant="body1">Year: {selectedArticle.PubYear}</Typography>
              <Typography variant="body1">
                SE Practice: {selectedArticle.SEPractice}
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
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
