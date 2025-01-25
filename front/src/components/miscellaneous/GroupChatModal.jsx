import { Modal, Button, Input, Spin, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user, chats, setChats } = ChatState();

  const showToast = (msg, type = "info") => {
    message[type](msg); // 'info', 'success', 'error', 'warning'
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      showToast("User already added", "warning");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      showToast("Failed to load the search results", "error");
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      showToast("Please fill all the fields", "warning");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      showToast("New Group Chat Created!", "success");
      setIsOpen(false);
    } catch (error) {
      showToast("Failed to create the chat!", "error");
    }
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      <Modal
        title="Create Group Chat"
        open={isOpen} // Updated to use 'open' instead of 'visible'
        onCancel={() => setIsOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <Input
          placeholder="Chat Name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <Input
          placeholder="Add Users (e.g., John, Piyush, Jane)"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: "8px" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "8px" }}>
          {selectedUsers.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              handleFunction={() => handleDelete(u)}
            />
          ))}
        </div>
        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          searchResult
            ?.slice(0, 4)
            .map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleGroup(user)}
              />
            ))
        )}
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Button type="primary" onClick={handleSubmit}>
            Create Chat
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default GroupChatModal;
