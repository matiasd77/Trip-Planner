import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardMedia, Avatar, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '90vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
        transform: 'translateY(-12px) scale(1.02)',
        boxShadow: 'none',
      },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const AnimatedBox = styled(motion.div)({
  width: '100%',
});

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!(userId && token));
  }, []);

  const features = [
    {
      title: 'Plan Your Trip',
      description: 'Create and manage your travel itineraries with ease',
      image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3',
      path: '/trips',
    },
    {
      title: 'Find Activities',
      description: 'Discover exciting activities and attractions at your destination',
      image: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?ixlib=rb-4.0.3',
      path: '/activities',
    },
    {
      title: 'Book Accommodations',
      description: 'Find and book the perfect place to stay',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3',
      path: '/accommodations',
    },
  ];

  // Conditional features based on authentication
  const getFeatures = () => {
    if (isAuthenticated) {
      return features;
    }
    return features.map(feature => ({
      ...feature,
      path: '/login',
      description: feature.description + ' (Login required)'
    }));
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: 'This trip planner made organizing my vacation so much easier!',
    },
    {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      comment: 'The best travel planning tool I\'ve ever used. Highly recommended!',
    },
    {
      name: 'Emma Davis',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 4,
      comment: 'Great features and easy to use. Made my trip planning stress-free!',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 3,
                textShadow: 'none',
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              Plan Your Dream Trip
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                mb: 6,
                textShadow: 'none',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              Discover, plan, and book your perfect adventure with our comprehensive travel planning platform
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/trips')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                fontSize: '1.2rem',
                py: 2,
                px: 4,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              Start Planning Now
            </Button>
          </AnimatedBox>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: 12, mb: 12 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 8 }}
        >
          Features
        </Typography>
                  <Grid container spacing={6}>
            {getFeatures().map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <AnimatedBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <FeatureCard>
                  <CardMedia
                    component="img"
                    height="240"
                    image={feature.image}
                    alt={feature.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography paragraph sx={{ mb: 4, color: 'text.secondary' }}>
                      {feature.description}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate(feature.path)}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </FeatureCard>
              </AnimatedBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ mb: 8 }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={6}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <AnimatedBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <TestimonialCard>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mb: 3,
                        border: '4px solid white',
                        boxShadow: 'none'
                      }}
                    />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Rating 
                      value={testimonial.rating} 
                      readOnly 
                      sx={{ mb: 3, color: 'primary.main' }} 
                    />
                    <Typography 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        fontStyle: 'italic'
                      }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                  </TestimonialCard>
                </AnimatedBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ my: 12 }}>
        <AnimatedBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
              color: 'white',
              p: { xs: 4, md: 8 },
              borderRadius: 4,
              textAlign: 'center',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              {isAuthenticated ? 'Ready to Plan Your Next Trip?' : 'Ready to Start Your Adventure?'}
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, opacity: 0.9 }}>
              {isAuthenticated 
                ? 'Start planning your next amazing journey with our comprehensive tools'
                : 'Join thousands of happy travelers who plan their trips with us'
              }
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(isAuthenticated ? '/trips' : '/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '1.2rem',
                py: 2,
                px: 6,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {isAuthenticated ? 'Start Planning' : 'Sign Up Now'}
            </Button>
          </Box>
        </AnimatedBox>
      </Container>
    </Box>
  );
};

export default Home; 