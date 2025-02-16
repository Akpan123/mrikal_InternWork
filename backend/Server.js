const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const documentRoutes = require("./routes/DocumentRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/collab-docs");

// Routes
app.use("/api/docs", documentRoutes);

// Socket.io
io.on("connection", (socket) => {
  socket.on("join-document", (docId) => {
    socket.join(docId);
  });

  socket.on("text-change", (data) => {
    socket.to(data.docId).emit("received-changes", data.content);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
