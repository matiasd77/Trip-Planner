import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Chip,
  Skeleton,
  Tooltip,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  LocationOn,
  CalendarToday,
  Hotel,
  Wifi,
  Pool,
  Restaurant,
  Explore,
  AttachMoney,
} from '@mui/icons-material';
import { accommodations, trips } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

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
    backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
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
            boxShadow: 'none',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: 'none',
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
      boxShadow: 'none',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: 'none',
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    transition: 'all 0.4s ease',
          '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        transform: 'translateY(-4px)',
        boxShadow: 'none',
      },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: 'none',
    },
  },
}));

interface Trip {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  userId: number;
}

interface Accommodation {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  type: string;
  amenities: string[];
  checkIn: string;
  checkOut: string;
  tripId: number;
}

const Accommodations = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<number | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    rating: '',
    type: '',
    amenities: [] as string[],
    checkIn: '',
    checkOut: '',
    tripId: '',
  });

  const queryClient = useQueryClient();

  const { data: tripsData, isLoading: isLoadingTrips, error: tripsError } = useQuery<Trip[]>({
    queryKey: ['trips', user?.id],
    queryFn: () => trips.getAll(Number(user?.id)).then((res) => res.data),
    enabled: !!user?.id,
  });

  const { data: accommodationsData, isLoading: isLoadingAccommodations } = useQuery({
    queryKey: ['accommodations', selectedTripId],
    queryFn: () => accommodations.getAll(Number(selectedTripId)).then((res) => res.data),
    enabled: !!selectedTripId,
  });

  const createMutation = useMutation({
    mutationFn: (newAccommodation: Omit<Accommodation, 'id'>) => accommodations.create(newAccommodation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => accommodations.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccommodation(null);
    setFormData({
      name: '',
      description: '',
      location: '',
      price: '',
      rating: '',
      type: '',
      amenities: [],
      checkIn: '',
      checkOut: '',
      tripId: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccommodation) {
      // Handle update
    } else {
      createMutation.mutate({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: Number(formData.price),
        rating: Number(formData.rating),
        type: formData.type,
        amenities: formData.amenities,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        tripId: Number(selectedTripId)
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string | string[]>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  if (isLoadingTrips || isLoadingAccommodations) {
    return (
      <PageBackground>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Skeleton variant="text" width={200} height={40} />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </PageBackground>
    );
  }

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
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <Typography 
              variant="h3" 
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#ffffff',
                textShadow: 'none',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                animation: 'titleGlow 3s ease-in-out infinite alternate',
                '@keyframes titleGlow': {
                  '0%': {
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                  },
                  '100%': {
                    filter: 'drop-shadow(2px 2px 8px rgba(255,255,255,0.2))',
                  },
                },
              }}
            >
              Accommodations
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel sx={{ 
                  color: '#1a237e',
                  fontWeight: 600,
                  textShadow: 'none'
                }}>
                  Select Trip
                </InputLabel>
                <Select
                  value={selectedTripId}
                  label="Select Trip"
                  onChange={(e) => setSelectedTripId(e.target.value as number)}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      color: '#1a237e',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 1.5,
                    },
                    '& .MuiSelect-icon': {
                      color: '#1a237e',
                      fontSize: '1.5rem',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'none',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {tripsData?.map((trip: Trip) => (
                    <MenuItem 
                      key={trip.id} 
                      value={trip.id}
                      sx={{
                        color: '#1a237e',
                        fontWeight: 500,
                        fontSize: '1rem',
                        py: 1.5,
                        mx: 1,
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          transform: 'translateX(4px)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(102, 126, 234, 0.2)',
                          color: '#667eea',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.3)',
                          },
                        },
                      }}
                    >
                      {trip.destination}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={handleOpen}
                disabled={!selectedTripId}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  boxShadow: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    boxShadow: 'none',
                    transform: 'translateY(-3px) scale(1.02)',
                  },
                  '&:disabled': {
                    background: 'rgba(158, 158, 158, 0.5)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: 'none',
                    transform: 'none',
                  },
                }}
              >
                New Accommodation
              </Button>
            </Box>
          </Box>

          {!selectedTripId ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 12,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              mx: 2
            }}>
              <Typography variant="h5" sx={{ 
                color: '#ffffff', 
                mb: 2,
                fontWeight: 600,
                textShadow: 'none'
              }}>
                🏨 Select a Trip First
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 400,
                mx: 'auto'
              }}>
                Choose a trip from the dropdown above to start planning your accommodations and places to stay!
              </Typography>
            </Box>
          ) : !accommodationsData || accommodationsData.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 12,
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              mx: 2
            }}>
              <Typography variant="h5" sx={{ 
                color: '#667eea', 
                mb: 2,
                fontWeight: 600,
                textShadow: 'none'
              }}>
                🏠 Ready to Book Accommodations!
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 400,
                mx: 'auto'
              }}>
                No accommodations planned yet. Click the "New Accommodation" button to start finding places to stay!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              <AnimatePresence>
                {accommodationsData.map((accommodation: Accommodation, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={accommodation.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <StyledCard>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                            {accommodation.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {accommodation.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {new Date(accommodation.checkIn).toLocaleDateString()} - {new Date(accommodation.checkOut).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoney sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            ${accommodation.price} per night
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating 
                            value={accommodation.rating} 
                            readOnly 
                            precision={0.5}
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#1a237e',
                              },
                            }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, color: '#424242' }}>
                            ({accommodation.rating})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {accommodation.amenities.map((amenity, index) => (
                            <Chip
                              key={index}
                              label={amenity}
                              size="small"
                              sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                                color: '#ffffff',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                                },
                              }}
                            />
                          ))}
                        </Box>
                        <Chip 
                          icon={<Explore />}
                          label="View Details"
                          sx={{ 
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                            color: '#ffffff',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                            },
                          }}
                        />
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Tooltip title="Edit Accommodation">
                          <IconButton 
                            size="small" 
                            sx={{
                              color: '#1a237e',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                color: '#3949ab',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Accommodation">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteMutation.mutate(accommodation.id)}
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </StyledCard>
                  </motion.div>
                </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </motion.div>
      </Container>

      <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          color: '#1a237e',
          fontWeight: 600,
          fontSize: '1.5rem',
          textAlign: 'center',
          pt: 3
        }}>
          {editingAccommodation ? 'Edit Accommodation' : 'New Accommodation'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <StyledTextField
                name="name"
                label="Accommodation Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <StyledTextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
                fullWidth
              />
              <StyledTextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                required
                fullWidth
              />
              <StyledTextField
                name="price"
                label="Price per Night"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
              <StyledFormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Hotel">Hotel</MenuItem>
                  <MenuItem value="Resort">Resort</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                  <MenuItem value="Hostel">Hostel</MenuItem>
                  <MenuItem value="Bed & Breakfast">Bed & Breakfast</MenuItem>
                </Select>
              </StyledFormControl>
              <Box>
                <Typography component="legend" sx={{ mb: 1, color: '#1a237e' }}>Rating</Typography>
                <Rating
                  name="rating"
                  value={Number(formData.rating)}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      rating: newValue?.toString() || '0'
                    }));
                  }}
                  precision={0.5}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#1a237e',
                    },
                  }}
                />
              </Box>
              <StyledTextField
                name="checkIn"
                label="Check-in Date"
                type="date"
                value={formData.checkIn}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
                name="checkOut"
                label="Check-out Date"
                type="date"
                value={formData.checkOut}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <StyledFormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  name="amenities"
                  value={formData.amenities}
                  label="Amenities"
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value}
                          size="small"
                          sx={{
                            background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                            color: '#ffffff',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="WiFi">WiFi</MenuItem>
                  <MenuItem value="Pool">Pool</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Gym">Gym</MenuItem>
                  <MenuItem value="Spa">Spa</MenuItem>
                  <MenuItem value="Parking">Parking</MenuItem>
                  <MenuItem value="Air Conditioning">Air Conditioning</MenuItem>
                  <MenuItem value="Room Service">Room Service</MenuItem>
                </Select>
              </StyledFormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: '#1a237e',
                '&:hover': {
                  backgroundColor: 'rgba(26, 35, 126, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                color: '#ffffff',
                '&:hover': {
                  background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                },
              }}
            >
              {editingAccommodation ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </StyledDialog>
    </PageBackground>
  );
};

export default Accommodations; 