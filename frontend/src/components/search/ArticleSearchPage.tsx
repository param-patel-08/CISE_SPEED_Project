import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
  Snackbar,
  Alert
} from '@mui/material';

interface Article {
  _id: string;
  Title: string;
  Authors: string[];
  Source: string;
  PubYear: string;
  DOE: string;
  SEPractice: string;
  Perspective: string;
}

const ArticleSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/articles/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error searching articles:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Search Articles
      </Typography>
      <Box display="flex" marginBottom={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search articles"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          style={{ marginLeft: '10px' }}
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
            Search Results
          </Typography>
          <List>
            {searchResults.map((article) => (
              <React.Fragment key={article._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={article.Title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {article.Authors.join(', ')}
                        </Typography>
                        {` - ${article.Source} (${article.PubYear})`}
                        <br />
                        {`SE Practice: ${article.SEPractice}`}
                        <br />
                        {`Perspective: ${article.Perspective}`}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </>
      )}

      {!loading && searchResults.length === 0 && searchQuery !== '' && (
        <Typography variant="body1">
          No results found. Try a different search term.
        </Typography>
      )}

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

export default ArticleSearchPage;