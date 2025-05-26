import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  WbSunny as SunnyIcon,
  Cloud as CloudIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Thunderstorm as StormIcon,
  Search as SearchIcon,
  LocationOn,
  Grain,
  WaterDrop,
  Speed,
  Thermostat,
} from '@mui/icons-material';
import { weather } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface CurrentWeatherData {
  cityName: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  icon: string;
  country: string;
  timestamp: number;
}

interface DailyForecastData {
  timestamp: number;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  icon: string;
  dateText: string;
}

interface ForecastData {
  cityName: string;
  country: string;
  timezone: string;
  dailyForecasts: DailyForecastData[];
}

const PageBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  position: 'relative',
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    zIndex: -1,
    filter: 'brightness(0.9) contrast(1.1) saturate(1.2)',
    animation: 'backgroundZoom 30s ease-in-out infinite alternate',
  },
  '@keyframes backgroundZoom': {
    '0%': {
      transform: 'scale(1)',
    },
    '100%': {
      transform: 'scale(1.1)',
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '24px',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transition: 'all 0.4s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
  },
}));

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  feelsLike: number;
}

const WeatherPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const { 
    data: currentWeather, 
    isLoading: isLoadingCurrent, 
    error: currentError 
  } = useQuery({
    queryKey: ['currentWeather', searchLocation],
    queryFn: () => weather.getCurrentWeather(searchLocation).then((res) => res.data),
    enabled: !!searchLocation,
  });

  const { 
    data: forecastData, 
    isLoading: isLoadingForecast, 
    error: forecastError 
  } = useQuery({
    queryKey: ['forecast', searchLocation],
    queryFn: () => weather.getForecast(searchLocation).then((res) => res.data),
    enabled: !!searchLocation,
  });

  const isLoading = isLoadingCurrent || isLoadingForecast;
  const error = currentError || forecastError;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchLocation(searchQuery);
    }
  };

  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <CloudIcon sx={{ fontSize: 40, color: '#1a237e' }} />;
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <SunnyIcon sx={{ fontSize: 40, color: '#1a237e' }} />;
    } else if (conditionLower.includes('cloud')) {
      return <CloudIcon sx={{ fontSize: 40, color: '#1a237e' }} />;
    } else if (conditionLower.includes('rain')) {
      return <RainIcon sx={{ fontSize: 40, color: '#1a237e' }} />;
    } else if (conditionLower.includes('snow')) {
      return <SnowIcon sx={{ fontSize: 40, color: '#1a237e' }} />;
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return <StormIcon sx={{ fontSize: 40, color: '#1a237e' }} />;
    }
    return <CloudIcon sx={{ fontSize: 40, color: '#1a237e' }} />;
  };

  return (
    <PageBackground>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box 
            sx={{ 
              mt: 4, 
              mb: 6, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <Typography 
              variant="h3" 
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Weather Forecast
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: 600 }}>
              <StyledTextField
                fullWidth
                placeholder="Enter location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: '#1a237e' }} />,
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #ffffff 30%, #f5f5f5 90%)',
                  color: '#1a237e',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <SearchIcon />
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              Error loading weather data. Please try again.
            </Alert>
          )}

          {isLoading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
              </Grid>
            </Grid>
          ) : currentWeather && (
            <>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <StyledCard>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          {getWeatherIcon(currentWeather.description)}
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 600 }}>
                              {currentWeather.cityName}, {currentWeather.country}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#424242' }}>
                              {currentWeather.description}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="h2" 
                            sx={{ 
                              ml: 'auto', 
                              color: '#1a237e',
                              fontWeight: 700,
                            }}
                          >
                            {currentWeather.temperature}°C
                          </Typography>
                        </Box>
                        <Grid container spacing={3}>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Thermostat sx={{ color: '#1a237e' }} />
                              <Box>
                                <Typography variant="body2" sx={{ color: '#424242' }}>
                                  Feels Like
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1a237e' }}>
                                  {currentWeather.feelsLike}°C
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <WaterDrop sx={{ color: '#1a237e' }} />
                              <Box>
                                <Typography variant="body2" sx={{ color: '#424242' }}>
                                  Humidity
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1a237e' }}>
                                  {currentWeather.humidity}%
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Speed sx={{ color: '#1a237e' }} />
                              <Box>
                                <Typography variant="body2" sx={{ color: '#424242' }}>
                                  Wind Speed
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1a237e' }}>
                                  {currentWeather.windSpeed} km/h
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </StyledCard>
                  </motion.div>
                </Grid>
              </Grid>

              {forecastData && (
                <Box sx={{ mt: 4 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#ffffff',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                      mb: 3 
                    }}
                  >
                    Forecast
                  </Typography>
                  <Grid container spacing={3}>
                    {forecastData.dailyForecasts.map((day, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <StyledCard>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                {getWeatherIcon(day.description)}
                                <Box sx={{ ml: 2 }}>
                                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                                    {day.dateText}
                                  </Typography>
                                  <Typography variant="body1" sx={{ color: '#424242' }}>
                                    {day.description}
                                  </Typography>
                                </Box>
                                <Typography 
                                  variant="h4" 
                                  sx={{ 
                                    ml: 'auto', 
                                    color: '#1a237e',
                                    fontWeight: 700,
                                  }}
                                >
                                  {day.temperature}°C
                                </Typography>
                              </Box>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WaterDrop sx={{ color: '#1a237e', fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ color: '#424242' }}>
                                      {day.humidity}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Speed sx={{ color: '#1a237e', fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ color: '#424242' }}>
                                      {day.windSpeed} km/h
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </StyledCard>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}
        </motion.div>
      </Container>
    </PageBackground>
  );
};

export default WeatherPage;
