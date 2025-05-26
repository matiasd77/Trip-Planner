import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Trip Planner
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Plan your perfect trip with our comprehensive travel planning tools
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Plan Your Trip
            </Typography>
            <Typography paragraph>
              Create and manage your travel itineraries with ease
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/trips')}
            >
              Get Started
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Find Activities
            </Typography>
            <Typography paragraph>
              Discover exciting activities and attractions at your destination
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/activities')}
            >
              Explore Activities
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Book Accommodations
            </Typography>
            <Typography paragraph>
              Find and book the perfect place to stay
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/accommodations')}
            >
              View Options
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 