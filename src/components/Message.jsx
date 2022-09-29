import React, { useRef, useEffect, useContext } from "react";
import Moment from "react-moment";
import { Delete } from './svg/Delete'
import { Edit } from './svg/Edit'
import { Modal } from "./Modal.jsx";
import { appContext } from "../context/AppContext";
import { DeleteMsg } from './DeleteMsg.jsx'
import { EditMsg } from './EditMsg.jsx'

const Message = ({ msg, user1, descifrar }) => {
  const scrollRef = useRef();
  const {openModal, onClickButton, selectedMsg, setSelectedMsg, selected, setSelected} = useContext(appContext)

  const handleSelect = () => {
    msg.from === user1 && msg.id === selectedMsg.id && setSelected(!selected)
    msg.from === user1 && msg.id !== selectedMsg.id && !selected && setSelected(true)
    setSelectedMsg(msg)
  }

  const handleDelete = () => {
    onClickButton('modalDeleteMsg')
  }

  const handleEdit = () => {
    onClickButton('modalEditMsg')
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  return (
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      <span style={{padding: '0px 5px 0px 8px', display: `${msg.from === user1 && msg.id === selectedMsg.id && selected ? "" : "none"}`}} onClick={handleDelete}>
        <Delete/>
      </span>
      {
        openModal.modalDeleteMsg && (
        <Modal>
          <DeleteMsg msg={selectedMsg}/>
        </Modal>)
      }
      <span style={{padding: '0px 10px 0px 5px', display: `${msg.from === user1 && msg.id === selectedMsg.id && selected ? "" : "none"}`}} onClick={handleEdit}>
        <Edit/>
      </span>
      {
        openModal.modalEditMsg && (
        <Modal>
          <EditMsg msg={selectedMsg}/>
        </Modal>)
      }
      <p className={msg.from === user1 ? "me" : "friend"} onClick={handleSelect}>
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

export {Message}