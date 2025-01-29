import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const { Title, Text } = Typography;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      message.error("Failed to Load the chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Card
      style={{
        display: selectedChat ? "none" : "flex",
        flexDirection: "column",
        padding: "10px",
        background: "white",
        width: "100%",
        maxWidth: "2500px",
        borderRadius: "8px",
        borderWidth: "1px",
      }}
    >
      {/* Header Section with proper alignment */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          marginBottom: "16px",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
           Chats
        </Title>

        <GroupChatModal>
          <Button type="primary" icon={<PlusOutlined />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </div>

      {/* Chat List */}
      <Card
        style={{
          display: "flex",
          flexDirection: "column",

          padding: "5px",
          background: "#F8F8F8",
          width: "100%", // fixed width
          height: "525px",
          borderRadius: "8px",
          overflowY: "auto",
          backgroundImage: `url('https://is.zobj.net/image-server/v1/images?r=gICid8vMMJTLnHI3qnecdn0AIhbygLGXh49dX1QAN-0dlemQWU45EIInMVWyxwk79KipUL4-DwAo0iVMne6fGYmEDikL5I245_6jQCzxEE1Pl5s3BDLzdsypXJkCZT88mjxosOO8c2InRLFU_K2ad_TAyEPb0_ODYhs97wKL0j6zA4bCgGWkLKT3asgeBZVh8Izoj8k65qo3n5ti6uGguNZxb7q-ga5cYIfnH_7t6tGKZX69F0GiNt8Gtsg')`,
        }}
      >
        {chats && chats.length > 0 ? (
          <div style={{ overflowY: "scroll", height: "100%" }}>
            {chats.map((chat) => (
              <Card
                key={chat._id}
                hoverable
                onClick={() => setSelectedChat(chat)}
                style={{
                  cursor: "pointer",
                  background: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                  color: selectedChat === chat ? "white" : "black",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  padding: "12px",
                  minHeight: "30px", // Minimal height for each chat box
                  display: "flex",
                  flexDirection: "column", // Stack name and message vertically
                  justifyContent: "space-between",
                }}
              >
                <Text strong style={{ fontSize: "14px", marginBottom: "4px" }}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </Card>
    </Card>
  );
};

export default MyChats;
