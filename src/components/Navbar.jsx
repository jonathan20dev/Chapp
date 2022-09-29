import React, {useContext, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../context/auth";
import { appContext } from "../context/AppContext";
import axios from "axios";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Fab, Typography } from "@mui/material";
import CloudIcon from '@mui/icons-material/Cloud';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from 'dayjs';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "./svg/Reminder.css"
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2'
import GifBoxIcon from '@mui/icons-material/GifBox';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Navbar = () => {

  const {openDialog, selectGIF, setFile,GIF, setGIF, setSelectedGIF, selectedGIF, setSelectGIF, TimeLocation, setOpenDialog,handleWeather, openAlert, setOpenAlert, reminder, setReminder, weather, setWeather, location, setLocation, data, setData} = useContext(appContext)
  const [inputMeme, setInputMeme] = useState("");

  //Create Reminder
  const [dateReminder, setDateReminder] = useState(dayjs());
  const [messageReminder, setMessageReminder] = useState("");
  const [usersReminder, setUsersReminder] = useState("");
  const [titleReminder, setTittleReminder] = useState("");
  const [email, setEmail] = useState("")
  const [countReminder, setCountReminder] = useState(1);

  //Modify Reminder
  const [dateReminderUpdate, setDateReminderUpdate] = useState(dayjs());
  const [messageReminderUpdate, setMessageReminderUpdate] = useState("");
  const [usersReminderUpdate, setUsersReminderUpdate] = useState("");
  const [titleReminderUpdate, setTitleReminderUpdate] = useState("");

  const [modifyReminder, setModifyReminder] = useState({});

  const handleSaveReminder = () => {
    setReminder([...reminder, {idReminder: countReminder, nameReminder: titleReminder, to: usersReminder[0], date: {"hour": dateReminder.$H+":"+dateReminder.$m+":"+dateReminder.$s, "date": dateReminder.$M+1+"/"+dateReminder.$D+"/"+dateReminder.$y}, message: messageReminder}])
    setCountReminder(countReminder+1)
    setDateReminder(dayjs())
    setMessageReminder("")
    setUsersReminder("")
    handleOpenReminder()
    handleOpenAlert()
  }

  useEffect(() => {
    if(reminder.length !== 0){
      const reminderSelected = reminder[0]
      if(!reminderSelected.flag){
        const reminderDate = reminder[0].date
        var date1 = new Date();    
        var date2 = new Date(`${reminderDate.date} ${reminderDate.hour}`);
        console.log(date2)
        //Customise date2 for your required future time
    
        var diff = (date2 - date1)/1000;
        var diff = Math.abs(Math.floor(diff));
        console.log(diff)
    
        var days = Math.floor(diff/(24*60*60));
        var leftSec = diff - days * 24*60*60;
    
        var hrs = Math.floor(leftSec/(60*60));
        var leftSec = leftSec - hrs * 60*60;
    
        var min = Math.floor(leftSec/(60));
        var leftSec = leftSec - min * 60;
        setTimeout(() => {
          Swal.fire(
            `Recordatorio (${reminderSelected.nameReminder})`,
            `Tienes un recordatorio para ${reminderSelected.to}` ,
            `Tu mensaje: ${reminderSelected.message}`,
          )
          reminderSelected.flag = true
        }, diff*1000);
      }
    }
  }, [reminder])
  
  useEffect(() => {

  }, [email])
  
  

  const handleCloseWeather = () =>{
    (openDialog.showWeather) ? setOpenDialog({...openDialog, showWeather: false}) :  setOpenDialog({...openDialog, showWeather: true})
  }

  const handleOpenWeather = () =>{
    (openDialog.showWeather) ? setOpenDialog({...openDialog, showWeather: false}) :  setOpenDialog({...openDialog, showWeather: true})
    handleWeather()
  }

  const handleOpenReminder = () =>{
    (openDialog.showReminder) ? setOpenDialog({...openDialog, showReminder: false}) :  setOpenDialog({...openDialog, showReminder: true})
  }

  const handleOpenGIF = () =>{
    (openDialog.showGIF) ? setOpenDialog({...openDialog, showGIF: false}) :  setOpenDialog({...openDialog, showGIF: true})
  }

  const handleOpenReminderTable = () =>{
    (openDialog.showReminderTable) ? setOpenDialog({...openDialog, showReminderTable: false}) :  setOpenDialog({...openDialog, showReminderTable: true})
  }

  const handleOpenReminderUpdate = () =>{
    (openDialog.showReminderUpdate) ? setOpenDialog({...openDialog, showReminderUpdate: false}) :  setOpenDialog({...openDialog, showReminderUpdate: true})
  }

  const handleOpenReminderUpdateClose = () =>{
    (openDialog.showReminderUpdate) ? setOpenDialog({...openDialog, showReminderUpdate: false}) :  setOpenDialog({...openDialog, showReminderUpdate: true})
  }

  const handleOpenAlert = () =>{
    (openAlert.showAlertCreate) ? setOpenAlert({...openAlert, showAlertCreate: false}) :  setOpenAlert({...openAlert, showAlertCreate: true})
  }

  const handleOpenAlert2 = () =>{
    (openAlert.showAlertUpdate) ? setOpenAlert({...openAlert, showAlertUpdate: false}) :  setOpenAlert({...openAlert, showAlertUpdate: true})
  }

  const handleSetUpdate = (message) =>{
    const findUpdateReminder = reminder.find(user => user.message === message)
    setModifyReminder(findUpdateReminder)
    handleOpenReminderUpdate()
  }

  const handleSubmitUpdate = (message) => {
    handleSubmit()
    handleOpenReminderUpdateClose()
    handleOpenAlert2()
  };

  const handleSubmit = () => {
    modifyReminder.nameReminder = titleReminderUpdate === "" ? modifyReminder.nameReminder : titleReminderUpdate
    modifyReminder.to = usersReminderUpdate === "" ? modifyReminder.to : usersReminderUpdate
    modifyReminder.message = messageReminderUpdate === "" ? modifyReminder.message : messageReminderUpdate
    modifyReminder.date = {"hour": dateReminderUpdate.$H+":"+dateReminderUpdate.$m+":"+dateReminderUpdate.$s, "date": dateReminderUpdate.$M+1+"/"+dateReminderUpdate.$D+"/"+dateReminderUpdate.$y}
  }

  const handleSearchMeme = () => {
    console.log(inputMeme)
    axios.get(`https://api.giphy.com/v1/gifs/search?api_key=FfC0GoBNWauajLfhAlvJ7Yc2ebHobpyu&q=${inputMeme}&limit=25&offset=0&rating=g&lang=en`).then((response) => {
      setGIF(response.data.data);
    });
  }

  const handleReminderDelete = (message) => {
    const searchUser = reminder.find(user => user.message === message)
    setReminder(reminder.filter(user=> user.message !== searchUser.message))
  }

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/login");
  };

  const handleSubmitGIF = (url)=> {
    const file = new File([url], "gif", { 
      'type': 'gif' ,
    });
    setSelectGIF(file)
  }
  

  return (
    <>
    <nav>
      <h3>
        <Link to="/">Chapp</Link>
      </h3>
        <Fab size="small" onClick={handleOpenWeather}>
              <CloudIcon/>
        </Fab>
        <Fab size="small" onClick={handleOpenReminder}>
        <DateRangeIcon/>
        </Fab>
        <Fab size="small" onClick={handleOpenGIF}>
            <GifBoxIcon/>
        </Fab>
      <div>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button className="btn" onClick={handleSignout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
    
<div>
<Dialog
        open={openDialog.showWeather}
        onClose={handleCloseWeather}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogContent style={{background: "linear-gradient(22deg, rgba(62,205,253,1) 24%, rgba(62,205,253,1) 29%, rgba(255,255,255,1) 98%)"}}>
        <DialogTitle id="alert-dialog-title">
          <Typography style={{textAlign: "center", textTransform: "uppercase", fontSize: "100%", fontWeight: "bold"}}>Weather<Divider/></Typography>
          </DialogTitle>
        <DialogContentText style={{textAlign: "center"}} id="alert-dialog-description">       

              <ListItem>
                <ListItemAvatar>
                    <LocationOnIcon fontSize="large" style={{marginBottom: "-6%", marginLeft: "1%"}}/>
                </ListItemAvatar>
                <ListItemText primary="Location" secondary={<Typography style={{fontSize: "105%", textTransform: "uppercase"}}>{data.name}</Typography>} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                <CloudIcon fontSize="large" style={{marginBottom: "-6%", marginLeft: "1%"}}/>
                </ListItemAvatar>
                <ListItemText primary="Weather" secondary={<Typography style={{fontSize: "85%", textTransform: "uppercase"}}>{weather.description}</Typography>} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                    <AccessTimeIcon fontSize="large" />
                </ListItemAvatar>
                <ListItemText primary="Time" secondary={<Typography style={{fontSize: "85%", textTransform: "uppercase"}}>{TimeLocation()}</Typography>} />
              </ListItem>

        </DialogContentText>
        <DialogActions>
        <Button style={{backgroundColor: "#FFFFFF", borderRadius: "25px", color: "rgba(62,205,253,1)", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}} onClick={handleCloseWeather} autoFocus>
            Exit
        </Button>
        </DialogActions>
        </DialogContent>
  </Dialog>

    <Dialog
        open={openDialog.showReminder}
        onClose={handleOpenReminder}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogContent style={{width: "100%"}}>
        <DialogTitle id="alert-dialog-title">
          <Typography style={{textAlign: "center", textTransform: "uppercase", fontSize: "100%", fontWeight: "bold"}}>Reminder<NotificationAddIcon style={{position: "relative", top: "8"}} fontSize="large"/><Divider/></Typography>
          </DialogTitle>
        <DialogContentText style={{textAlign: "center"}} id="alert-dialog-description">    
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TextField
      style={{marginTop: "2%", width: "250px"}}
          id="outlined-multiline-static"
          label="Title"
          rows={4}
          placeholder="Reminder #1"
          onChange={(e) => {
            setTittleReminder(e.target.value);
          }}
        />   
        <TextField
        type='email'
          style={{marginTop: "2%", width: "250px"}}
          id="outlined-number"
          label="Email"
          type="email"
          fullWidth
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />  
      <DateTimePicker
        renderInput={(props) => <TextField style={{width: "250px", marginTop: "6%"}} {...props} />}
        label="Select date and time"
        value={dateReminder}
        onChange={(newValue) => {
          setDateReminder(newValue);
        }}
      />
      <Autocomplete
        freeSolo
        style={{marginTop: "5%", width: "250px", marginLeft: "auto", marginRight: "auto"}}
        onChange={(newValue) => {
          console.log(newValue.target.innerHTML)
          setUsersReminder([newValue.target.innerHTML]);
        }}
        id="free-solo-2-demo"
        disableClearable
        options={users.map((option) => option.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="To"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
      <TextField
      style={{marginTop: "5%", width: "250px"}}
          id="outlined-multiline-static"
          label="Message"
          multiline
          rows={4}
          placeholder="Write your message"
          onChange={(e) => {
            setMessageReminder(e.target.value);
          }}
        />
    </LocalizationProvider>
        </DialogContentText>
        <DialogActions>
        <Button style={{backgroundColor: "red", borderRadius: "25px", color: "#FFFFFF", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}} onClick={handleOpenReminder} autoFocus>
            Exit
        </Button>
        <Button style={{backgroundColor: "#4d94ff", borderRadius: "25px", color: "#FFFFFF", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}} onClick={handleSaveReminder} autoFocus>
            Save
        </Button>
        </DialogActions>
        <Fab style={{position: "absolute", right: 10, top: 10, backgroundColor: "#4d94ff"}} onClick={handleOpenReminderTable} size="small">
          <FolderSharedIcon/>
        </Fab>
        </DialogContent>
  </Dialog>

  <Dialog
        open={openDialog.showReminderTable}
        onClose={handleOpenReminderTable}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogContent style={{width: "100%"}}>
        <DialogTitle id="alert-dialog-title">
          <Typography style={{textAlign: "center", textTransform: "uppercase", fontSize: "100%", fontWeight: "bold"}}>Data Reminder<NotificationAddIcon style={{position: "relative", top: "8"}} fontSize="large"/><Divider/></Typography>
          </DialogTitle>
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Hour</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reminder.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.nameReminder}
              </TableCell>
              <TableCell >{row.to}</TableCell>
              <TableCell >{row.message}</TableCell>
              <TableCell >{row.date.date}</TableCell>
              <TableCell >{row.date.hour}</TableCell>
              <TableCell align="left">
                <ButtonGroup
                  disableElevation
                  variant="outlined"
                  aria-label="Disabled elevation buttons"
                >
                  <Button onClick={()=> handleReminderDelete(row.message)}><HighlightOffIcon fontSize="small"/></Button>
                  <Button onClick={()=> handleSetUpdate(row.message)}><SettingsIcon fontSize="small"/></Button>
                </ButtonGroup>
          </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </DialogContent>
  </Dialog>

  <Dialog
        open={openDialog.showReminderUpdate}
        onClose={handleOpenReminderUpdateClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogContent style={{width: "100%"}}>
        <DialogTitle id="alert-dialog-title">
          <Typography style={{textAlign: "center", textTransform: "uppercase", fontSize: "100%", fontWeight: "bold"}}>Update Reminder<SettingsIcon style={{position: "relative", top: "8"}} fontSize="large"/><Divider/></Typography>
          </DialogTitle>
        <DialogContentText style={{textAlign: "center"}} id="alert-dialog-description">       
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TextField
          style={{marginTop: "2%", width: "250px"}}
          id="outlined-multiline-static"
          label="Title"
          defaultValue={modifyReminder.nameReminder !== undefined && modifyReminder.nameReminder}
          rows={4}
          onChange={(e) => {
            setTitleReminderUpdate(e.target.value);
          }}
        />  
      <DateTimePicker
        renderInput={(props) => <TextField style={{width: "250px", marginTop: "6%"}} {...props} />}
        label="Select date and time"
        value={dateReminder}
        onChange={(newValue) => {
          setDateReminderUpdate(newValue);
        }}
      />
      <Autocomplete
        freeSolo
        defaultValue={modifyReminder.to}
        style={{marginTop: "5%", width: "250px", marginLeft: "auto", marginRight: "auto"}}
        onChange={(newValue) => {
          console.log(newValue.target.innerHTML)
          setUsersReminderUpdate([newValue.target.innerHTML]);
        }}
        id="free-solo-2-demo"
        disableClearable
        options={users.map((option) => option.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="To"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
      <TextField
      style={{marginTop: "5%", width: "250px"}}
          id="outlined-multiline-static"
          label="Message"
          multiline
          rows={4}
          defaultValue={modifyReminder.message !== undefined && modifyReminder.message}
          onChange={(e) => {
            setMessageReminderUpdate(e.target.value);
          }}
        />
    </LocalizationProvider>
        </DialogContentText>
        <DialogActions>
        <Button style={{backgroundColor: "red", borderRadius: "25px", color: "#FFFFFF", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}} onClick={handleOpenReminderUpdateClose} autoFocus>
            Exit
        </Button>
        <Button style={{backgroundColor: "#4d94ff", borderRadius: "25px", color: "#FFFFFF", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}} onClick={handleSubmitUpdate} autoFocus>
            Save
        </Button>
        </DialogActions>
        </DialogContent>
  </Dialog>

  <Dialog
        open={openDialog.showGIF}
        onClose={handleOpenGIF}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogContent style={{width: "100%", overflow: "hidden"}}>
        <DialogTitle id="alert-dialog-title">
          <Typography style={{textAlign: "center", textTransform: "uppercase", fontSize: "100%", fontWeight: "bold"}}><GifBoxIcon style={{position: "relative", top: "8"}} fontSize="large"/><Divider/></Typography>
          </DialogTitle>
        <DialogContentText style={{textAlign: "center"}} id="alert-dialog-description">       
          <TextField
          style={{marginTop: "5%", width: "250px"}}
              id="outlined-multiline-static"
              label="GIF"
              rows={4}
              placeholder="Search your meme"
              onChange={(e) => {
                setInputMeme(e.target.value);
              }}
            />
            
        <Button style={{backgroundColor: "#4d94ff", borderRadius: "25px", color: "#FFFFFF", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}} onClick={handleSearchMeme} autoFocus>
            Search
        </Button>

        {GIF.length !== 0 && 
          <ImageList sx={{ width: 300, height: 450 }} cols={3} rowHeight={164}>
            {GIF.map(gif => (
              <ImageListItem key={gif.img}>
                <img
                  onClick={()=> handleSubmitGIF(gif.images.original.url)}
                  src={gif.images.original.url}
                  alt={gif.id}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        }
        </DialogContentText>
        </DialogContent>
  </Dialog>

</div>

    <Snackbar autoHideDuration={1000} open={openAlert.showAlertCreate} onClose={handleOpenAlert}>
        <Alert onClose={handleOpenAlert} sx={{ width: '100%' }}>
          This is a success reminder!
        </Alert>
      </Snackbar>

      <Snackbar autoHideDuration={1000} open={openAlert.showAlertUpdate} onClose={handleOpenAlert2}>
        <Alert onClose={handleOpenAlert2} sx={{ width: '100%' }}>
          This is a success reminder update!
        </Alert>
      </Snackbar>


    </>
  )
}

export {Navbar}

const users = [
  { name: 'Johan Zamora'},
  { name: 'Jonathan Mumo'},
  { name: 'Kimberly'},
  { name: 'Johan2'},
  { name: 'Jonathan2'},
  { name: 'Kimberly2'},
];