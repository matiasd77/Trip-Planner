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
  AccessTime,
  Category,
  AttachMoney,
  Explore,
} from '@mui/icons-material';
import { activities, trips } from '../services/api';
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
    backgroundImage: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
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

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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

interface Activity {
  id: number;
  name: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: number;
  rating: number;
  userId: number;
}

interface Trip {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  userId: number;
}

const Activities = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<number | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    category: '',
    price: '',
    rating: 0,
  });

  const queryClient = useQueryClient();

  const { data: tripsData, isLoading: isLoadingTrips } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => trips.getAll(Number(user?.id)).then((res) => res.data),
    enabled: !!user?.id,
  });

  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['activities', selectedTripId],
    queryFn: () => activities.getAll(Number(selectedTripId)).then((res) => res.data),
    enabled: !!selectedTripId,
  });

  const createMutation = useMutation({
    mutationFn: (newActivity: Omit<Activity, 'id'>) => activities.create({ ...newActivity, tripId: Number(selectedTripId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => activities.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingActivity(null);
    setFormData({
      name: '',
      location: '',
      date: '',
      time: '',
      category: '',
      price: '',
      rating: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      // Handle update
    } else {
      createMutation.mutate({
        ...formData,
        price: Number(formData.price),
        userId: Number(user?.id),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const categories = [
    'Adventure',
    'Cultural',
    'Food & Drink',
    'Nature',
    'Sports',
    'Entertainment',
    'Shopping',
    'Relaxation',
  ];

  if (isLoadingTrips || isLoadingActivities) {
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
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Activities
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: '#ffffff' }}>Select Trip</InputLabel>
                <Select
                  value={selectedTripId}
                  label="Select Trip"
                  onChange={(e) => setSelectedTripId(e.target.value as number)}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '& .MuiSelect-select': {
                      color: '#1a237e',
                    },
                    '& .MuiSelect-icon': {
                      color: '#1a237e',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                >
                  {tripsData?.map((trip: Trip) => (
                    <MenuItem 
                      key={trip.id} 
                      value={trip.id}
                      sx={{
                        color: '#1a237e',
                        '&:hover': {
                          backgroundColor: 'rgba(26, 35, 126, 0.1)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(26, 35, 126, 0.2)',
                          '&:hover': {
                            backgroundColor: 'rgba(26, 35, 126, 0.3)',
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
                startIcon={<AddIcon />}
                onClick={handleOpen}
                disabled={!selectedTripId}
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
                New Activity
              </Button>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <AnimatePresence>
              {activitiesData?.map((activity: Activity, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <StyledCard>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                            {activity.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {activity.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {new Date(activity.date).toLocaleDateString()} at {activity.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Category sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {activity.category}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AttachMoney sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            ${activity.price}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating 
                            value={activity.rating} 
                            readOnly 
                            precision={0.5}
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#1a237e',
                              },
                            }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, color: '#424242' }}>
                            ({activity.rating})
                          </Typography>
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
                        <Tooltip title="Edit Activity">
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
                        <Tooltip title="Delete Activity">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteMutation.mutate(activity.id)}
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
          {editingActivity ? 'Edit Activity' : 'New Activity'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <StyledTextField
                name="name"
                label="Activity Name"
                value={formData.name}
                onChange={handleChange}
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
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
                name="time"
                label="Time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <StyledFormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <StyledTextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
              <Box>
                <Typography component="legend" sx={{ mb: 1, color: '#1a237e' }}>Rating</Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      rating: newValue || 0
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
              {editingActivity ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </StyledDialog>
    </PageBackground>
  );
};

export default Activities; 