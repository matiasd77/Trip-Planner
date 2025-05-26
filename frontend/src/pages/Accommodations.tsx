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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { accommodations, trips } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  if (isLoadingTrips || isLoadingAccommodations) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Accommodations
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Trip</InputLabel>
            <Select
              value={selectedTripId}
              label="Select Trip"
              onChange={(e) => setSelectedTripId(e.target.value as number)}
            >
              {tripsData?.map((trip) => (
                <MenuItem key={trip.id} value={trip.id}>
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
          >
            New Accommodation
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {accommodationsData?.map((accommodation: Accommodation) => (
          <Grid item xs={12} sm={6} md={4} key={accommodation.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {accommodation.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {accommodation.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Location: {accommodation.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Type: {accommodation.type}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Price: ${accommodation.price}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Rating: {accommodation.rating}/5
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Check-in: {new Date(accommodation.checkIn).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Check-out: {new Date(accommodation.checkOut).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteMutation.mutate(accommodation.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingAccommodation ? 'Edit Accommodation' : 'Create New Accommodation'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ min: 1, max: 5 }}
            />
            <TextField
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              margin="normal"
              required
              select
            >
              <MenuItem value="HOTEL">Hotel</MenuItem>
              <MenuItem value="HOSTEL">Hostel</MenuItem>
              <MenuItem value="APARTMENT">Apartment</MenuItem>
              <MenuItem value="RESORT">Resort</MenuItem>
              <MenuItem value="BED_AND_BREAKFAST">Bed and Breakfast</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Check-in Date"
              name="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Check-out Date"
              name="checkOut"
              type="date"
              value={formData.checkOut}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingAccommodation ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Accommodations; 