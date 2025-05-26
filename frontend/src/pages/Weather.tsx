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
} from '@mui/material';
import {
  WbSunny as SunnyIcon,
  Cloud as CloudIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Thunderstorm as StormIcon,
} from '@mui/icons-material';
import { weather } from '../services/api';

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

const getWeatherIcon = (condition?: string) => {
  if (!condition) return <CloudIcon sx={{ fontSize: 40 }} />;
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return <SunnyIcon sx={{ fontSize: 40 }} />;
  } else if (conditionLower.includes('cloud')) {
    return <CloudIcon sx={{ fontSize: 40 }} />;
  } else if (conditionLower.includes('rain')) {
    return <RainIcon sx={{ fontSize: 40 }} />;
  } else if (conditionLower.includes('snow')) {
    return <SnowIcon sx={{ fontSize: 40 }} />;
  } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
    return <StormIcon sx={{ fontSize: 40 }} />;
  }
  return <CloudIcon sx={{ fontSize: 40 }} />;
};

const Weather = () => {
  const [location, setLocation] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const { 
    data: currentWeather, 
    isLoading: isLoadingCurrent, 
    error: currentError 
  } = useQuery<CurrentWeatherData>({
    queryKey: ['currentWeather', searchLocation],
    queryFn: () => weather.getCurrentWeather(searchLocation).then((res) => {
      console.log('Current weather response:', res.data);
      return res.data;
    }),
    enabled: !!searchLocation,
  });

  const { 
    data: forecastData, 
    isLoading: isLoadingForecast, 
    error: forecastError 
  } = useQuery<ForecastData>({
    queryKey: ['forecast', searchLocation],
    queryFn: () => weather.getForecast(searchLocation).then((res) => {
      console.log('Forecast response:', res.data);
      return res.data;
    }),
    enabled: !!searchLocation,
  });

  const isLoading = isLoadingCurrent || isLoadingForecast;
  const error = currentError || forecastError;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLocation(location);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Weather Forecast
        </Typography>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              fullWidth
              label="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, London, Tokyo"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!location.trim()}
            >
              Search
            </Button>
          </Box>
        </form>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Error loading weather data. Please try again.
          </Alert>
        )}

        {currentWeather && forecastData && (
          <>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getWeatherIcon(currentWeather.description)}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h5">
                      {currentWeather.cityName}, {currentWeather.country}
                    </Typography>
                    <Typography variant="h3" sx={{ my: 1 }}>
                      {currentWeather.temperature}°C
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {currentWeather.description}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Humidity: {currentWeather.humidity}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Wind Speed: {currentWeather.windSpeed} km/h
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Typography variant="h6" gutterBottom>
              Forecast
            </Typography>
            <Grid container spacing={2}>
              {forecastData.dailyForecasts.map((day: DailyForecastData, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getWeatherIcon(day.description)}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle1">
                            {day.dateText}
                          </Typography>
                          <Typography variant="h6">
                            {day.temperature}°C
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {day.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Weather;
