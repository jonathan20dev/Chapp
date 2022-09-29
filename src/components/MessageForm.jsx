import React from "react";
import { Attachment } from "./svg/Attachment";
import { AudioRecord } from "./AudioRecord";
import { Send } from "./svg/Send";

const MessageForm = ({ handleSubmit, text, setText, setFile, file }) => {
  return (
    <div
      className='absoluteBackground'
    >
      <form className="message_form" onSubmit={handleSubmit}>
        <label htmlFor="file">
          <Attachment />
        </label>
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          id="file"
          accept="image/*, video/*, audio/*"
          style={{ display: "none" }}
        />
        <div>
          <input
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ backgroundColor: "#f7f8fc" }}
          />
        </div>
        <button
          style={{ outline: "none", backgroundColor: "whiteSmoke", border: 0 }}
        >
          <Send colorActive={!file ? "#4d94ff" : "green"} />
        </button>
        <AudioRecord setFile={setFile} />
      </form>
    </div>
  );
};

export { MessageForm };
