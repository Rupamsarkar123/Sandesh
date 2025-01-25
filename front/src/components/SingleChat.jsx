import { Input, Button, Spin, Avatar, Typography, Tooltip, Modal } from "antd";
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

//import EmojiPicker from "emoji-picker-react"; // added

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const { Text } = Typography;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  //const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      Modal.error({
        title: "Error Occurred!",
        content: "Failed to Load the Messages",
      });
    }
  };

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        Modal.error({
          title: "Error Occurred!",
          content: "Failed to send the Message",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Function to handle emoji selection
  //   const handleEmojiClick = (emojiObject) => {
  //     setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  //     setEmojiPickerVisible(false);
  //   };

  return (
    <>
      {selectedChat ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              marginBottom: "15px",
            }}
          >
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setSelectedChat("")}
              style={{
                fontSize: "18px",
                padding: "10px 20px",
                marginRight: "10px",
              }}
            />
            <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : selectedChat.users.find((u) => u._id !== user._id).name}
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "10px",
              backgroundColor: "#f5f5f5",
              height: "calc(90vh - 180px)", // Adjust height
              position: "relative",
              overflowY: "auto",
              width: "550px",
              backgroundImage: `url('https://wallpapers.com/images/hd/whatsapp-chat-background-fb34cc4b2hg9lmix.jpg')`,
              backgroundSize: "cover", // Ensures the image covers the entire area
              backgroundPosition: "center", // Centers the image
              backgroundRepeat: "no-repeat", // Prevents repeating
            }}
          >
            {loading ? (
              <Spin size="large" />
            ) : (
              <ScrollableFeed>
                {messages.map((m, i) => (
                  <div key={m._id} style={{ display: "flex" }}>
                    {(isSameSender(messages, m, i, user._id) ||
                      isLastMessage(messages, i, user._id)) && (
                      <Tooltip title={m.sender.name}>
                        <Avatar src={m.sender.pic} />
                      </Tooltip>
                    )}
                    <span
                      style={{
                        backgroundColor:
                          m.sender._id === user._id ? "#87CEEB" : "#90EE90",
                        borderRadius: "5px",
                        padding: "10px 15px",
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                        marginTop: isSameUser(messages, m, i, user._id)
                          ? 3
                          : 10,
                      }}
                    >
                      {m.content}
                    </span>
                  </div>
                ))}
              </ScrollableFeed>
            )}
          </div>
          <div style={{ display: "flex", width: "100%", marginTop: "10px" }}>
            <Input
              value={newMessage}
              onChange={typingHandler}
              onPressEnter={sendMessage}
              placeholder="Enter message"
              style={{
                flex: 1, // Takes available space
                fontSize: "16px",
                padding: "12px",
                height: "50px", // Set height
              }}
            />

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              style={{
                width: "120px", // Set width as per requirement
                height: "50px", // Same height as input
                marginLeft: "10px",
                fontSize: "16px",
              }}
              disabled={!newMessage}
            >
              Send
            </Button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Text strong>Click on a user to start chatting</Text>
        </div>
      )}
    </>
  );
};

export default SingleChat;
