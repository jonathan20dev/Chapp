import React from "react";
import {Attachment} from "./svg/Attachment";

const MessageForm = ({ handleSubmit, text, setText, setFile }) => {
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <label htmlFor="file">
        <Attachment />
      </label>
      <input
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        id="file"
        accept="image/*, video/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btn">Send</button>
      </div>
    </form>
  );
};

export {MessageForm}