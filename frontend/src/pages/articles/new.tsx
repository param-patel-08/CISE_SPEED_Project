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
  const [journalname, setJournalName] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [pubYear, setPubYear] = useState<string>("");
  const [volume, setVolume] = useState("");
  const [number, setNumber] = useState("");
  const [pages, setPages] = useState("");
  const [link, setLink] = useState("");
  const [sePractice, setSEPractice] = useState("");
  const [perspective, setPerspective] = useState("");
  const [summary, setSummary] = useState(""); 
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Form submission handler
  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formdata = {
      JournalName: journalname,
      Authors: authors,
      PubYear: pubYear,
      Volume: volume,
      Number: number,
      Pages: pages,
      Link: link,
      SEPractice: sePractice,
      Perspective: perspective,
      Summary: summary,
    };

    try {
      const response = await axios.post("/api/articles", formdata);
      console.log(response);
      setSnackbar({ open: true, message: "Article submitted successfully!", severity: "success" });
      setAuthors([]);
      setJournalName("");
      setPubYear("");
      setVolume("");
      setNumber("");
      setPages("");
      setLink("");
      setSEPractice("");
      setPerspective("");
      setSummary("");
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

  // Function to dynamically set color for the Perspective dropdown
  const getColorForPerspective = (value: string) => {
    switch (value) {
      case "Reject":
        return "red";
      case "Neutral":
        return "#D4AC0D"; 
      case "Support":
        return "green";
      default:
        return "";
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        New Article
      </Typography>

      {/* Article form */}
      <form onSubmit={submitNewArticle}>
        <Stack spacing={2}>
          
          {/* Journal Name Input */}
          <TextField
            label="Journal Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={journalname}
            onChange={(event) => setJournalName(event.target.value)}
            required
          />

          {/* Author Section */}
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

          {/* Publication Year Input */}
          <TextField
            label="Publication Year"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pubYear}
            onChange={(event) => setPubYear(event.target.value)}
            type="number"
            required
          />

          {/* Volume Input */}
          <TextField
            label="Volume"
            variant="outlined"
            fullWidth
            margin="normal"
            value={volume}
            onChange={(event) => setVolume(event.target.value)}
            required
          />

          {/* Number Input */}
          <TextField
            label="Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            required
          />

          {/* Pages Input */}
          <TextField
            label="Pages"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pages}
            onChange={(event) => setPages(event.target.value)}
            required
          />

          {/* Link Input */}
          <TextField
            label="Link"
            variant="outlined"
            fullWidth
            margin="normal"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            required
          />

          {/* SE Practice Dropdown */}
          <TextField
            label="SE Practice"
            variant="outlined"
            fullWidth
            margin="normal"
            select  // Enable dropdown behavior
            value={sePractice}
            onChange={(event) => setSEPractice(event.target.value)}
            required
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: 'auto',
                  }
                }
              },
              displayEmpty: true,  // Keeps label in place when no value is selected
              renderValue: sePractice !== "" ? undefined : () => <em>Select SE Practice</em>
            }}
          >
            <MenuItem value="">
              <em>Select SE Practice</em>
            </MenuItem>
            <MenuItem value="Agile">Agile</MenuItem>
            <MenuItem value="TDD">Test Driven Development</MenuItem>
            <MenuItem value="Scrum">Scrum</MenuItem>
            <MenuItem value="DevOps">DevOps</MenuItem>
            <MenuItem value="Mob Programming">Mob Programming</MenuItem>
          </TextField>

          {/* Summary Input */}
          <TextField
            label="Summary"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            required
          />

          {/* Perspective Dropdown */}
          <TextField
            label="Perspective"
            variant="outlined"
            fullWidth
            margin="normal"
            select
            value={perspective}
            onChange={(event) => setPerspective(event.target.value)}
            required
            SelectProps={{
              displayEmpty: true,
              renderValue: perspective !== "" ? undefined : () => <em>Select Perspective</em>
            }}
            InputProps={{
              style: { color: getColorForPerspective(perspective) }
            }}
          >
            <MenuItem value="">
              <em>Select Perspective</em>
            </MenuItem>
            <MenuItem value="Reject" style={{ color: "red" }}>Reject</MenuItem>
            <MenuItem value="Neutral" style={{ color: "#D4AC0D" }}>Neutral</MenuItem>
            <MenuItem value="Support" style={{ color: "green" }}>Support</MenuItem>
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
