import React, { useRef, useEffect } from "react";
import Moment from "react-moment";

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef();
  console.log(msg)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <p className={msg.from === user1 ? "me" : "friend"}>
        {String(msg.media.tipo).split("/")[0] === "image" ? <img style={{maxHeight: 500}} src={msg.media.url} alt={msg.text} /> : null}
        {String(msg.media.tipo).split("/")[0] === "video" ? <video style={{maxHeight: 500}} src={msg.media.url} alt={msg.text} controls/> : null}
        {String(msg.media.tipo).split("/")[0] === "audio" ? <audio src={msg.media.url} alt={msg.text} controls/> : null}
        {msg.text}
        <br />
        <small>
          <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
};

export {Message}