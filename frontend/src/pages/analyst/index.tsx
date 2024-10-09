// pages/serc-analyst.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

interface Article {
  _id: string;
  JournalName: string;
  Authors: string[];
  PubYear: number;
  Volume: string;
  Number: string;
  Pages: string;
  Link: string;
  SEPractice: string;
  Perspective: string;
  Summary: string;
  Status: string;
  Impressions: number;
}

const SercAnalyst: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Fetch articles using API for analysis
    axios.get<Article[]>("/api/articles")
      .then(response => {
        setArticles(response.data);
        console.log("\n Response.Data:\n", response.data, "\n");
      })
      .catch(error => console.error("Error fetching articles:", error));
  }, []);

  console.log("\nArticles:\n", articles, "\n");

  const handleExtractRelevantInfo = (id: string) => {
    // To be completed
    console.log(`Extracting info from article ID: ${id}`);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        SERC Analyst Page
      </Typography>

      <Box marginBottom={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Articles for Review
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Authors</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Journal Name</TableCell>
                <TableCell>SE Practice</TableCell>
                <TableCell>Perspective</TableCell>
                <TableCell>Impressions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>{article.JournalName}</TableCell>
                  <TableCell>
                    {article.Authors?.length ? article.Authors.join(", ") : "No authors available"}
                  </TableCell>
                  <TableCell>{article.PubYear}</TableCell>
                  <TableCell>{article.JournalName}</TableCell>
                  <TableCell>{article.SEPractice}</TableCell>
                  <TableCell>{article.Perspective}</TableCell>
                  <TableCell>{article.Impressions}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleExtractRelevantInfo(article._id)}
                    >
                      Extract Info
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
};

export default SercAnalyst;
