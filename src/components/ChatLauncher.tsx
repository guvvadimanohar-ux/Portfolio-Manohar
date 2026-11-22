import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import "./styles/ChatLauncher.css";

const ChatLauncher: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <>
      {open && <ChatPanel onClose={toggle} />}
      <button className="chat-launcher" onClick={toggle} aria-label="Open chat">
        💬
      </button>
    </>
  );
};

export default ChatLauncher;
