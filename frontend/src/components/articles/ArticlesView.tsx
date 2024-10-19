import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import SortableTable from '../table/SortableTable'; // Import SortableTable component
import ArticleDetailsModal from '../articledetails/ArticleDetailsModal'; // Import ArticleDetailsModal
import { Article } from '../article/Article'; // Import your Article interface

const ArticlesView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [open, setOpen] = useState(false);

  // Report modal state
  const [reportOpen, setReportOpen] = useState(false); // Report modal open state
  const [reportReason, setReportReason] = useState(''); // Report reason
  const [customReason, setCustomReason] = useState(''); // Custom reason for 'Other'

  // Filters
  const [SEPractice, setSEPractice] = useState<string[]>([]);
  const [Perspective, setPerspective] = useState<number[]>([]);
  const [AfterPubYear, setAfterPubYear] = useState<number | undefined>(undefined);
  const [BeforePubYear, setBeforePubYear] = useState<number | undefined>(undefined);

  // Function to fetch articles, optionally by query and filters
  const fetchArticles = async (query: string, filters: { SEPractice?: string[], Perspective?: number[], AfterPubYear?: number, BeforePubYear?: number }) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`/api/articles/search`, {query, filters });
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('An error occurred while fetching articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all articles on page load using useEffect
  useEffect(() => {
    fetchArticles('', {});
  }, []); // Empty dependency array to run only on component mount

  // Handle the search function with filters
  const handleSearch = () => {
    const filters = { SEPractice, Perspective, AfterPubYear, BeforePubYear };
    fetchArticles(searchQuery, filters);
  };

  // Update type to SelectChangeEvent
  const handleSEPracticeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSEPractice(value);
  };

  // Update type to SelectChangeEvent
  const handlePerspectiveChange = (event: SelectChangeEvent<number[]>) => {
      const value = event.target.value as number[];
      setPerspective(value);
    };

  // Function to open the modal with the selected article details
  const handleClickArticle = (article: Article) => {
    setSelectedArticle(article);
    setOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedArticle(null);
  };

  const handleCloseReportModal = () => {
    setReportOpen(false); // Close the report modal
    setReportReason(''); // Reset the reason
    setCustomReason(''); // Reset the custom reason if "Other" was selected
  };

  const handleSubmitReport = () => {
    const finalReason = reportReason === 'Other' ? customReason : reportReason;
    console.log("Report submitted for reason:", finalReason);
    // Here you can send the report reason to your backend
    handleCloseReportModal(); // Close the modal after submitting the report
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Search Articles
      </Typography>
      <Box display="flex" marginBottom={3} flexDirection="column">
        <TextField
          fullWidth
          variant="outlined"
          label="Search articles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{ marginBottom: '10px' }}
        />

        {/* Filters for SEPractice, Perspective, and PubYear */}
        <Box display="flex" justifyContent="space-between" marginBottom={3}>
          {/* SE Practice filter */}
          <FormControl style={{ minWidth: 150 }}>
            <InputLabel>SE Practice</InputLabel>
            <Select
              multiple
              value={SEPractice}
              onChange={handleSEPracticeChange}
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem value="Agile">Agile</MenuItem>
              <MenuItem value="Test Driven Development">Test Driven Development</MenuItem>
              <MenuItem value="Scrum">Scrum</MenuItem>
              <MenuItem value="DevOps">DevOps</MenuItem>
              <MenuItem value="Mob Programming">Mob Programming</MenuItem>
            </Select>
          </FormControl>

          {/* Perspective filter */}
          <FormControl style={{ minWidth: 150 }}>
            <InputLabel>Perspective</InputLabel>
            <Select
              multiple
              value={Perspective}
              onChange={handlePerspectiveChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {/* Add your available Perspectives */}
              <MenuItem value={"Reject"}>Reject</MenuItem>
              <MenuItem value={"Neutral"}>Neutral</MenuItem>
              <MenuItem value={"Support"}>Support</MenuItem>
            </Select>
          </FormControl>

          {/* After and Before Year filters */}
          <TextField
            label="After Year"
            type="number"
            value={AfterPubYear || ''}
            onChange={(e) => setAfterPubYear(parseInt(e.target.value) || undefined)}
          />
          <TextField
            label="Before Year"
            type="number"
            value={BeforePubYear || ''}
            onChange={(e) => setBeforePubYear(parseInt(e.target.value) || undefined)}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {!loading && searchResults.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          {/* Use the SortableTable component here */}
          <SortableTable
            data={searchResults}
            onRowClick={handleClickArticle} // Pass row click handler
          />
        </>
      )}

      {!loading && searchResults.length === 0 && (
        <Typography variant="body1">
          No results found. Try a different search term.
        </Typography>
      )}

      {/* Modal to show detailed article information */}
      <ArticleDetailsModal
        open={open}
        loading={loading}
        selectedArticle={selectedArticle}
        onClose={handleCloseModal}
      />

      {/* Report Modal */}
      <Dialog open={reportOpen} onClose={handleCloseReportModal} maxWidth="sm" fullWidth>
        <DialogTitle>Report Article</DialogTitle>
        <DialogContent>
          <Typography>Please select the reason for reporting this article:</Typography>
          <RadioGroup
            value={reportReason}
            onChange={(e) => setReportReason((e.target as HTMLInputElement).value)}
          >
            <FormControlLabel value="Inappropriate content" control={<Radio />} label="Inappropriate content" />
            <FormControlLabel value="Spam" control={<Radio />} label="Spam or misleading" />
            <FormControlLabel value="Copyright violation" control={<Radio />} label="Copyright violation" />
            <FormControlLabel value="Other" control={<Radio />} label="Other (Please specify)" />
          </RadioGroup>

          {/* Custom reason input if 'Other' is selected */}
          {reportReason === 'Other' && (
            <TextField
              fullWidth
              label="Please specify"
              variant="outlined"
              margin="normal"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitReport} color="secondary" variant="contained">
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ArticlesView;
