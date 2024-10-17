// pages/serc-analyst.tsx
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);

  const [sePractice, setSePractice] = useState("");
  const [claim, setClaim] = useState("");
  const [evidenceResult, setEvidenceResult] = useState("");
  const [researchType, setResearchType] = useState("");
  const [participants, setParticipants] = useState("");
  const [outcomeData, setOutcomeData] = useState("");

  useEffect(() => {
    //fetch articles using API for analysis
    axios.get<Article[]>("/api/articles/shortlisted")
      .then(response => {
        setArticles(response.data);
        console.log("\n Response.Data:\n", response.data, "\n");
      })
      .catch(error => console.error("Error fetching articles:", error));
  }, []);

  const openExtractModal = (article: Article) => {
    setSelectedArticle(article);
    setIsExtractModalOpen(true);
  };

  const closeExtractModal = () => {
    setIsExtractModalOpen(false);
  };

  const handleExtractRelevantInfo = () => {
    //to be completed 
    console.log("SE Practice:", sePractice);
    console.log("Claim:", claim);
    console.log("Evidence Result:", evidenceResult);
    console.log("Research Type:", researchType);
    console.log("Participants:", participants);
    console.log("Outcome Data:", outcomeData);
    closeExtractModal();
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

      {selectedArticle && (
        <Modal open={isExtractModalOpen} onClose={closeExtractModal}>
          <Box display="flex" flexDirection="row" style={{ margin: '50px auto', width: '80%', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
            
            {/*article metadata and web viewer modal */}
            <Box width="50%" padding="16px">
              <Typography variant="h6">Article Viewer</Typography>
              <iframe
                src={selectedArticle.Link}
                width="100%"
                height="600px"
                style={{ border: "1px solid black" }}
                title="Article Viewer"
              />
            </Box>
            
            {/* extraction modal */}
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
