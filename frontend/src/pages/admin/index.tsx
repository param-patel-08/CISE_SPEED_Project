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
  TextField,
  MenuItem,
} from "@mui/material";

import ArticleDetailsModal from "../../components/articledetails/ArticleDetailsModal";
import { Article } from "../../components/article/Article";

export default function Moderator() {
  const [analytics, setAnalytics] = useState<Article[]>([]);
  const [Articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  function handleStatusChange(status: string) {
    console.log(status);
    setSelectedStatus(status); // Update the selectedStatus state

    let endpoint = "";
    switch (status) {
      case "Approved":
        endpoint = "/api/articles";
        break;
      case "Rejected":
        endpoint = "/api/articles/rejected";
        break;
      case "Pending":
        endpoint = "/api/articles/pending";
        break;
      case "Shortlisted":
        endpoint = "/api/articles/shortlisted";
        break;
      case "Reported":
        endpoint = "/api/articles/reported";
        break;
      case "":
        endpoint = "/api/articles/all"; // Adjust this to match your API endpoint for all articles
        break;
      default:
        console.log("Filter by status went wrong");
        return;
    }

    axios
      .get<Article[]>(endpoint)
      .then((response) => {
        const articles = response.data;
        setArticles(articles); // Always update the 'Articles' state variable
      })
      .catch((error) =>
        console.error(`Error fetching articles for status ${status}:`, error)
      );
  }

  useEffect(() => {
    // Set default status to 'Pending' or any other default
    const defaultStatus = "Pending";
    setSelectedStatus(defaultStatus);
    handleStatusChange(defaultStatus);

    // Fetching all approved articles for analytics
    axios
      .get<Article[]>("/api/articles")
      .then((response) => {
        const articles = response.data;
        setAnalytics(articles);
      })
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  const handleApproval = (
    id: string,
    status: "Approved" | "Rejected" | "Pending" | "Shortlisted" | "Reported"
  ) => {
    axios
      .put("/api/articles/article", { id, status })
      .then((response) => {
        console.log(response.data);
        // Re-fetch articles based on current filter
        handleStatusChange(selectedStatus);
      })
      .catch((error) => console.error("Error updating article status:", error));
  };

  // Function to delete article by ID
  const handleDelete = (id: string) => {
    axios
      .delete(`/api/articles`, { params: { id } })
      .then((response) => {
        console.log(response.data);
        // Re-fetch articles based on current filter
        handleStatusChange(selectedStatus);
      })
      .catch((error) => console.error("Error deleting article:", error));
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

  // Helper function to render action buttons based on article status
  const renderActionButtons = (article: Article) => {
    switch (article.Status) {
      case "Approved":
        return (
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleApproval(article._id, "Rejected");
            }}
            sx={{ width: "120px", height: "40px" }}
          >
            Reject
          </Button>
        );
      case "Rejected":
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleApproval(article._id, "Pending");
              }}
              sx={{ marginRight: 1, width: "120px", height: "40px" }}
            >
              Pending
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(article._id);
              }}
              sx={{ width: "120px", height: "40px" }}
            >
              Delete
            </Button>
          </>
        );
      case "Shortlisted":
        return (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                handleApproval(article._id, "Approved");
              }}
              sx={{ marginRight: 1, width: "120px", height: "40px" }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleApproval(article._id, "Rejected");
              }}
              sx={{ width: "120px", height: "40px" }}
            >
              Reject
            </Button>
          </>
        );
      case "Pending":
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleApproval(article._id, "Shortlisted");
              }}
              sx={{ marginRight: 1, width: "120px", height: "40px" }}
            >
              Shortlist
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleApproval(article._id, "Rejected");
              }}
              sx={{ marginRight: 1, width: "120px", height: "40px" }}
            >
              Reject
            </Button>
          </>
        );
      case "Reported":
        return (
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(article._id);
            }}
            sx={{ width: "120px", height: "40px" }}
          >
            Delete
          </Button>
        );
      default:
        return null;
    }
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.map((article) => (
                <TableRow
                  key={article._id}
                  onClick={() => handleClick(article._id)}
                >
                  <TableCell>{article.JournalName}</TableCell>
                  <TableCell>{article.Authors.join(", ")}</TableCell>
                  <TableCell>{article.Impressions}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents triggering the modal on button click
                        handleDelete(article._id);
                      }}
                      sx={{ width: "120px", height: "40px" }} // Set fixed size for alignment
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Status Filter */}
      <Box marginBottom={3}>
        <TextField
          select
          label="Filter by Status"
          variant="outlined"
          fullWidth
          value={selectedStatus}
          onChange={(e) => {
            const status = e.target.value;
            setSelectedStatus(status);
            handleStatusChange(status);
          }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
          <MenuItem value="Shortlisted">Shortlisted</MenuItem>
          <MenuItem value="Reported">Reported</MenuItem>
        </TextField>
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
                <TableCell>Submission Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Articles.map((article) => (
                <TableRow
                  key={article._id}
                  onClick={() => handleClick(article._id)}
                >
                  <TableCell>{article.JournalName}</TableCell>
                  <TableCell>{article.Authors.join(", ")}</TableCell>
                  <TableCell>{String(article.DOE)}</TableCell>
                  <TableCell>{renderActionButtons(article)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal Popup for showing article details */}
      <ArticleDetailsModal
        open={open}
        loading={loading}
        selectedArticle={selectedArticle}
        onClose={handleClose}
      />
    </Container>
  );
}
