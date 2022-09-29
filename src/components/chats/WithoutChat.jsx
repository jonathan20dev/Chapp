import React from "react";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function WhithoutChat() {
    return (
        <div style={{backgroundColor:"#dcdcf7"}}>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#dcdcf7', height: '20vh' }} />
        <Typography variant="h5" component="h2" color="gray" align="center" style={{lineHeight: "1", fontSize: "30px", fontweight: "200"}}>
            Selecciona un chat para hablar
            </Typography>
        <Box sx={{ bgcolor: '#dcdcf7', height: '100vh' }} />
      </Container>
    </div>
    );
}

export {WhithoutChat};
