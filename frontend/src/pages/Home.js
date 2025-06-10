import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  styled,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  LibraryBooks as LibraryBooksIcon,
  BarChart as BarChartIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(15, 0, 10),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 0.9) 100%)',
    zIndex: 1,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

// Data
const features = [
  {
    icon: <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'Comprehensive Coverage',
    description: 'Access complete syllabus coverage for UGC NET Computer Science with detailed explanations.',
  },
  {
    icon: <QuizIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
    title: 'Practice Questions',
    description: 'Practice with thousands of previous year questions and mock tests.',
  },
  {
    icon: <LibraryBooksIcon sx={{ fontSize: 60, color: 'success.main' }} />,
    title: 'Subject-wise Materials',
    description: 'Organized study materials for each subject to help you focus on weak areas.',
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
    title: 'Performance Analytics',
    description: 'Track your progress with detailed analytics and performance reports.',
  },
];

const stats = [
  { value: '5000+', label: 'Practice Questions' },
  { value: '100+', label: 'Previous Year Papers' },
  { value: '95%', label: 'Success Rate' },
  { value: '24/7', label: 'Accessibility' },
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  fontSize: isMobile ? '2.5rem' : '3.5rem',
                  mb: 3,
                }}
              >
                Ace Your UGC NET Computer Science Exam
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  mb: 4,
                  fontSize: isMobile ? '1.1rem' : '1.25rem',
                  opacity: 0.9,
                  maxWidth: '90%',
                }}
              >
                Access previous year questions, subject-wise materials, and practice tests to boost your preparation.
              </Typography>
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: 4 }}>
                <Button
                  component={RouterLink}
                  to={isAuthenticated ? '/practice' : '/register'}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: '0 4px 14px 0 rgba(220, 0, 78, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 18px 0 rgba(220, 0, 78, 0.5)',
                    },
                  }}
                >
                  {isAuthenticated ? 'Start Practicing' : 'Get Started for Free'}
                </Button>
                <Button
                  component={RouterLink}
                  to="/subjects"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Browse Subjects
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="/images/hero-illustration.svg"
                alt="UGC NET CS Preparation"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0px)' },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Chip
              label="Why Choose Us"
              color="primary"
              sx={{
                px: 2,
                py: 1,
                mb: 2,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Everything You Need to Succeed
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Our comprehensive platform provides all the resources and tools you need to excel in the UGC NET Computer Science examination.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard elevation={3}>
                  <Box mb={2}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <StatCard elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      background: 'linear-gradient(45deg, #fff, #e0e0e0)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            Ready to Start Your UGC NET Journey?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 5,
              maxWidth: 700,
              mx: 'auto',
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Join thousands of students who have successfully cleared UGC NET with our comprehensive study materials and practice tests.
          </Typography>
          <Button
            component={RouterLink}
            to={isAuthenticated ? '/practice' : '/register'}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<TrendingUpIcon />}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 18px 0 rgba(25, 118, 210, 0.5)',
              },
            }}
          >
            {isAuthenticated ? 'Continue Practicing' : 'Get Started Now'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
