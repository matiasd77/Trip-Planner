// Import React hooks for state management and side effects
import React, { useState } from 'react';
// Import React Query hooks for data fetching, mutations, and cache management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Import Material-UI components for the user interface
import {
  Container,        // Responsive container for layout
  Typography,       // Text components with different variants
  Button,           // Interactive button component
  Grid,             // CSS Grid layout system
  Card,             // Card container for content
  CardContent,      // Content area within cards
  CardActions,      // Action buttons area within cards
  Dialog,           // Modal dialog component
  DialogTitle,      // Title for dialogs
  DialogContent,    // Content area for dialogs
  DialogActions,    // Action buttons for dialogs
  TextField,        // Input field component
  Box,              // Flexible box container
  IconButton,       // Icon-only button
  Chip,             // Small labeled component
  Skeleton,         // Loading placeholder
  Tooltip,          // Hover tooltip
  Paper,            // Paper-like surface component
} from '@mui/material';
// Import Material-UI icons for visual elements
import { 
  Add as AddIcon,           // Plus icon for adding new items
  Delete as DeleteIcon,     // Trash icon for deletion
  Edit as EditIcon,         // Pencil icon for editing
  LocationOn,               // Location pin icon
  CalendarToday,            // Calendar icon
  AccessTime,               // Clock icon
  Explore,                  // Compass icon
} from '@mui/icons-material';
// Import API service for trip operations
import { trips } from '../services/api';
// Import authentication context hook
import { useAuth } from '../context/AuthContext';
// Import Framer Motion for animations
import { motion, AnimatePresence } from 'framer-motion';
// Import Material-UI styled components for custom styling
import { styled } from '@mui/material/styles';

// Styled component for the page background with animated background image
const PageBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',        // Full viewport height
  position: 'relative',      // For positioning the background image
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)', // Dark overlay
  '&::before': {             // Pseudo-element for background image
    content: '""',           // Required for pseudo-element
    position: 'fixed',       // Fixed positioning for parallax effect
    top: 0, left: 0,        // Position at top-left corner
    width: '100%', height: '100%', // Full screen coverage
    backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80")', // Travel background image
    backgroundSize: 'cover',        // Cover entire container
    backgroundPosition: 'center',   // Center the image
    backgroundRepeat: 'no-repeat',  // Don't repeat the image
    backgroundAttachment: 'fixed',  // Fixed for parallax effect
    zIndex: -1,                     // Behind other content
    filter: 'brightness(0.9) contrast(1.1) saturate(1.2)', // Image adjustments
    animation: 'backgroundZoom 30s ease-in-out infinite alternate', // Slow zoom animation
  },
  '@keyframes backgroundZoom': {    // CSS animation definition
    '0%': { transform: 'scale(1)' },      // Start at normal size
    '100%': { transform: 'scale(1.1)' },  // End at 110% size
  },
}));

// Styled component for cards with hover effects and glassmorphism
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',                    // Full height of grid item
  display: 'flex',                   // Flexbox layout
  flexDirection: 'column',           // Stack children vertically
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth transition
  background: 'rgba(255, 255, 255, 0.95)',             // Semi-transparent white
  backdropFilter: 'blur(16px)',                          // Background blur effect
  border: '1px solid rgba(255, 255, 255, 0.4)',        // Subtle border
  borderRadius: '24px',                                   // Rounded corners
  overflow: 'hidden',                                     // Hide overflow content
  '&:hover': {                                            // Hover state
    transform: 'translateY(-12px) scale(1.02)',           // Lift up and scale slightly
            boxShadow: 'none',        // No shadow for flat design
  },
}));

// Styled component for modal dialogs with glassmorphism
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {           // Target the dialog paper
    borderRadius: 24,                // Rounded corners
    background: 'rgba(255, 255, 255, 0.98)', // Nearly opaque white
    backdropFilter: 'blur(16px)',            // Background blur
    border: '1px solid rgba(255, 255, 255, 0.4)', // Subtle border
            boxShadow: 'none', // No shadow for flat design
  },
}));

// Styled component for text input fields with enhanced styling
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {     // Target the input root
    borderRadius: 16,                // Rounded corners
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent background
    transition: 'all 0.4s ease',                    // Smooth transition
    '&:hover': {                                     // Hover state
      backgroundColor: 'rgba(255, 255, 255, 1)',    // Fully opaque on hover
      transform: 'translateY(-4px)',                 // Lift up slightly
      boxShadow: 'none',  // No shadow for flat design
    },
    '&.Mui-focused': {                               // Focus state
      backgroundColor: 'rgba(255, 255, 255, 1)',    // Fully opaque when focused
      boxShadow: 'none',  // No shadow for flat design
    },
  },
}));

// TypeScript interface defining the structure of a Trip object
interface Trip {
  id: number;           // Unique identifier for the trip
  destination: string;  // Destination name
  startDate: string;    // Start date in ISO string format
  endDate: string;      // End date in ISO string format
  userId: number;       // ID of the user who owns this trip
}

// Main Trips component function
const Trips = () => {
  // Get user information from authentication context
  const { user } = useAuth();
  
  // State for managing the dialog (modal) open/close state
  const [open, setOpen] = useState(false);
  
  // State for storing the trip being edited (null if creating new)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  
  // State for form data with initial empty values
  const [formData, setFormData] = useState({
    destination: '',    // Trip destination
    startDate: '',      // Start date
    endDate: '',        // End date
  });

  // Get React Query client for cache management
  const queryClient = useQueryClient();

  // Query hook to fetch trips data for the current user
  const { data: tripsData, isLoading, error } = useQuery({
    queryKey: ['trips', user?.id],                    // Cache key for this query
    queryFn: () => trips.getAll(Number(user?.id)).then((res) => res.data), // Function to fetch data
    enabled: !!user?.id,                              // Only run query if user ID exists
  });

  // Debug logging to help troubleshoot data fetching
  console.log('Trips component - User:', user);
  console.log('Trips component - Trips data:', tripsData);
  console.log('Trips component - Loading:', isLoading);
  console.log('Trips component - Error:', error);

  // Mutation hook for creating new trips
  const createMutation = useMutation({
    mutationFn: (newTrip: Omit<Trip, 'id'>) => trips.create({ ...newTrip, userId: Number(user?.id) }), // Function to create trip
    onSuccess: () => {                                                                                  // On successful creation
      queryClient.invalidateQueries({ queryKey: ['trips'] });                                           // Refresh trips data
      handleClose();                                                                                    // Close the dialog
    },
  });

  // Mutation hook for deleting trips
  const deleteMutation = useMutation({
    mutationFn: (id: number) => trips.delete(id),     // Function to delete trip
    onSuccess: () => {                                // On successful deletion
      queryClient.invalidateQueries({ queryKey: ['trips'] }); // Refresh trips data
    },
  });

  // Function to open the dialog for creating/editing trips
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog and reset form data
  const handleClose = () => {
    setOpen(false);                    // Close dialog
    setEditingTrip(null);              // Clear editing state
    setFormData({                      // Reset form to empty values
      destination: '',
      startDate: '',
      endDate: '',
    });
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();                 // Prevent default form submission
    if (editingTrip) {                 // If editing existing trip
      // Handle update (not implemented yet)
    } else {                           // If creating new trip
      createMutation.mutate({          // Create new trip
        ...formData,                   // Spread form data
        userId: Number(user?.id),      // Add user ID
      });
    }
  };

  // Function to handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;  // Extract field name and value
    setFormData((prev) => ({           // Update form data
      ...prev,                         // Keep existing values
      [name]: value,                   // Update specific field
    }));
  };

  // Function to calculate trip duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);     // Convert start date string to Date object
    const end = new Date(endDate);         // Convert end date string to Date object
    const diffTime = Math.abs(end.getTime() - start.getTime()); // Calculate time difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    return diffDays;                       // Return number of days
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <PageBackground>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            {/* Loading skeleton for page title */}
            <Skeleton variant="text" width={200} height={40} />
            {/* Loading skeleton for trip cards */}
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

  // Main component render
  return (
    <PageBackground>
      <Container maxWidth="lg">
        {/* Animated entrance effect for the entire page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}    // Start invisible and below
          animate={{ opacity: 1, y: 0 }}     // Animate to visible and normal position
          transition={{ duration: 0.6 }}      // Animation duration
        >
          {/* Header section with title and add button */}
          <Box 
            sx={{ 
              mt: 4,                          // Top margin
              mb: 6,                          // Bottom margin
              display: 'flex',                // Flexbox layout
              justifyContent: 'space-between', // Space items apart
              alignItems: 'center'            // Center items vertically
            }}
          >
            {/* Page title with animated glow effect */}
            <Typography 
              variant="h3"                    // Large heading variant
              component="h1"                  // Semantic HTML h1 element
              sx={{
                fontWeight: 800,              // Extra bold font weight
                color: '#ffffff',              // White text color
                textShadow: 'none', // No text shadow for flat design
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)', // Gradient background
                backgroundClip: 'text',       // Clip background to text
                WebkitBackgroundClip: 'text', // Webkit support for background clip
                WebkitTextFillColor: 'transparent', // Make text transparent to show background
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))', // Drop shadow filter
                animation: 'titleGlow 3s ease-in-out infinite alternate', // Glow animation
                '@keyframes titleGlow': {     // Keyframe animation definition
                  '0%': { filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' },
                  '100%': { filter: 'drop-shadow(2px 2px 8px rgba(255,255,255,0.2))' },
                },
              }}
            >
              My Trips
            </Typography>
            
            {/* Add new trip button with enhanced styling */}
            <Button
              variant="contained"             // Filled button style
              startIcon={<AddIcon sx={{ fontSize: '1.2rem' }} />} // Plus icon
              onClick={handleOpen}            // Open dialog on click
              sx={{
                py: 2,                       // Vertical padding
                px: 4,                       // Horizontal padding
                borderRadius: 3,              // Rounded corners
                fontSize: '1.1rem',          // Font size
                fontWeight: 600,              // Font weight
                textTransform: 'none',        // No text transformation
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Modern purple-blue gradient
                color: '#ffffff',             // White text
                boxShadow: 'none', // No shadow for flat design
                border: '2px solid rgba(255, 255, 255, 0.2)',    // Subtle border
                backdropFilter: 'blur(10px)',                     // Background blur
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth transition
                '&:hover': {                  // Hover state
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', // Reverse gradient
                  boxShadow: 'none',               // No shadow for flat design
                  transform: 'translateY(-3px) scale(1.02)',                        // Lift and scale
                },
              }}
            >
              New Trip
            </Button>
          </Box>

          {/* Conditional rendering based on data availability */}
          {!tripsData || tripsData.length === 0 ? (
            /* Empty state message when no trips exist */
            <Box sx={{
              textAlign: 'center',            // Center text
              py: 12,                         // Vertical padding
              background: 'rgba(102, 126, 234, 0.1)', // Purple-tinted background
              borderRadius: 4,                // Rounded corners
              backdropFilter: 'blur(10px)',  // Background blur
              border: '1px solid rgba(102, 126, 234, 0.3)', // Purple border
              mx: 2                           // Horizontal margin
            }}>
              <Typography variant="h5" sx={{ 
                color: '#667eea',             // Purple text color
                mb: 2,                        // Bottom margin
                fontWeight: 600,              // Font weight
                textShadow: 'none' // No text shadow for flat design
              }}>
                ✈️ Start Your Journey!
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
                maxWidth: 400,                // Maximum width
                mx: 'auto'                    // Center horizontally
              }}>
                No trips planned yet. Click the "New Trip" button to create your first adventure and start planning!
              </Typography>
            </Box>
          ) : (
            /* Grid layout for displaying existing trips */
            <Grid container spacing={4}>
              {/* Animate presence for smooth enter/exit animations */}
              <AnimatePresence>
                {/* Map through trips data to create trip cards */}
                {tripsData.map((trip: Trip, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={trip.id}>
                    {/* Animated trip card with staggered entrance */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}    // Start invisible and below
                      animate={{ opacity: 1, y: 0 }}     // Animate to visible and normal position
                      transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
                    >
                      {/* Styled card container */}
                      <StyledCard>
                        {/* Card content area */}
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          {/* Trip destination header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationOn sx={{ mr: 1, color: '#1a237e' }} />
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                              {trip.destination}
                            </Typography>
                          </Box>
                          
                          {/* Trip dates display */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} /> {/* Calendar icon */}
                            <Typography variant="body1" sx={{ color: '#424242' }}>
                              {new Date(trip.startDate).toLocaleDateString()} - {/* Start date */}
                              {new Date(trip.endDate).toLocaleDateString()} {/* End date */}
                            </Typography>
                          </Box>
                          
                          {/* Trip duration display */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTime sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} /> {/* Clock icon */}
                            <Typography variant="body1" sx={{ color: '#424242' }}>
                              {calculateDuration(trip.startDate, trip.endDate)} days {/* Calculate and display duration */}
                            </Typography>
                          </Box>
                          
                          {/* View details chip */}
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
                        
                        {/* Card action buttons */}
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          {/* Edit button with tooltip */}
                          <Tooltip title="Edit Trip">
                            <IconButton 
                              size="small" 
                              sx={{
                                color: '#1a237e',                           // Blue color
                                '&:hover': {                                // Hover state
                                  transform: 'scale(1.1)',                  // Scale up slightly
                                  color: '#3949ab',                         // Darker blue
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {/* Delete button with tooltip */}
                          <Tooltip title="Delete Trip">
                            <IconButton
                              size="small"
                              color="error"                                 // Red color for delete
                              onClick={() => deleteMutation.mutate(trip.id)} // Delete trip on click
                              sx={{
                                '&:hover': {                                // Hover state
                                  transform: 'scale(1.1)',                  // Scale up slightly
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

      {/* Modal dialog for creating/editing trips */}
      <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {/* Dialog title */}
        <DialogTitle sx={{ 
          color: '#1a237e',                    // Blue text color
          fontWeight: 600,                     // Font weight
          fontSize: '1.5rem',                  // Font size
          textAlign: 'center',                 // Center text
          pt: 3                                // Top padding
        }}>
          {editingTrip ? 'Edit Trip' : 'New Trip'} {/* Conditional title */}
        </DialogTitle>
        
        {/* Form for trip data */}
        <form onSubmit={handleSubmit}>
          {/* Dialog content area */}
          <DialogContent>
            {/* Form fields container */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              {/* Destination input field */}
              <StyledTextField
                name="destination"              // Field name for form handling
                label="Destination"             // Field label
                value={formData.destination}    // Controlled input value
                onChange={handleChange}         // Change handler
                required                        // Required field
                fullWidth                       // Full width
              />
              
              {/* Start date input field */}
              <StyledTextField
                name="startDate"                // Field name
                label="Start Date"              // Field label
                type="date"                     // Date input type
                value={formData.startDate}      // Controlled input value
                onChange={handleChange}         // Change handler
                required                        // Required field
                fullWidth                       // Full width
                InputLabelProps={{ shrink: true }} // Always show label
              />
              
              {/* End date input field */}
              <StyledTextField
                name="endDate"                  // Field name
                label="End Date"                // Field label
                type="date"                     // Date input type
                value={formData.endDate}        // Controlled input value
                onChange={handleChange}         // Change handler
                required                        // Required field
                fullWidth                       // Full width
                InputLabelProps={{ shrink: true }} // Always show label
              />
            </Box>
          </DialogContent>
          
          {/* Dialog action buttons */}
          <DialogActions sx={{ px: 3, pb: 3 }}>
            {/* Cancel button */}
            <Button
              onClick={handleClose}             // Close dialog on click
              sx={{
                color: '#1a237e',               // Blue text color
                '&:hover': {                    // Hover state
                  backgroundColor: 'rgba(26, 35, 126, 0.1)', // Light blue background
                },
              }}
            >
              Cancel
            </Button>
            
            {/* Submit button */}
            <Button
              type="submit"                     // Form submit button
              variant="contained"               // Filled button style
              sx={{
                background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)', // Blue gradient
                color: '#ffffff',               // White text
                '&:hover': {                    // Hover state
                  background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)', // Darker gradient
                },
              }}
            >
              {editingTrip ? 'Update' : 'Create'} {/* Conditional button text */}
            </Button>
          </DialogActions>
        </form>
      </StyledDialog>
    </PageBackground>
  );
};

// Export the component for use in other parts of the application
export default Trips; 