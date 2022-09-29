import React, { createContext, useState } from "react";
import { doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import CryptoJS from "crypto-js";

const appContext = createContext();

const AppContextProvider = ({ children }) => {

  //Usuarios bloqueados 
  const [blockedUsers, setBlockedUsers] = useState([]);
  
  //variables para buscarMensaje 
  const [textoBuscado, setTextoBuscado] = useState('');
  const [textoBuscadoG, setTextoBuscadoG] = useState('');

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
      const msgtext = descifrar(m.text, m.id).toLowerCase();
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
      const msgtextG = descifrar(m.text, m.id).toLowerCase();
      let nombreArchivo = ''
      if (m.media) {
        nombreArchivo = m.media.nombre.toLowerCase();
      }
      const textoG = textoBuscadoG.toLowerCase();
      return msgtextG.includes(textoG) || nombreArchivo.includes(textoG);
    })
  }



  return (
    <appContext.Provider
      value={{
        openModal,
        onClickButton,
        updateMsg,
        deleteMsg,
        selectedMsg,
        setSelectedMsg,
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
        descifrar
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppContextProvider, appContext };
