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
  Rating,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Chip,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Flight as FlightIcon,
  Train as TrainIcon,
  DirectionsBus as BusIcon,
  DirectionsCar as CarIcon,
  LocalTaxi as TaxiIcon,
  DirectionsBoat as FerryIcon,
  MoreHoriz as OtherIcon,
  LocationOn,
  AccessTime,
  Business,
} from '@mui/icons-material';
import { transport } from '../services/api';
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
    backgroundImage: 'url("https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
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

interface Transport {
  id: number;
  type: string;
  company: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  tripId: number;
}

const transportTypes = [
  'Flight',
  'Train',
  'Bus',
  'Car Rental',
  'Taxi',
  'Ferry',
  'Other',
];

const TransportPage = () => {
  const [open, setOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    company: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
  });

  const queryClient = useQueryClient();

  const [selectedTripId, setSelectedTripId] = useState<number>(1); // TODO: Get this from route or props

  const { data: transportData, isLoading } = useQuery({
    queryKey: ['transport', selectedTripId],
    queryFn: () => transport.getAll(selectedTripId).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (newTransport: Omit<Transport, 'id'>) => transport.create(newTransport),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport'] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transport.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport'] });
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransport(null);
    setFormData({
      type: '',
      company: '',
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTransport) {
      // Handle update
    } else {
      const transportData = {
        type: formData.type,
        company: formData.company,
        from: formData.from,
        to: formData.to,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        tripId: selectedTripId
      };
      createMutation.mutate(transportData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'Flight':
        return <FlightIcon sx={{ fontSize: 24, color: '#1a237e' }} />;
      case 'Train':
        return <TrainIcon sx={{ fontSize: 24, color: '#1a237e' }} />;
      case 'Bus':
        return <BusIcon sx={{ fontSize: 24, color: '#1a237e' }} />;
      case 'Car Rental':
        return <CarIcon sx={{ fontSize: 24, color: '#1a237e' }} />;
      case 'Taxi':
        return <TaxiIcon sx={{ fontSize: 24, color: '#1a237e' }} />;
      case 'Ferry':
        return <FerryIcon sx={{ fontSize: 24, color: '#1a237e' }} />;
      default:
        return <OtherIcon sx={{ fontSize: 24, color: '#1a237e' }} />;
    }
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
              Transport Options
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
              New Transport
            </Button>
          </Box>

          <Grid container spacing={4}>
            <AnimatePresence>
              {transportData?.map((item: Transport, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <StyledCard>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getTransportIcon(item.type)}
                          <Typography variant="h5" component="h2" sx={{ ml: 1, fontWeight: 600, color: '#1a237e' }}>
                            {item.type}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Business sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {item.company}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {item.from} → {item.to}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTime sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                          <Typography variant="body1" sx={{ color: '#424242' }}>
                            {new Date(item.departureTime).toLocaleString()} - {new Date(item.arrivalTime).toLocaleString()}
                          </Typography>
                        </Box>
                        <Chip 
                          label="View Details"
                          sx={{ 
                            mt: 2,
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
                        <Tooltip title="Edit Transport">
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
                        <Tooltip title="Delete Transport">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteMutation.mutate(item.id)}
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
          {editingTransport ? 'Edit Transport' : 'New Transport'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <StyledFormControl fullWidth>
                <InputLabel>Transport Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  required
                  label="Transport Type"
                >
                  {transportTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <StyledTextField
                name="company"
                label="Company"
                value={formData.company}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <StyledTextField
                name="from"
                label="From"
                value={formData.from}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <StyledTextField
                name="to"
                label="To"
                value={formData.to}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <StyledTextField
                name="departureTime"
                label="Departure Time"
                type="datetime-local"
                value={formData.departureTime}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
                name="arrivalTime"
                label="Arrival Time"
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={handleInputChange}
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
              {editingTransport ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </StyledDialog>
    </PageBackground>
  );
};

export default TransportPage;
