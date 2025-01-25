import * as React from "react";
import { BrowserRouter } from "react-router-dom";
//import { Provider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Button } from "antd";
import App from "./App.jsx";
import ChatProvider from "./Context/ChatProvider.jsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  <ConfigProvider>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ConfigProvider>
);

// import { ChakraProvider } from "@chakra-ui/react";
// //import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <ChakraProvider>
//       <App />
//     </ChakraProvider>
//   </StrictMode>
// );
