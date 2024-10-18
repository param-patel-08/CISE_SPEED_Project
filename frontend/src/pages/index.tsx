// Import necessary React and Material UI components and icons
import React from "react";
import { Container, Typography, Button, Box, Paper, Stack } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ScienceIcon from '@mui/icons-material/Science';

// Functional component for the Home page
export default function Home() {
  return (
    // Container for setting the maximum width of the content and adding top/bottom margins
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
      {/* Paper component for the main card-like container with padding and shadow */}
      <Paper elevation={3} sx={{ p: 4 }}>
        
        {/* Main heading for the page */}
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Software Practice Empirical Evidence Database (SPEED)
        </Typography>

        {/* Subheading with a brief description */}
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Empowering software engineers with evidence-based insights into software engineering practices.
        </Typography>

        {/* Button to search the database, centered horizontally */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SearchIcon />} 
            size="large" 
            href="/articles"
          >
            Search the Database
          </Button>
        </Box>

        {/* A responsive Stack layout for arranging the three feature boxes */}
        <Box sx={{ overflow: "hidden", px: 2 }}>
          <Stack spacing={4} direction={{ xs: 'column', md: 'row' }}>
            
            {/* First feature: Extensive Research Articles */}
            <Box flex={1}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <LibraryBooksIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Extensive Research Articles
                  </Typography>
                  <Typography variant="body1" align="left" color="textSecondary">
                    SPEED compiles research from published academic papers, providing practitioners with insights
                    into software engineering practices, including Test-Driven Development, Agile, and Mob Programming.
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Second feature: Evidence-Based Decision Making */}
            <Box flex={1}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <ScienceIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Evidence-Based Decision Making
                  </Typography>
                  <Typography variant="body1" align="left" color="textSecondary">
                    By summarizing empirical evidence, SPEED helps software engineers determine which practices are most
                    effective, ensuring decisions are based on data rather than anecdotal experience.
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Third feature: Simplified Access */}
            <Box flex={1}>
              <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <LibraryBooksIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Simplified Access
                  </Typography>
                  <Typography variant="body1" align="left" color="textSecondary">
                    Search and filter the database to quickly find the empirical studies that support or reject claims,
                    simplifying access to peer-reviewed research.
                  </Typography>
                </Box>
              </Paper>
            </Box>

          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
