import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocationOn,
  Email,
  Phone,
  Language,
  Security,
  Notifications,
  Palette,
} from '@mui/icons-material';
import { users } from '../services/api';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
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
    backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80")',
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

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    language: '',
    currency: '',
    notifications: true,
  });

  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => users.getProfile().then((res) => res.data),
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        language: data.preferences?.language || 'en',
        currency: data.preferences?.currency || 'USD',
        notifications: data.preferences?.notifications ?? true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (userData: Partial<UserProfile>) => users.updateProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      preferences: {
        language: formData.language,
        currency: formData.currency,
        notifications: formData.notifications,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (isLoading) {
    return (
      <PageBackground>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mt: 4 }}>
            Error loading profile. Please try again.
          </Alert>
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
              Profile
            </Typography>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
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
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={updateMutation.isPending}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                    color: '#ffffff',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #283593 30%, #3949ab 90%)',
                    },
                  }}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsEditing(false)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    '&:hover': {
                      borderColor: '#3949ab',
                      backgroundColor: 'rgba(26, 35, 126, 0.1)',
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <StyledCard>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
                      {isEditing ? (
                        <StyledTextField
                          fullWidth
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          size="small"
                        />
                      ) : (
                        formData.name
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ color: '#1a237e' }} />
                        {isEditing ? (
                          <StyledTextField
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#424242' }}>
                            {formData.email}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: '#1a237e' }} />
                        {isEditing ? (
                          <StyledTextField
                            fullWidth
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#424242' }}>
                            {formData.phone || 'Not provided'}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ color: '#1a237e' }} />
                        {isEditing ? (
                          <StyledTextField
                            fullWidth
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: '#424242' }}>
                            {formData.address || 'Not provided'}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <StyledCard>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 3 }}>
                      Preferences
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Language sx={{ color: '#1a237e' }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                              Language
                            </Typography>
                            {isEditing ? (
                              <StyledTextField
                                fullWidth
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                size="small"
                                select
                                SelectProps={{ native: true }}
                              >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                              </StyledTextField>
                            ) : (
                              <Typography variant="body1" sx={{ color: '#1a237e' }}>
                                {formData.language === 'en' ? 'English' :
                                 formData.language === 'es' ? 'Spanish' :
                                 formData.language === 'fr' ? 'French' :
                                 formData.language === 'de' ? 'German' : 'English'}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Palette sx={{ color: '#1a237e' }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                              Currency
                            </Typography>
                            {isEditing ? (
                              <StyledTextField
                                fullWidth
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                size="small"
                                select
                                SelectProps={{ native: true }}
                              >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                              </StyledTextField>
                            ) : (
                              <Typography variant="body1" sx={{ color: '#1a237e' }}>
                                {formData.currency === 'USD' ? 'USD ($)' :
                                 formData.currency === 'EUR' ? 'EUR (€)' :
                                 formData.currency === 'GBP' ? 'GBP (£)' :
                                 formData.currency === 'JPY' ? 'JPY (¥)' : 'USD ($)'}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Notifications sx={{ color: '#1a237e' }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ color: '#424242', mb: 0.5 }}>
                              Notifications
                            </Typography>
                            {isEditing ? (
                              <StyledTextField
                                fullWidth
                                name="notifications"
                                type="checkbox"
                                checked={formData.notifications}
                                onChange={handleChange}
                                size="small"
                              />
                            ) : (
                              <Chip
                                label={formData.notifications ? 'Enabled' : 'Disabled'}
                                color={formData.notifications ? 'primary' : 'default'}
                                sx={{
                                  background: formData.notifications
                                    ? 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)'
                                    : 'rgba(0, 0, 0, 0.1)',
                                  color: formData.notifications ? '#ffffff' : '#424242',
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </PageBackground>
  );
};

export default Profile;
