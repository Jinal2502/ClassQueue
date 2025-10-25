// src/components/Navbar.jsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Container,
} from '@mui/material';
import {
  Psychology,
  Timeline as TimelineIcon,
  HelpOutline,
  Dashboard,
  LogoutOutlined,
  PersonOutline,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Match the login page theme
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
  },
});

const Navbar = () => {
  const { user, userRole, signOut, isTeacher, isStudent } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'rgba(10, 0, 21, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(147, 51, 234, 0.15)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: 0, minHeight: 70 }}>
            {/* Logo and Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12 
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(147, 51, 234, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
                    },
                  }}
                >
                  <Psychology sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 800, 
                      color: 'text.primary',
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    ClassQueue
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      display: 'block',
                      mt: -0.5,
                    }}
                  >
                    Smart Resolution
                  </Typography>
                </Box>
              </Link>

              {/* Main Navigation */}
              {user && (
                <Box sx={{ ml: 6, display: 'flex', gap: 1.5 }}>
                  <Button
                    component={Link}
                    to="/"
                    startIcon={<TimelineIcon />}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isActive('/') ? 'white' : 'text.secondary',
                      background: isActive('/') 
                        ? 'rgba(147, 51, 234, 0.15)' 
                        : 'transparent',
                      border: '1px solid',
                      borderColor: isActive('/') 
                        ? 'rgba(147, 51, 234, 0.4)' 
                        : 'transparent',
                      '&:hover': {
                        background: isActive('/') 
                          ? 'rgba(147, 51, 234, 0.2)' 
                          : 'rgba(147, 51, 234, 0.05)',
                        borderColor: 'rgba(147, 51, 234, 0.3)',
                      },
                    }}
                  >
                    Timeline
                  </Button>

                  {isStudent() && (
                    <Button
                      component={Link}
                      to="/ask-doubt"
                      startIcon={<HelpOutline />}
                      sx={{
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: isActive('/ask-doubt') ? 'white' : 'text.secondary',
                        background: isActive('/ask-doubt') 
                          ? 'rgba(147, 51, 234, 0.15)' 
                          : 'transparent',
                        border: '1px solid',
                        borderColor: isActive('/ask-doubt') 
                          ? 'rgba(147, 51, 234, 0.4)' 
                          : 'transparent',
                        '&:hover': {
                          background: isActive('/ask-doubt') 
                            ? 'rgba(147, 51, 234, 0.2)' 
                            : 'rgba(147, 51, 234, 0.05)',
                          borderColor: 'rgba(147, 51, 234, 0.3)',
                        },
                      }}
                    >
                      Ask Doubt
                    </Button>
                  )}

                  {isTeacher() && (
                    <Button
                      component={Link}
                      to="/dashboard"
                      startIcon={<Dashboard />}
                      sx={{
                        px: 2.5,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: isActive('/dashboard') ? 'white' : 'text.secondary',
                        background: isActive('/dashboard') 
                          ? 'rgba(147, 51, 234, 0.15)' 
                          : 'transparent',
                        border: '1px solid',
                        borderColor: isActive('/dashboard') 
                          ? 'rgba(147, 51, 234, 0.4)' 
                          : 'transparent',
                        '&:hover': {
                          background: isActive('/dashboard') 
                            ? 'rgba(147, 51, 234, 0.2)' 
                            : 'rgba(147, 51, 234, 0.05)',
                          borderColor: 'rgba(147, 51, 234, 0.3)',
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                  )}
                </Box>
              )}
            </Box>

            {/* User Info and Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              {user ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          lineHeight: 1.3,
                        }}
                      >
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </Typography>
                      <Chip
                        label={userRole}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          background: userRole === 'teacher' 
                            ? 'rgba(147, 51, 234, 0.15)' 
                            : 'rgba(99, 102, 241, 0.15)',
                          color: userRole === 'teacher' 
                            ? '#a855f7' 
                            : '#818cf8',
                          border: '1px solid',
                          borderColor: userRole === 'teacher' 
                            ? 'rgba(147, 51, 234, 0.3)' 
                            : 'rgba(99, 102, 241, 0.3)',
                        }}
                      />
                    </Box>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
                        }}
                      >
                        <PersonOutline sx={{ fontSize: 22 }} />
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: '#10b981',
                          border: '2px solid #0a0015',
                          boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                        }}
                      />
                    </Box>
                  </Box>
                  <Button
                    onClick={handleSignOut}
                    startIcon={<LogoutOutlined />}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                      background: 'rgba(147, 51, 234, 0.05)',
                      border: '1px solid rgba(147, 51, 234, 0.2)',
                      '&:hover': {
                        background: 'rgba(147, 51, 234, 0.1)',
                        borderColor: 'rgba(147, 51, 234, 0.3)',
                        color: 'text.primary',
                      },
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    px: 3,
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'white',
                    background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                    boxShadow: '0 4px 16px rgba(147, 51, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7e22ce 0%, #4f46e5 100%)',
                      boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
