import React, { FormEvent, useState } from "react";
import axios from "axios";
import { 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Box, 
  IconButton, 
  Snackbar,
  Alert,
  Stack,
  MenuItem
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const NewArticle = () => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState<string>("");
  const [sePractice, setSEPractice] = useState("");
  const [perspective, setPerspective] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formdata = {
      Title: title,
      Authors: authors,
      Source: source,
      PubYear: pubYear,
      SEPractice: sePractice,
      Perspective: perspective,
    };

    try {
      const response = await axios.post("/api/articles", formdata);
      console.log(response);
      setSnackbar({ open: true, message: "Article submitted successfully!", severity: "success" });
      setTitle("");
      setAuthors([]);
      setSource("");
      setPubYear("");
      setSEPractice("");
      setPerspective("");
    } catch (error) {
      console.error("Error submitting article:", error);
      setSnackbar({ open: true, message: "Error submitting article. Please try again.", severity: "error" });
    }
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const changeAuthor = (index: number, value: string) => {
    setAuthors(authors.map((oldValue, i) => (index === i ? value : oldValue)));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        New Article
      </Typography>
      <form onSubmit={submitNewArticle}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <Typography variant="h6" gutterBottom>
            Authors
          </Typography>
          {authors.map((author, index) => (
            <Stack direction="row" spacing={1} key={`author ${index}`} alignItems="center">
              <TextField
                label={`Author ${index + 1}`}
                variant="outlined"
                fullWidth
                value={author}
                onChange={(event) => changeAuthor(index, event.target.value)}
                required
              />
              <IconButton
                onClick={() => removeAuthor(index)}
                color="error"
                aria-label="remove author"
              >
                <RemoveIcon />
              </IconButton>
            </Stack>
          ))}
          <Box mt={1}>
            <IconButton
              onClick={addAuthor}
              color="primary"
              aria-label="add author"
            >
              <AddIcon />
            </IconButton>
          </Box>

          <TextField
            label="Source"
            variant="outlined"
            fullWidth
            margin="normal"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            required
          />

          <TextField
            label="Publication Year"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pubYear}
            onChange={(event) => setPubYear(event.target.value)}
            required
          />

          <TextField
            label="SE Practice"
            variant="outlined"
            fullWidth
            margin="normal"
            value={sePractice}
            onChange={(event) => setSEPractice(event.target.value)}
            required
          />

          <TextField
            select
            label="Perspective"
            variant="outlined"
            fullWidth
            margin="normal"
            value={perspective}
            onChange={(event) => setPerspective(event.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select a perspective</em>
            </MenuItem>
            <MenuItem value="Support">Support</MenuItem>
            <MenuItem value="Reject">Reject</MenuItem>
          </TextField>

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewArticle;
