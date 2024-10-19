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
  const [Articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [reasons, setReasons] = useState<{ [key: string]: string }>({});

  function handleStatusChange(status: string) {
    console.log(status);
    setSelectedStatus(status);

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
      default:
        console.log("Filter by status went wrong");
        return;
    }

    axios
      .get<Article[]>(endpoint)
      .then((response) => {
        const articles = response.data;
        setArticles(articles);
      })
      .catch((error) =>
        console.error(`Error fetching articles for status ${status}:`, error)
      );
  }

  useEffect(() => {
    const defaultStatus = "Pending";
    setSelectedStatus(defaultStatus);
    handleStatusChange(defaultStatus);
  }, []);

  const handleApproval = (
    id: string,
    status: "Approved" | "Rejected" | "Pending" | "Shortlisted" | "Reported"
  ) => {
    const reason = reasons[id] || "";
    axios
      .put("/api/articles/article", { id, status, reason })
      .then((response) => {
        console.log(response.data);
        handleStatusChange(selectedStatus);
      })
      .catch((error) => console.error("Error updating article status:", error));
  };

  const handleReasonChange = (id: string, reason: string) => {
    setReasons((prevReasons) => ({ ...prevReasons, [id]: reason }));
  };

  const handleClick = async (id: string) => {
    setLoading(true);
    setOpen(true);
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
  

  const handleClose = () => {
    setOpen(false);
    setSelectedArticle(null);
  };

  const renderActionButtons = (article: Article) => {
    const reason = reasons[article._id] || "";
  
    return (
      <Box display="flex" alignItems="center">
        <TextField
          value={reason}
          onChange={(e) => handleReasonChange(article._id, e.target.value)}
          placeholder="Reason"
          size="small"
          onClick={(e) => e.stopPropagation()} // Prevent click event from propagating
          onMouseDown={(e) => e.stopPropagation()} // Prevent mousedown event from propagating
          sx={{ marginRight: 1, width: "200px" }}
          required // Mark the TextField as required
          error={!reason} // Show error state when reason is empty
          helperText={!reason ? "Reason is required" : ""}
        />
  
        <Button
          variant="contained"
          color="success"
          onClick={(e) => {
            e.stopPropagation();
            handleApproval(article._id, "Approved");
          }}
          disabled={!reason} // Disable button if reason is empty
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
          disabled={!reason} // Disable button if reason is empty
          sx={{ marginRight: 1, width: "120px", height: "40px" }}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleApproval(article._id, "Shortlisted");
          }}
          disabled={!reason} // Disable button if reason is empty
          sx={{ width: "120px", height: "40px" }}
        >
          Shortlist
        </Button>
      </Box>
    );
  };


  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Moderator Page
      </Typography>

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
                <TableCell>Status: Reason</TableCell>
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
                  <TableCell>{article.Status}: {article.Reason}</TableCell>
                  <TableCell>{renderActionButtons(article)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ArticleDetailsModal
        open={open}
        loading={loading}
        selectedArticle={selectedArticle}
        onClose={handleClose}
      />
    </Container>
  );
}
