import React, { useContext, useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
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
import {ReadMsgGroup} from "../components/ReadMsgGroup";
import { appContext } from "../context/AppContext";
import { v4 as uuid } from "uuid";
import { BurgerMenu } from "../components/svg/BurgerMenu";
import { Button } from "@mui/material";
import {CreateGroupModal} from "../components/CreateGroupModal"
import {Group} from "../components/Group"


function Home() {
  const {setMsgs, textoBuscado, setTextoBuscado, mensajesBuscados, setMsgG, textoBuscadoG, setTextoBuscadoG, mensajesBuscadosG, setBlockedUsers, blockedUsers, updateBlockedUsers} = useContext(appContext)
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [chatG, setChatG] = useState("");
  const [group, setGroup] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [options, setOptions] = useState(false);
  const [optionsG, setOptionsG] = useState(false);

  const user1 = auth.currentUser.uid;

  const setBU = async () => {
    /* const userRef = doc(db, "users", auth.currentUser.uid);
    const user1 = await getDoc(userRef);
    const userData = user1.data() */

    onSnapshot(doc(db, "users", auth.currentUser.uid), (docSnap) => {
      const userInfo = docSnap.data()
      setBlockedUsers(userInfo.blockedUsers) ;
    });

    //setBlockedUsers(userData.blockedUsers) 
  }

  //cuando -> uid no sea id mio
  //cuando -> []

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
    setBU()
    return () => unsub();
  }, []);

  //Se trae los grupos
  useEffect(() => {
    const usersRef = collection(db, "groups");
    // create query object
    const q = query(usersRef);
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().participants.some(el => el === user1)){
          //true, la persona está en el grupo
          users.push(doc.data());
        }
      });
      setGroup(users);
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

  const selectGroup = async (grupo) => {
    setChat("");
    setChatG(grupo);

  const id = grupo.gid;

  const msgsRef = collection(db, "messagesG", id, "chat");
  const q = query(msgsRef, orderBy("createdAt", "asc"));

  onSnapshot(q, (querySnapshot) => {
    let msgs = [];
    querySnapshot.forEach((doc) => {
      msgs.push(doc.data());
    });
    setMsgG(msgs);
  });

  const docSnap = await getDoc(doc(db, "lastMsgG", id));
  if (docSnap.data() && docSnap.data().from !== user1) {
    await updateDoc(doc(db, "lastMsgG", id), { unread: false });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////

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

  const handleSubmitG = async (e) => {
    try{
      e.preventDefault();
    } catch {}
    
    const id = chatG.gid;
    const addressedTo = chatG.participants.filter(el => el !== user1)

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

    const collectionRef = collection(db, "messagesG", id, "chat")
    const msgId = uuid()

    await setDoc(doc(db, collectionRef.path, msgId), {
      id: msgId,
      collectionId: uuid(),
      path: collectionRef.path,
      text,
      from: user1,
      to: addressedTo,
      createdAt: Timestamp.fromDate(new Date()),
      media: url ? {
        url: url,
        tipo: file.type,
        nombre: file.name
      } : "",
    }); 

    await setDoc(doc(db, "lastMsgG", id), {
      id: msgId,
      text,
      from: user1,
      to: addressedTo,
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

  const handleBloqueo = () => {
    let lista = []
    if (blockedUsers.some((id) => id === chat.uid)) {
      lista = blockedUsers.filter((uid) => uid !== chat.uid)
    } else {
      lista = [...blockedUsers, chat.uid]
    }
    setBlockedUsers(lista)
    updateBlockedUsers(user1, lista) 
  }

  const handleLeaveGroup = async() => {
    const modify = chatG.participants.filter((uid) => uid !== user1)
    chatG.participants = modify
    setChatG("")
    await setDoc(doc(db, "groups", chatG.gid), chatG);
  }

  return (
    <div className="home_container">
      <div className="users_container">
      <CreateGroupModal users={users} user1={user1}/>

      {group.map((grupo) => (
          <Group
          user1={user1}
          key={grupo.gid}
          grupo={grupo}
          selectGroup={selectGroup}
          chat={chatG}
          />
        ))}

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
      
        {
          (!chat && !chatG) && (
            <div className="messages_container">
              <h3 className="no_conv">Select a user/group to start conversation</h3>
            </div>
            )
        }


          {(chat)&&(
            <div className="messages_container">
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
                              <Button variant="outlined" size='small' color="error" onClick={handleBloqueo}>
                                { blockedUsers.some((id) => id ===chat.uid) ? 'Desbloquear' : 'Bloquear' }
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
                      { 
                      blockedUsers.some((id) => id === chat.uid) ? <div className='absoluteBackground' style={{color: 'red'}}>Desbloquea el contacto para enviar mensajes</div> 
                      :(chat.blockedUsers.some((id) => id === user1) ? <div className='absoluteBackground' style={{color: 'red'}}>No puedes enviar mensajes a este chat</div> 
                      :<MessageForm
                      handleSubmit={handleSubmit}
                      text={text}
                      setText={setText}
                      setFile={setFile}
                    />)}
                  </div>
              )}

              {(chatG) && (
                <div className="messages_container">
                {/* ESTO ES PARA EL GRUPO */}
                  <div className="messages_user">
                      <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <h3>{chatG.name}</h3>
                        <div style={{display: 'flex', alignItems: 'center'}} onClick={() => {
                          setOptionsG(!optionsG)
                          setTextoBuscadoG('')
                          }}>
                          <BurgerMenu/>
                        </div>
                      </div>
                      {
                        optionsG && (
                          <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <div style={{padding: '0px 5px 0px 0px'}}> 
                              <input type='text' className="inputMenu" placeholder='Buscar msg/archivo' value={textoBuscadoG} onChange={({target}) => {
                                  setTextoBuscadoG(target.value)
                                }} />
                            </div>
                            <Button variant="outlined" size='small' color="error" onClick={handleLeaveGroup}>
                              { "Leave group" }
                            </Button>
                          </div>
                        )
                      }
                    </div>
                    <div className="messages">
                      {mensajesBuscadosG.length
                        ? mensajesBuscadosG.map((msg, i) => (
                            <ReadMsgGroup key={i} msg={msg} users={users} actualUser = {auth.currentUser}/>
                          ))
                        : null}
                    </div>
                    <MessageForm
                      handleSubmit={handleSubmitG}
                      text={text}
                      setText={setText}
                      setFile={setFile}
                    />
            </div>)}
    </div>
  )
}

export {Home}