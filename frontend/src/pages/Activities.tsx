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
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { activities, trips } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Activity {
  id: number;
  name: string;
  location: string;
  date: string;
  tripId: number;
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
    tripId: '',
  });

  const queryClient = useQueryClient();

  const { data: tripsData } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => trips.getAll(Number(user?.id)).then((res) => res.data),
    enabled: !!user?.id,
  });

  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ['activities', selectedTripId],
    queryFn: () => activities.getAll(Number(selectedTripId)).then((res) => res.data),
    enabled: !!selectedTripId,
  });

  const createMutation = useMutation({
    mutationFn: (newActivity: Omit<Activity, 'id'>) => activities.create(newActivity),
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
      tripId: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      // Handle update
    } else {
      if (typeof selectedTripId !== 'number') {
        return; // Don't submit if tripId is not a number
      }
      createMutation.mutate({
        name: formData.name,
        location: formData.location,
        date: formData.date,
        tripId: selectedTripId
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

  if (isLoading) {
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
          Activities
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Trip</InputLabel>
            <Select
              value={selectedTripId}
              label="Select Trip"
              onChange={(e) => setSelectedTripId(e.target.value as number)}
            >
              {tripsData?.map((trip: any) => (
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
            New Activity
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {activitiesData?.map((activity: Activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {activity.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Location: {activity.location}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(activity.date).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteMutation.mutate(activity.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingActivity ? 'Edit Activity' : 'Create New Activity'}</DialogTitle>
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
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <input type="hidden" name="tripId" value={selectedTripId} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingActivity ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Activities; 