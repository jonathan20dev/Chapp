import React, { createContext, useState } from "react";
import { doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const appContext = createContext();

const AppContextProvider = ({ children }) => {
  //variables para buscarMensaje 
  const [textoBuscado, setTextoBuscado] = useState('');
  const registroMsgs = []

  //Manejo de selección para editar o borrar mensaje
  const [selectedMsg, setSelectedMsg] = useState("");
  const [selected, setSelected] = useState(false);
  const [msgs, setMsgs] = useState([]);

  //Manejo de modals
  const [openModal, setOpenModal] = useState({
    modalDeleteMsg: false,
    modalEditMsg: false,
  });

  const onClickButton = (modal) => {
    setOpenModal({
      ...openModal,
      [modal]: !openModal[modal],
    });
  };

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
        setTextoBuscado,
        mensajesBuscados
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export { AppContextProvider, appContext };
