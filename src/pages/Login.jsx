// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  School,
  Psychology,
  HelpOutline,
  FlashOn,
  QueryBuilder,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Premium dark purple theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9333ea',
      light: '#a855f7',
      dark: '#7e22ce',
    },
    background: {
      default: '#0a0015',
      paper: '#1a0b2e',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(15, 6, 30, 0.6)',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(147, 51, 234, 0.25)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(147, 51, 234, 0.5)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(15, 6, 30, 0.8)',
              '& fieldset': {
                borderColor: '#9333ea',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.role,
          formData.fullName
        );
        
        if (error) {
          setError(error.message);
        } else {
          setError('');
          alert('Sign up successful! Please check your email to confirm your account.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setError(error.message);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          background: '#0a0015',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Grid Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            },
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              alignItems: 'center',
              minHeight: '90vh',
            }}
          >
            
            {/* Left Side - 50% */}
            <Box sx={{ pr: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
              {/* Logo & Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 5 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(147, 51, 234, 0.3)',
                    }}
                  >
                    <Psychology sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    ClassQueue
                  </Typography>
                </Box>
                
                {/* Heading */}
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 3,
                    lineHeight: 1.2,
                    fontSize: '3rem',
                    color: 'text.primary',
                  }}
                >
                  Smart Doubt Resolution
                  <Box 
                    component="span" 
                    sx={{ 
                      display: 'block',
                      background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mt: 1,
                    }}
                  >
                    Made Simple
                  </Box>
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    mb: 6,
                    fontSize: '1.125rem',
                  }}
                >
                  Experience intelligent queue management with priority-based resolution. 
                  Built for modern classrooms.
                </Typography>

                {/* Features */}
                <Stack spacing={3}>
                  {[
                    { icon: <HelpOutline />, title: 'Real-time doubt resolution' },
                    { icon: <FlashOn />, title: 'Priority queue for urgent queries' },
                    { icon: <QueryBuilder />, title: 'Fair FIFO-based management' },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: 'rgba(147, 51, 234, 0.1)',
                            border: '1px solid rgba(147, 51, 234, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {React.cloneElement(feature.icon, { 
                            sx: { color: 'primary.light', fontSize: 22 } 
                          })}
                        </Box>
                        <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '1.05rem' }}>
                          {feature.title}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            </Box>

            {/* Right Side - 50% */}
            <Box sx={{ pl: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    background: 'rgba(26, 11, 46, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(147, 51, 234, 0.4)',
                    borderRadius: 3,
                    maxWidth: 480,
                    mx: 'auto',
                  }}
                >
                  {/* Header */}
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                      {isSignUp 
                        ? 'Sign up to start managing your doubts' 
                        : 'Sign in to continue to your dashboard'}
                    </Typography>
                  </Box>

                  {/* Error Alert */}
                  <AnimatePresence mode="wait">
              {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Alert 
                          severity="error" 
                          sx={{ 
                            mb: 3,
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#fca5a5',
                            borderRadius: 2,
                          }}
                        >
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      
                      {/* Full Name */}
                      <AnimatePresence mode="wait">
                {isSignUp && (
                          <motion.div
                            key="fullname"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <TextField
                              fullWidth
                              label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required={isSignUp}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Email */}
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Password */}
                      <TextField
                        fullWidth
                        label="Password"
                    name="password"
                        type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                                sx={{ color: 'text.secondary' }}
                              >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Role Selection */}
                      <AnimatePresence mode="wait">
                {isSignUp && (
                          <motion.div
                            key="role"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
                                Select your role
                              </Typography>
                              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                {[
                                  { value: 'student', label: 'Student', icon: <School /> },
                                  { value: 'teacher', label: 'Teacher', icon: <Person /> },
                                ].map((role) => (
                                  <Box
                                    key={role.value}
                                    onClick={() => setFormData({ ...formData, role: role.value })}
                                    sx={{
                                      p: 2.5,
                                      borderRadius: 2,
                                      border: '2px solid',
                                      borderColor: formData.role === role.value 
                                        ? 'primary.main' 
                                        : 'rgba(147, 51, 234, 0.2)',
                                      background: formData.role === role.value
                                        ? 'rgba(147, 51, 234, 0.12)'
                                        : 'rgba(15, 6, 30, 0.4)',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: 1.5,
                                      '&:hover': {
                                        borderColor: formData.role === role.value ? 'primary.light' : 'rgba(147, 51, 234, 0.4)',
                                        background: formData.role === role.value 
                                          ? 'rgba(147, 51, 234, 0.15)' 
                                          : 'rgba(147, 51, 234, 0.05)',
                                      },
                                    }}
                                  >
                                    {React.cloneElement(role.icon, { 
                                      sx: { 
                                        fontSize: 30, 
                                        color: formData.role === role.value ? 'primary.light' : 'text.secondary'
                                      } 
                                    })}
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontWeight: 600,
                                        color: formData.role === role.value ? 'text.primary' : 'text.secondary'
                                      }}
                                    >
                                      {role.label}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <Button
                  type="submit"
                        fullWidth
                        variant="contained"
                  disabled={loading}
                        sx={{
                          mt: 1,
                          py: 1.75,
                          fontSize: '1rem',
                          background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                          boxShadow: '0 4px 16px rgba(147, 51, 234, 0.35)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #7e22ce 0%, #4f46e5 100%)',
                            boxShadow: '0 6px 20px rgba(147, 51, 234, 0.45)',
                          },
                          '&:disabled': {
                            background: 'rgba(147, 51, 234, 0.3)',
                          },
                        }}
                >
                  {loading ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          isSignUp ? 'Create Account' : 'Sign In'
                        )}
                      </Button>

                      {/* Toggle Link */}
                      <Button
                        fullWidth
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                        sx={{ 
                          mt: 0.5,
                          color: 'text.secondary',
                          fontSize: '0.9rem',
                          '&:hover': {
                            color: 'primary.light',
                            background: 'rgba(147, 51, 234, 0.05)',
                          },
                        }}
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                      </Button>
                    </Stack>
                  </form>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
