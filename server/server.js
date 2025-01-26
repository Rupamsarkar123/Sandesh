import express from "express";
import { chats } from "./data/data.js";
import chatRoutes from "./routes/chatRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";

import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import path from "path";

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data
//app.use(cors()); // changed
app.use(
  cors({
    origin: "http://localhost:5175/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); // Enable CORS for all routes
// app.get("/", (req, res) => {
//   res.send("API is running !");
// });

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------Deployment------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/front/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "front", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running succesfully..");
  });
}

// ------------Deployment------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}!`);
});

//const server = app.listen(console.log(`server is running on port ${PORT}!`));

import { Server } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5175",
    //credentials: true, // out commented
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
