import React, { useContext, useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import {User} from "../components/User";
import {MessageForm} from "../components/MessageForm";
import {Message} from "../components/Message";
import { appContext } from "../context/AppContext";
import { v4 as uuid } from "uuid";
import { BurgerMenu } from "../components/svg/BurgerMenu";
import { Button } from "@mui/material";

function Home() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [options, setOptions] = useState(false);
  const {msgs, setMsgs, textoBuscado, setTextoBuscado, mensajesBuscados} = useContext(appContext)

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [user1]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

    const selectUser = async (user) => {
      setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    const docSnap = await getDoc(doc(db, "lastMsg", id));
    if (docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
    } catch {}
    
    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (file) {
      const fileRef = ref(
        storage,
        `${String(file.type).split("/")[0]}/${new Date().getTime()} - ${file.name}`
      );
      const snap = await uploadBytes(fileRef, file);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    const collectionRef = collection(db, "messages", id, "chat")
    const msgId = uuid()

    await setDoc(doc(db, collectionRef.path, msgId), {
      id: msgId,
      collectionId: id,
      path: collectionRef.path,
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url ? {
        url: url,
        tipo: file.type,
        nombre: file.name
      } : "",
    }); 

    await setDoc(doc(db, "lastMsg", id), {
      id: msgId,
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url ? {
        url: url,
        tipo: file.type,
        nombre: file.name
      } : "",
      unread: true,
    });

    setText("");
    setFile("");
  };

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">
              <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                <h3>{chat.name}</h3>
                <div style={{display: 'flex', alignItems: 'center'}} onClick={() => {
                  setOptions(!options)
                  setTextoBuscado('')
                  }}>
                  <BurgerMenu/>
                </div>
              </div>
              {
                options && (
                  <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div style={{padding: '0px 5px 0px 0px'}}> 
                      <input type='text' className="inputMenu" placeholder='Buscar msg/archivo' value={textoBuscado} onChange={({target}) => {
                          setTextoBuscado(target.value)
                        }} />
                    </div>
                    <Button variant="outlined" color="error">
                      Bloquear
                    </Button>
                  </div>
                )
              }
            </div>
            <div className="messages">
              {mensajesBuscados.length
                ? mensajesBuscados.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1}/>
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setFile={setFile}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a user to start conversation</h3>
        )}
      </div>
    </div>
  )
}

export {Home}