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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { transport } from '../services/api';

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
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Transport Options
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          New Transport
        </Button>
      </Box>

      <Grid container spacing={3}>
        {transportData?.map((item: Transport) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.type} - {item.company}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  From: {item.from}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  To: {item.to}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Departure: {new Date(item.departureTime).toLocaleString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Arrival: {new Date(item.arrivalTime).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingTransport ? 'Edit Transport' : 'Create New Transport'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
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
            </FormControl>
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="From"
              name="from"
              value={formData.from}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="To"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Departure Time"
              name="departureTime"
              type="datetime-local"
              value={formData.departureTime}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Arrival Time"
              name="arrivalTime"
              type="datetime-local"
              value={formData.arrivalTime}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTransport ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default TransportPage;
