import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    subscribeToTyping,
    unsubscribeFromTyping,
    editMessage,
    deleteMessage,
    subscribeToMessageUpdates,
    unsubscribeFromMessageUpdates,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();
    subscribeToTyping();
    subscribeToMessageUpdates();

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
      unsubscribeFromMessageUpdates();
    };
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, subscribeToTyping, unsubscribeFromTyping, subscribeToMessageUpdates, unsubscribeFromMessageUpdates]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".msg-dropdown")) setOpenDropdownId(null);
    };
    if (openDropdownId) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdownId]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-1">
        {messages.map((message, idx) => {
          const isLastFromSender =
            idx === messages.length - 1 || messages[idx + 1].senderId !== message.senderId;
          return (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} group`}
            >
              {isLastFromSender ? (
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
              ) : (
                <div className="chat-image avatar w-10" />
              )}
              <div className="chat-header mb-1 flex items-center">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
                {/* 3-dots menu for own messages */}
                {message.senderId === authUser._id && (
                  <div className="relative ml-2 msg-dropdown">
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-base-200"
                      onClick={() => setOpenDropdownId(openDropdownId === message._id ? null : message._id)}
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
                    </button>
                    {openDropdownId === message._id && (
                      <div className="absolute right-0 mt-2 w-28 bg-base-100 border border-base-200 rounded shadow z-10 animate-fadeIn">
                        <button className="block w-full text-left px-4 py-2 hover:bg-base-200" onClick={() => {
                          setEditingId(message._id);
                          setEditText(message.text);
                          setOpenDropdownId(null);
                        }}>Edit</button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-base-200 text-error" onClick={async () => {
                          setOpenDropdownId(null);
                          if (window.confirm("Delete this message?")) {
                            await deleteMessage(message._id);
                          }
                        }}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={`chat-bubble flex flex-col ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.file && message.file.url && (
                  <div className="mt-2">
                    {message.file.type && message.file.type.startsWith("image/") ? (
                      <a href={message.file.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={message.file.url}
                          alt={message.file.name}
                          className="sm:max-w-[200px] rounded-md mb-2 border"
                        />
                      </a>
                    ) : (
                      <a
                        href={message.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 underline hover:no-underline ${message.senderId === authUser._id ? 'text-primary-content' : 'text-base-content'}`}
                        download={message.file.name}
                      >
                        <Paperclip size={18} />
                        <span className="truncate max-w-[120px]">{message.file.name}</span>
                      </a>
                    )}
                  </div>
                )}
                {editingId === message._id ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await editMessage(message._id, editText);
                      setEditingId(null);
                    }}
                    className="flex flex-col gap-2"
                  >
                    <input
                      className="input input-bordered input-sm"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-1">
                      <button type="submit" className="btn btn-xs btn-primary">Save</button>
                      <button type="button" className="btn btn-xs" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  message.deleted ? (
                    <span className="italic text-zinc-400">Message deleted</span>
                  ) : (
                    <span>
                      {message.text}
                      {message.edited && (
                        <span className="ml-2 text-xs italic text-zinc-400">(edited)</span>
                      )}
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-bubble flex flex-col bg-base-200 text-base-content">
              <span className="flex gap-1 items-center">
                <span className="dot w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="dot w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="dot w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;