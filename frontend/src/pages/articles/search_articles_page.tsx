// Import necessary dependencies and components
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

// Functional component for creating a new article
const NewArticle = () => {
  // State variables to manage form inputs and UI feedback
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
  const [selectedColumns, setSelectedColumns] = useState(""); // For Select Columns dropdown
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Form submission handler
  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect form data into an object
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
      // Send a POST request to the server to create a new article
      const response = await axios.post("/api/articles", formdata);
      console.log(response);

      // Show success message using Snackbar
      setSnackbar({ open: true, message: "Article submitted successfully!", severity: "success" });

      // Reset form fields after successful submission
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
      // Log the error and show an error message using Snackbar
      console.error("Error submitting article:", error);
      setSnackbar({ open: true, message: "Error submitting article. Please try again.", severity: "error" });
    }
  };

  // Function to add a new author input field
  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  // Function to remove an author input field at a specific index
  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  // Function to update the author name at a specific index
  const changeAuthor = (index: number, value: string) => {
    setAuthors(authors.map((oldValue, i) => (index === i ? value : oldValue)));
  };

  // Function to dynamically set the text color for the Perspective dropdown options
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
      {/* Page title */}
      <Typography variant="h4" gutterBottom>
        New Article
      </Typography>

      {/* Article submission form */}
      <form onSubmit={submitNewArticle}>
        <Stack spacing={2}>
          
          {/* Journal Name Input Field */}
          <TextField
            label="Journal Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={journalname}
            onChange={(event) => setJournalName(event.target.value)}
            required
          />

          {/* Authors Section */}
          <Typography variant="h6" gutterBottom>
            Authors
          </Typography>
          {/* Dynamically render input fields for each author */}
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
              {/* Button to remove an author input field */}
              <IconButton
                onClick={() => removeAuthor(index)}
                color="error"
                aria-label="remove author"
              >
                <RemoveIcon />
              </IconButton>
            </Stack>
          ))}
          {/* Button to add a new author input field */}
          <Box mt={1}>
            <IconButton
              onClick={addAuthor}
              color="primary"
              aria-label="add author"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Publication Year Input Field */}
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

          {/* Volume Input Field */}
          <TextField
            label="Volume"
            variant="outlined"
            fullWidth
            margin="normal"
            value={volume}
            onChange={(event) => setVolume(event.target.value)}
            required
          />

          {/* Number Input Field */}
          <TextField
            label="Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            required
          />

          {/* Pages Input Field */}
          <TextField
            label="Pages"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pages}
            onChange={(event) => setPages(event.target.value)}
            required
          />

          {/* Link Input Field */}
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
            select  // Enables dropdown functionality
            value={sePractice}
            onChange={(event) => setSEPractice(event.target.value)}
            required
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200, // Limits the height of the dropdown menu
                    overflowY: 'auto',
                  }
                }
              },
              displayEmpty: true,  // Keeps the label when no value is selected
              renderValue: sePractice !== "" ? undefined : () => <em>Select SE Practice</em>
            }}
          >
            {/* Default option */}
            <MenuItem value="">
              <em>Select SE Practice</em>
            </MenuItem>
            {/* Dropdown options */}
            <MenuItem value="Agile">Agile</MenuItem>
            <MenuItem value="TDD">Test Driven Development</MenuItem>
            <MenuItem value="Scrum">Scrum</MenuItem>
            <MenuItem value="DevOps">DevOps</MenuItem>
            <MenuItem value="Mob Programming">Mob Programming</MenuItem>
          </TextField>

          {/* Summary Input Field */}
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
              style: { color: getColorForPerspective(perspective) } // Dynamically change text color based on selected value
            }}
          >
            {/* Default option */}
            <MenuItem value="">
              <em>Select Perspective</em>
            </MenuItem>
            {/* Dropdown options with color styles */}
            <MenuItem value="Reject" style={{ color: "red" }}>Reject</MenuItem>
            <MenuItem value="Neutral" style={{ color: "#D4AC0D" }}>Neutral</MenuItem>
            <MenuItem value="Support" style={{ color: "green" }}>Support</MenuItem>
          </TextField>

          {/* Select Columns Dropdown (purpose unclear without additional context) */}
          <TextField
            label="Select Columns"
            variant="outlined"
            fullWidth
            margin="normal"
            select
            value={selectedColumns}
            onChange={(event) => setSelectedColumns(event.target.value)}
            SelectProps={{
              displayEmpty: true,
              renderValue: selectedColumns !== "" ? undefined : () => <em>Select Columns</em>
            }}
          >
            {/* Default option */}
            <MenuItem value="">
              <em>Select thiugs</em> {/* Note: "Select thiugs" might be a typo */}
            </MenuItem>
            {/* Dropdown options */}
            <MenuItem value="Journal Name">Journal Name</MenuItem>
            <MenuItem value="Authors">Authors</MenuItem>
            <MenuItem value="Publication Year">Publication Year</MenuItem>
            <MenuItem value="Impressions">Impressions</MenuItem>
          </TextField>

          {/* Submit Button */}
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>

      {/* Snackbar for displaying success or error messages */}
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
