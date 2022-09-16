import React, { createContext, useState } from 'react'
import { doc, deleteDoc, collection, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const appContext = createContext();

const AppContextProvider = ({ children }) => {
  //Manejo de modals
  const [openModal, setOpenModal] = useState({modalDeleteMsg: false, modalEditMsg: false})
  const [selectedMsg, setSelectedMsg] = useState('')
  const [selected, setSelected] = useState(false)
    
  const onClickButton = (modal) => {
      setOpenModal({
        ...openModal, 
        [modal]: !openModal[modal]
      });
  };

  const updateMsg = async (path, docId, obj, collectionId) => {
    await setDoc(doc(db, path, docId), obj);

    const msgRef = doc(db, 'lastMsg', collectionId)
    const lastMsg = await getDoc(msgRef);
    if (lastMsg.data()) {
      if (lastMsg.data().id === docId) {
        try{
          await setDoc(msgRef, obj);
        } catch{}
      } 
    }
  }

  const deleteMsg = async (path, docId, collectionId) => {
    const document = doc(db, path, docId);
    await deleteDoc(document);

    const msgRef = doc(db, 'lastMsg', collectionId)
    const lastMsg = await getDoc(msgRef);
    if (lastMsg.data()) {
      if (lastMsg.data().id === docId) {
        try{
          await deleteDoc(msgRef);
        } catch{}
      } 
    }
  };

  return (
    <appContext.Provider value={{ openModal, onClickButton, updateMsg, deleteMsg, selectedMsg, setSelectedMsg, selected, setSelected }}>
        {children}
    </appContext.Provider>
  )
}

export {AppContextProvider, appContext}