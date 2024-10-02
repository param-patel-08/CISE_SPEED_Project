import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

interface Article {
  _id: string;
  Title: string;
  Authors: string[];
  Impressions: number;
}

export default function Moderator() {
  const [analytics, setAnalytics] = useState<Article[]>([]);
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Fetching all approved articles for analytics
    axios.get<Article[]>("/api/articles")
      .then(response => {
        const articles = response.data;
        setAnalytics(articles);
      })
      .catch(error => console.error("Error fetching articles:", error));

    // Fetching all pending articles for moderation
    axios.get<Article[]>("/api/articles/pending")
      .then(response => {
        setPendingArticles(response.data);
      })
      .catch(error => console.error("Error fetching pending articles:", error));
  }, []);

  const handleApproval = (id: string, status: "Approved" | "Rejected") => {
    axios.put("/api/articles/article", { id, status })
      .then(response => {
        console.log(response.data);
        // Update the pending articles list
        setPendingArticles(prevArticles => prevArticles.filter(article => article._id !== id));
      })
      .catch(error => console.error("Error updating article status:", error));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Moderator Page
      </Typography>

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
                <TableRow key={article._id}>
                  <TableCell>{article.Title}</TableCell>
                  <TableCell>{article.Authors.join(", ")}</TableCell>
                  <TableCell>{article.Impressions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingArticles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>{article.Title}</TableCell>
                  <TableCell>{article.Authors.join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApproval(article._id, "Approved")}
                      sx={{ marginRight: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleApproval(article._id, "Rejected")}
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
    </Container>
  );
}
