import { useState } from "react";
import { Layout, Row, Col } from "antd";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const { Content } = Layout;

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div
      style={{
        width: "100%",
        //backgroundImage: `url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')`, // Replace with your image URL
        backgroundSize: "cover", // Ensures the image covers the entire area
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat", // Prevents repeating
      }}
    >
      {user && <SideDrawer />}
      <Layout
        style={{
          minHeight: "91.5vh",
          padding: "10px",
          backgroundImage: `url('https://www.shutterstock.com/image-vector/social-media-sketch-vector-seamless-600nw-1660950727.jpg')`,
        }}
      >
        <Content style={{ display: "flex", justifyContent: "space-between" }}>
          {user && (
            <Col span={8} style={{ padding: "10px" }}>
              <MyChats fetchAgain={fetchAgain} />
            </Col>
          )}
          {user && (
            <Col span={16} style={{ padding: "10px" }}>
              <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Col>
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default Chatpage;
