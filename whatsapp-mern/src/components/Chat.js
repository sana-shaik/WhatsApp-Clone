import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import {
  SearchOutlined,
  AttachFile,
  MoreVert,
  InsertEmoticon,
  Mic,
  Send,
} from "@material-ui/icons/";
import axios from "./axios";
import Picker from "emoji-picker-react";

const Chat = ({ messages }) => {
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  useEffect(() => {
    setShowEmojiPicker(false);
  }, [chosenEmoji]);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setInput(emojiObject.emoji);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post(`/api/v1/messages/new`, {
      message: input,
      name: "Sana",
      timestamp: "Just now!",
      received: false,
    });

    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>Room name</h3>
          <p>Last seen at {new Date().toUTCString()} </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p className={`chat_message ${message.received && "chat__receiver"}`}>
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}
        <p className="chat__message">
          <span className="chat__name">Sana</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>

        <p className="chat__message chat__receiver">
          <span className="chat__name">Sana</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>

        <p className="chat__message">
          <span className="chat__name">Sana</span>
          This is a message
          <span className="chat__timestamp">{new Date().toUTCString()}</span>
        </p>
      </div>
      <div className="chat__footer">
        {/* <span onClick={() => (<Picker />)}> */}
        <div onClick={() => setShowEmojiPicker(true)}>
          {showEmojiPicker ? (
            <Picker onEmojiClick={onEmojiClick} />
          ) : (
            <IconButton>
              <InsertEmoticon />
            </IconButton>
          )}
        </div>

        {/* </span> */}

        {/* <Picker /> */}
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        {input.length > 0 ? <Send /> : <Mic />}
      </div>
    </div>
  );
};

export default Chat;
