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
  Paper,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  LocationOn,
  CalendarToday,
  AccessTime,
  Explore,
} from '@mui/icons-material';
import { trips } from '../services/api';
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
    backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80")',
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

interface Trip {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  userId: number;
}

const Trips = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
  });

  const queryClient = useQueryClient();

  const { data: tripsData, isLoading } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => trips.getAll(Number(user?.id)).then((res) => res.data),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (newTrip: Omit<Trip, 'id'>) => trips.create({ ...newTrip, userId: Number(user?.id) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => trips.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTrip(null);
    setFormData({
      destination: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrip) {
      // Handle update
    } else {
      createMutation.mutate({
        ...formData,
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

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
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
              My Trips
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
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
              New Trip
            </Button>
          </Box>

          <Grid container spacing={4}>
            <AnimatePresence>
              {tripsData?.map((trip: Trip, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={trip.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <StyledCard>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationOn sx={{ mr: 1, color: '#1a237e' }} />
                          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                            {trip.destination}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {new Date(trip.startDate).toLocaleDateString()} -{' '}
                            {new Date(trip.endDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTime sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {calculateDuration(trip.startDate, trip.endDate)} days
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
                        <Tooltip title="Edit Trip">
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
                        <Tooltip title="Delete Trip">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteMutation.mutate(trip.id)}
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
          {editingTrip ? 'Edit Trip' : 'New Trip'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <StyledTextField
                name="destination"
                label="Destination"
                value={formData.destination}
                onChange={handleChange}
                required
                fullWidth
              />
              <StyledTextField
                name="startDate"
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
                name="endDate"
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
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
              {editingTrip ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </StyledDialog>
    </PageBackground>
  );
};

export default Trips; 