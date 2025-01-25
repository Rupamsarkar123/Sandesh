import React, { useEffect } from "react";
import { Card, Row, Col, Tabs } from "antd";
import {
  SolutionOutlined,
  ProfileOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);
  return (
    <Row
      align="middle"
      justify="center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Col>
        <Card
          bordered={false}
          style={{
            width: 400,
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h1 style={{ fontWeight: "bold" }}>
            <MessageOutlined /> -Sandesh
          </h1>
          <Tabs
            defaultActiveKey="1"
            tabBarGutter={80}
            items={[
              {
                key: "1",
                label: (
                  <span>
                    <ProfileOutlined />
                    Sign Up
                  </span>
                ),
                children: (
                  <div>
                    <Signup></Signup>
                  </div>
                ),
              },
              {
                key: "2",
                label: (
                  <span>
                    <SolutionOutlined />
                    Login
                  </span>
                ),
                children: (
                  <div>
                    <Login></Login>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Homepage;
