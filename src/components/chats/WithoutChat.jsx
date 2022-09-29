import React from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function WhithoutChat() {
    return (
        <div style={{backgroundColor:"#333"}}>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#333', height: '20vh' }} />
        <Typography variant="h5" component="h2" color="#f8f9fb" align="center" style={{lineHeight: "20px", fontSize: "30px", fontweight: "200"}}>
            Selecciona un chat para hablar
            </Typography>
        <Box sx={{ bgcolor: '#333', height: '100vh' }} />
      </Container>
    </div>
    );
}

export {WhithoutChat};
