import React, { useEffect, useState } from "react";
import Img from "../grupo.png";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

const Group = ({user1, grupo, selectGroup,chat, descifrar }) => {
  const user2 = grupo.gid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = grupo.gid;
    let unsub = onSnapshot(doc(db, "lastMsgG", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === grupo.name && "selected_user"}`}
        onClick={() => selectGroup(grupo)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img src={Img} alt="avatar" className="avatar" />
            <h4>{grupo.name}</h4>
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
        onClick={() => selectGroup(grupo)}
        className={`sm_container ${chat.name === grupo.name && "selected_user"}`}
      >
        <img
          src={Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
    </>
  );
};

export {Group};