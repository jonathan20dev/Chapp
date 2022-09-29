import React, { createContext, useState } from "react";
import { doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import CryptoJS from "crypto-js";
import axios from "axios";

const appContext = createContext();

const AppContextProvider = ({ children }) => {

  //Dialog
  const [openDialog, setOpenDialog] = useState({showGIF: false, showReminder: false, showReminderUpdate: false , showWeather: false, showReminderTable: false})
  //Alerts
  const [openAlert, setOpenAlert] = useState({showAlertCreate: false, showAlertUpdate: false})

  //Usuarios bloqueados 
  const [blockedUsers, setBlockedUsers] = useState([]);
  
  //variables para buscarMensaje 
  const [textoBuscado, setTextoBuscado] = useState('');
  const [textoBuscadoG, setTextoBuscadoG] = useState('');

  //Reminder
  const [reminder, setReminder] = useState([])

  //Manejo de selección para editar o borrar mensaje
  const [selectedMsg, setSelectedMsg] = useState("");
  const [selected, setSelected] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [msgG, setMsgG] = useState([]);
  const [Me, setMe] = useState();
  
  //Manejo de modals
  const [openModal, setOpenModal] = useState({
    modalDeleteMsg: false,
    modalEditMsg: false,
    modalCreateGroup: false,
  });

  const [data, setData] = useState({})
  const [weather, setWeather] = useState([]) 
  const [location, setLocation] = useState("")
  const [selectGIF, setSelectGIF] = useState("")
  const [selectedGIF, setSelectedGIF] = useState("")
  const [GIF, setGIF] = useState([]);

  const handleWeather = () =>{
    findMyLocation()
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location},lat&APPID=d905ced1896df43dff776fec1fc81073`).then((response) => {
        setData(response.data);
        setWeather(response.data.weather[0])
      });
  }



  const handleOpenWeatherCommant = () =>{
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location},lat&APPID=3bd740d64f5ad6b4786618ba189dbfb8`).then((response) => {
        setData(response.data);
        setWeather(response.data.weather[0])
      });
  }

  const findMyLocation = () => {
    const status = document.querySelector('.status')
  
    const success = (position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
  
      const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  
      fetch(geoApiUrl)
      .then(res => res.json())
      .then(data => {
        let locationRepalce = data.locality.replace(/Costa Rica/g, '')
        locationRepalce = locationRepalce.replace(/\(/g, '');
        locationRepalce = locationRepalce.replace(/\)/g, '');
        
        setLocation(locationRepalce)
      })
    }
    const error = () => {
      status.textContent = "Error your location"
    }
    navigator.geolocation.getCurrentPosition(success, error)
  }

  findMyLocation()
  console.log(location)
  
    function addZero(i) {
      if (i < 10) {i = "0" + i}
      return i;
    }
  
    const TimeLocation = () => {
        const d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let s = addZero(d.getSeconds());
        let time = h + ":" + m ;
        return time
      }

  const onClickButton = (modal) => {
    setOpenModal({
      ...openModal,
      [modal]: !openModal[modal],
    });
  };

  //Cifrar mensajes
  const cifrar = (mensaje, id) => {
    const textoCifrado = CryptoJS.AES.encrypt(mensaje, id).toString()
    return textoCifrado
  }
//Descrifrar mensajes
  const descifrar = (mensaje, id) => {
    const bytes = CryptoJS.AES.decrypt(mensaje, id)
    const textoDescifrado = bytes.toString(CryptoJS.enc.Utf8)
    return textoDescifrado
  }


  


  //Actualizar usuarios bloqueados
  const updateBlockedUsers = async (currentUserId, lista) => {
    const userRef = doc(db, "users", currentUserId);
    const user = await getDoc(userRef);
    const userData = user.data()
    const obj = {
      ...userData,
      ['blockedUsers']: lista
    } 
    await setDoc(userRef, obj);
  }

  //Funciones firebase
  const updateMsg = async (path, docId, obj, collectionId) => {
    await setDoc(doc(db, path, docId), obj);

    const msgRef = doc(db, "lastMsg", collectionId);
    const lastMsg = await getDoc(msgRef);
    if (lastMsg.data()) {
      if (lastMsg.data().id === docId) {
        try {
          await setDoc(msgRef, obj);
        } catch {}
      }
    }
  };

  const deleteMsg = async (path, docId, collectionId) => {
    const document = doc(db, path, docId);
    await deleteDoc(document);

    const msgRef = doc(db, "lastMsg", collectionId);
    const lastMsg = await getDoc(msgRef);
    if (lastMsg.data()) {
      if (lastMsg.data().id === docId) {
        try {
          await deleteDoc(msgRef);
        } catch {}
      }
    }
  };

  //Buscar mensaje
  let mensajesBuscados = [];
  
  if (textoBuscado === '') {
    mensajesBuscados = [...msgs]
  } else {
    mensajesBuscados = msgs.filter(m => {
      const msgtext = m.text.toLowerCase();
      let nombreArchivo = ''
      if (m.media) {
        nombreArchivo = m.media.nombre.toLowerCase();
      }
      const texto = textoBuscado.toLowerCase();

      return msgtext.includes(texto) || nombreArchivo.includes(texto);
    })
  }

//Buscar mensaje en grupo
let mensajesBuscadosG = [];
  
  if (textoBuscadoG === '') {
    mensajesBuscadosG = [...msgG]
  } else {
    mensajesBuscadosG = msgG.filter(m => {
      const msgtextG = m.text.toLowerCase();
      let nombreArchivo = ''
      if (m.media) {
        nombreArchivo = m.media.nombre.toLowerCase();
      }
      const textoG = textoBuscadoG.toLowerCase();
      return msgtextG.includes(textoG) || nombreArchivo.includes(textoG);
    })
  }

  const handleSearchGIFSelected = (selected) => {
    axios.get(`https://api.giphy.com/v1/gifs/search?api_key=FfC0GoBNWauajLfhAlvJ7Yc2ebHobpyu&q=${selected}&limit=25&offset=0&rating=g&lang=en`).then((response) => {
      setGIF(response.data.data);
      (openDialog.showGIF) ? setOpenDialog({...openDialog, showGIF: false}) :  setOpenDialog({...openDialog, showGIF: true})
    });
  }



  return (
    <appContext.Provider
      value={{
        openModal,
        onClickButton,
        handleSearchGIFSelected,
        GIF, setGIF,
        openDialog,
        openAlert,
        setOpenAlert,
        handleOpenWeatherCommant,
        handleWeather,
        setOpenDialog,
        updateMsg,
        deleteMsg,
        openAlert, 
        setOpenAlert,
        selectedMsg,
        weather, 
        selectedGIF, 
        setSelectedGIF,
        selectGIF, 
        setSelectGIF,
        setWeather,
        data,
        setData,
        setSelectedMsg,
        reminder, 
        TimeLocation,
        setReminder,
        selected,
        setSelected,
        msgs,
        setMsgs,
        textoBuscado,
        textoBuscadoG,
        setTextoBuscado,
        setTextoBuscadoG,
        mensajesBuscados,
        mensajesBuscadosG,
        blockedUsers,
        setBlockedUsers,
        updateBlockedUsers,
        msgG,
        setMsgG,
        Me, 
        setMe,
        cifrar,
        findMyLocation,
        descifrar
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppContextProvider, appContext };
