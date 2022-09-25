import React, { useRef, useEffect } from "react";
import Moment from "react-moment";


const ReadMsgGroup = ({ msg, users, actualUser, descifrar }) => {
  const scrollRef = useRef();
  const remitentes = [...users, actualUser]
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <div
      className={`message_wrapper ${msg.from === actualUser.uid ? "own" : ""}`}
      ref={scrollRef}
    >
      
      <p className={msg.from === actualUser.uid ? "me" : "friend"}>
      {(msg.from !== actualUser.uid)&&(
      <>
        <small style={{marginTop:"0px", marginBottom:"10px"}}>
        <strong>
          {(remitentes.find(u => u.uid === msg.from).name)}
        </strong>
        </small>
        <br/>
      </>)}

        {String(msg.media.tipo).split("/")[0] === "image" ? <img style={{maxHeight: 500}} src={msg.media.url} alt={msg.text} /> : null}
        {String(msg.media.tipo).split("/")[0] === "video" ? <video style={{maxHeight: 500}} src={msg.media.url} alt={msg.text} controls/> : null}
        {String(msg.media.tipo).split("/")[0] === "audio" ? <audio src={msg.media.url} alt={msg.text} controls/> : null}
        {descifrar(msg.text, msg.id)}
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
};

export {ReadMsgGroup}