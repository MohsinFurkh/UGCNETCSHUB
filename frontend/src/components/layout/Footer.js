import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Link, Typography, Divider } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { text: 'Home', to: '/' },
        { text: 'Subjects', to: '/subjects' },
        { text: 'Topics', to: '/topics' },
        { text: 'Questions', to: '/questions' },
        { text: 'Practice', to: '/practice' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'UGC NET Official Website', to: 'https://ugcnet.nta.nic.in/', external: true },
        { text: 'Syllabus', to: '#' },
        { text: 'Previous Year Papers', to: '#' },
        { text: 'Study Materials', to: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Privacy Policy', to: '/privacy' },
        { text: 'Terms of Service', to: '/terms' },
        { text: 'Cookie Policy', to: '/cookies' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Help Center', to: '/help' },
        { text: 'Contact Us', to: '/contact' },
        { text: 'Report an Issue', to: '/report' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#' },
    { icon: <TwitterIcon />, url: '#' },
    { icon: <InstagramIcon />, url: '#' },
    { icon: <LinkedInIcon />, url: '#' },
    { icon: <GitHubIcon />, url: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              UGC NET CS HUB
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your one-stop destination for UGC NET Computer Science preparation. 
              Access previous year questions, subject-wise materials, and practice tests 
              to ace your UGC NET examination.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </Box>
          </Grid>
          
          {footerLinks.map((section, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.to}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noopener noreferrer' : ''}
                      color="text.secondary"
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'none',
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} UGC NET CS HUB. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ for UGC NET Aspirants
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
