import React, { useEffect, useState } from "react";
import Img from "../profile.png";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

const User = ({ user1, user, selectUser, chat, descifrar }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <Badge color={(user.isOnline)? "success" : "secondary"} variant="dot" anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }} >
              <Avatar alt="Remy Sharp" src={user.avatar || Img} sx={{ width: 40, height: 40 }} />
            </Badge>
            <h4 style={{marginRight: "20px", marginLeft: "10px"}}>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Me:" : null}</strong>
            {descifrar(data.text, data.id)}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>

    </>
  );
};

export { User };