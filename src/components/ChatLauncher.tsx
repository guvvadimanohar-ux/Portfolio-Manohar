import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import "./styles/ChatLauncher.css";

const ChatLauncher: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <>
      {open && <ChatPanel onClose={toggle} />}
      <button
        className="chat-launcher"
        onClick={toggle}
        aria-label="Ask Manu AI Assistant"
        title="Ask Manu AI Assistant"
      >
        <span className="chat-launcher-icon">💬</span>
        <span className="chat-launcher-text">ASK MANU</span>
      </button>
    </>
  );
};

export default ChatLauncher;
