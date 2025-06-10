import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, user, loading } = useSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    loading: state.auth.loading,
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Subjects', path: '/subjects', icon: <BookIcon /> },
    { text: 'Topics', path: '/topics', icon: <SchoolIcon /> },
    { text: 'Questions', path: '/questions', icon: <QuizIcon /> },
  ];

  const userMenuItems = [
    { text: 'Dashboard', path: '/profile', icon: <DashboardIcon /> },
    { text: 'Practice', path: '/practice', icon: <QuizIcon /> },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo / Brand */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              mr: 2,
            }}
          >
            UGC NET CS HUB
          </Typography>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={handleMobileMenuToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>


          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  my: 2,
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  display: 'flex',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>


          {/* Auth Buttons */}
          {!loading && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls="user-menu"
                    aria-haspopup="true"
                  >
                    <Avatar
                      alt={user?.name || 'User'}
                      src={user?.avatar}
                      sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user?.name || 'User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email || ''}
                      </Typography>
                    </Box>
                    <Divider />
                    {userMenuItems.map((item) => (
                      <MenuItem
                        key={item.path}
                        component={RouterLink}
                        to={item.path}
                        onClick={handleMenuClose}
                      >
                        <ListItemIcon sx={{ color: 'text.primary' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText>{item.text}</ListItemText>
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon sx={{ color: 'error.main' }}>
                        <ExitToAppIcon />
                      </ListItemIcon>
                      <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    sx={{ mx: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      {isMobile && mobileOpen && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            bgcolor: 'background.paper',
            pb: 2,
            px: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              fullWidth
              startIcon={item.icon}
              sx={{
                justifyContent: 'flex-start',
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                fontWeight: location.pathname === item.path ? 600 : 400,
                my: 0.5,
              }}
            >
              {item.text}
            </Button>
          ))}
          {isAuthenticated && (
            <>
              <Divider sx={{ my: 1 }} />
              {userMenuItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  fullWidth
                  startIcon={item.icon}
                  sx={{
                    justifyContent: 'flex-start',
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    my: 0.5,
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <Button
                fullWidth
                onClick={handleLogout}
                startIcon={<ExitToAppIcon />}
                sx={{
                  justifyContent: 'flex-start',
                  color: 'error.main',
                  my: 0.5,
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
