import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  MenuItem,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

interface ArticlesInterface {
  _id: string;
  Title: string;
  Authors: string[];
  Source: string;
  PubYear: number;
  Status: string;
  SEPractice: string;
  Perspective: string;
  Impressions: number;
}

type ArticlesProps = {
  articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<ArticlesInterface | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const headers: { key: keyof ArticlesInterface; label: string }[] = [
    { key: "Title", label: "Title" },
    { key: "Authors", label: "Authors" },
    { key: "Source", label: "Source" },
    { key: "PubYear", label: "Publication Year" },
    { key: "SEPractice", label: "Software Engineering Practice" },
    { key: "Perspective", label: "Perspective" },
    { key: "Impressions", label: "Impressions" },
  ];

  // Filter articles based on the selected SE Practice
  const filteredArticles = selectedPractice
    ? articles.filter((article) => article.SEPractice === selectedPractice)
    : articles;

  // Function to handle article click and open modal
  const handleClick = async (id: string) => {
    setLoading(true);
    setOpen(true);
    try {
      const response = await axios.get(`/api/articles/article`, {
        params: { id },
      });
      const articleData = response.data;

      // Increment impressions
      await axios.put(`/api/articles/increment-impressions`, { id });

      setSelectedArticle({
        ...articleData,
        Impressions: articleData.Impressions + 1, // Update impressions in the modal
      });
    } catch (error) {
      console.error("Error fetching article details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="container">
      <h1>Articles Index Page</h1>
      <p>Page containing a table of articles:</p>

      {/* Dropdown for filtering by SEPractice */}
      <Box marginBottom={3}>
        <TextField
          select
          label="Filter by SE Practice"
          variant="outlined"
          fullWidth
          value={selectedPractice}
          onChange={(e) => setSelectedPractice(e.target.value)}
        >
          <MenuItem value="">
            <em>All Practices</em>
          </MenuItem>
          {/* Dynamically generate practice options from the article data */}
          {[...new Set(articles.map((article) => article.SEPractice))].map((practice) => (
            <MenuItem key={practice} value={practice}>
              {practice}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <SortableTable
        headers={headers}
        data={filteredArticles.map((article) => ({
          ...article,
          onClick: () => handleClick(article._id),
        }))}
      />

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
                <strong>Source:</strong> <a href={selectedArticle.Source}>{selectedArticle.Source}</a>
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
                <strong>Impressions:</strong> {selectedArticle.Impressions}
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
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
  let response = await axios.get("http://localhost:3001/articles");
  let data = response.data;

  const articles = data.map((article: ArticlesInterface) => ({
    _id: article._id,
    Title: article.Title,
    Authors: article.Authors.join(", "),
    Source: article.Source,
    PubYear: article.PubYear,
    SEPractice: article.SEPractice,
    Perspective: article.Perspective,
    Impressions: article.Impressions,
  }));

  return {
    props: {
      articles,
    },
  };
};

export default Articles;
