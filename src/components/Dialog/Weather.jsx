import React, { useEffect, useState, useContext } from "react";
import {AppContext} from "../context/AppContext";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Weather = () => {

    const {openAlert, setOpenAlert, openDialog, setOpenDialog } = useContext(AppContext);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const WeatherTime = () => {
        const d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let s = addZero(d.getSeconds());
        let time = h + ":" + m + ":" + s;
        console.log(time)
        console.log(data.name+" "+data.weather.map(item => {return item.main}))
      }
    
      useEffect(() => {
        axios.get('http://api.openweathermap.org/data/2.5/weather?q=Texas,us&APPID=3bd740d64f5ad6b4786618ba189dbfb8').then((response) => {
          setData(response.data);
        });
      }, []);

  return (
    <Dialog
        open={openDialog.showWeather}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose} autoFocus>
            Agree
        </Button>
        </DialogActions>
  </Dialog>
  )
}

export default Weather