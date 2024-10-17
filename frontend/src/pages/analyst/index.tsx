// Import necessary dependencies and components from React and MUI
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
  Modal, 
  TextField, 
  Select, 
  MenuItem 
} from "@mui/material";

// Define the structure of the Article interface for type safety
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

// Main functional component for the SERC Analyst page
const SercAnalyst: React.FC = () => {
  // State variables to manage the list of articles and the selected article for modal interaction
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);

  // State variables for the form input fields in the modal
  const [sePractice, setSePractice] = useState("");
  const [claim, setClaim] = useState("");
  const [evidenceResult, setEvidenceResult] = useState("");
  const [researchType, setResearchType] = useState("");
  const [participants, setParticipants] = useState("");
  const [outcomeData, setOutcomeData] = useState("");

  // Fetch the list of articles from an API when the component is mounted
  useEffect(() => {
    axios.get<Article[]>("/api/articles") // Replace with your API endpoint
      .then(response => {
        setArticles(response.data); // Store the fetched articles in the state
        console.log("\n Response.Data:\n", response.data, "\n"); // Log the response data for debugging
      })
      .catch(error => console.error("Error fetching articles:", error)); // Handle errors if fetching fails
  }, []); // Empty dependency array ensures this runs only on component mount

  // Function to open the modal for extracting information from a specific article
  const openExtractModal = (article: Article) => {
    setSelectedArticle(article); // Set the currently selected article
    setIsExtractModalOpen(true); // Open the modal
  };

  // Function to close the extraction modal
  const closeExtractModal = () => {
    setIsExtractModalOpen(false); // Close the modal
  };

  // Function to handle the submission of extracted information
  const handleExtractRelevantInfo = () => {
    // Log the extracted information from the form fields
    console.log("Extracting Relevant Info...");
    console.log("SE Practice:", sePractice);
    console.log("Claim:", claim);
    console.log("Evidence Result:", evidenceResult);
    console.log("Research Type:", researchType);
    console.log("Participants:", participants);
    console.log("Outcome Data:", outcomeData);
    
    closeExtractModal(); // Close the modal after submission
  };

  return (
    <Container>
      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom>
        SERC Analyst Page
      </Typography>

      {/* Section for listing articles */}
      <Box marginBottom={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Articles for Review
        </Typography>
        {/* Table to display the list of articles */}
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
              {/* Render each article row */}
              {articles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>{article.JournalName}</TableCell>
                  <TableCell>
                    {/* Check if authors are available, otherwise show a fallback */}
                    {article.Authors?.length ? article.Authors.join(", ") : "No authors available"}
                  </TableCell>
                  <TableCell>{article.PubYear}</TableCell>
                  <TableCell>{article.JournalName}</TableCell>
                  <TableCell>{article.SEPractice}</TableCell>
                  <TableCell>{article.Perspective}</TableCell>
                  <TableCell>{article.Impressions}</TableCell>
                  <TableCell>
                    {/* Button to open the extraction modal */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openExtractModal(article)}
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

      {/* Modal to display article details and input fields for extracting information */}
      {selectedArticle && (
        <Modal open={isExtractModalOpen} onClose={closeExtractModal}>
          <Box 
            display="flex" 
            flexDirection="row" 
            style={{ margin: '50px auto', width: '80%', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}
          >
            {/* Article metadata and web viewer in the modal */}
            <Box width="50%" padding="16px">
              <Typography variant="h6">Article Viewer</Typography>
              <iframe
                src={selectedArticle.Link} // Display the article in an iframe
                width="100%"
                height="600px"
                style={{ border: "1px solid black" }}
                title="Article Viewer"
              />
            </Box>
            
            {/* Extraction form fields */}
            <Box width="50%" padding="16px">
              <Typography variant="h6">Extract Relevant Info</Typography>
              <TextField 
                fullWidth 
                label="SE Practice" 
                value={sePractice} 
                onChange={(e) => setSePractice(e.target.value)} 
                margin="normal" 
              />
              <TextField 
                fullWidth 
                label="Claim" 
                value={claim} 
                onChange={(e) => setClaim(e.target.value)} 
                margin="normal" 
              />
              <Select
                fullWidth
                label="Evidence Result"
                value={evidenceResult}
                onChange={(e) => setEvidenceResult(e.target.value)}
                margin="normal"
              >
                {/* Dropdown options for evidence results */}
                <MenuItem value="Supports">Supports</MenuItem>
                <MenuItem value="Contradicts">Contradicts</MenuItem>
              </Select>
              <TextField 
                fullWidth 
                label="Research Type" 
                value={researchType} 
                onChange={(e) => setResearchType(e.target.value)} 
                margin="normal" 
              />
              <TextField 
                fullWidth 
                label="Participants" 
                value={participants} 
                onChange={(e) => setParticipants(e.target.value)} 
                margin="normal" 
              />
              <TextField 
                fullWidth 
                label="Outcome Data" 
                value={outcomeData} 
                onChange={(e) => setOutcomeData(e.target.value)} 
                multiline 
                rows={4} 
                margin="normal" 
              />
              {/* Submit button for extracted information */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleExtractRelevantInfo}
              >
                Submit Extraction
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default SercAnalyst;
