import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright ©happ '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Register = () => {
  const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      error: null,
      loading: false,
      blockedUsers : []
  });

  const navegate = useNavigate();

  const { name, email, password, error, loading, blockedUsers } = data;

  const handleChange = (e) => {
      setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setData({ ...data, error: null, loading: true });
  if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required" });
  }
  try {
      const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
      );
      await setDoc(doc(db, "users", result.user.uid), {
      uid: result.user.uid,
      name,
      email,
      createdAt: Timestamp.fromDate(new Date()),
      isOnline: true,
      blockedUsers,
      cantMsg: 0,
      cantImg: 0,
      cantVid: 0,
      cantAud: 0,
      words: 0,
      ArrayFriends: []
      });
      setData({
      name: "",
      email: "",
      password: "",
      error: null,
      loading: false,
      blockedUsers
      });
      navegate("/");
  } catch (err) {
      setData({ ...data, error: err.message, loading: false });
  }
  };
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full name"
              autoComplete="name"
              autoFocus
              type="text" 
              name="name" 
              value={name} 
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              id="password"
              autoComplete="current-password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
            {error ? <p className="error">{error}</p> : null}
            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Creating ..." : "Register"}
            </Button>
            <Grid container>
              <Grid item>
              <Link to="/login">Have an account?</Link>
              </Grid>
              
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </div>
  );
}

export {Register}