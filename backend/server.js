const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// STATE
let queue = [];          // array of patient objects
let currentToken = 0;    // token number currently being served
let avgTime = 7;         // average consultation time in minutes
let tokenCounter = 0;    // auto-increment for assigning new tokens
let isCalling = false;   // concurrency lock for call_next
let previousState = null; // for undo functionality

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// REST ENDPOINTS
app.get("/state", (req, res) => {
  res.json({
    queue,
    currentToken,
    avgTime,
    tokensToday: tokenCounter,
  });
});

// SOCKET.IO EVENTS
const getState = () => ({
  queue,
  currentToken,
  avgTime,
  tokensToday: tokenCounter,
});

// Helper to save previous state
const saveState = () => {
  previousState = {
    queue: JSON.parse(JSON.stringify(queue)),
    currentToken,
  };
};

io.on("connection", (socket) => {
  // Send state to new client
  socket.emit("queue_update", getState());

  // Event 1: add_patient
  socket.on("add_patient", (payload) => {
    tokenCounter++;
    if (payload.avgTime !== undefined) avgTime = payload.avgTime;
    queue.push({
      token: tokenCounter,
      name: payload.name,
      status: "waiting",
    });
    io.emit("queue_update", getState());
  });

  // Event 2: call_next
  socket.on("call_next", async () => {
    if (isCalling) return;
    isCalling = true;

    // Save state for undo
    saveState();

    const nextPatient = queue.find((p) => p.status === "waiting");
    if (nextPatient) {
      // Update previous current to called
      queue = queue.map((p) =>
        p.status === "current" ? { ...p, status: "called" } : p
      );
      // Set next patient to current
      queue = queue.map((p) =>
        p.token === nextPatient.token ? { ...p, status: "current" } : p
      );
      currentToken = nextPatient.token;
    }

    io.emit("queue_update", getState());
    isCalling = false;
  });

  // Event 3: set_avg_time
  socket.on("set_avg_time", (payload) => {
    avgTime = payload.avgTime;
    io.emit("queue_update", getState());
  });

  // Event 4: skip_patient
  socket.on("skip_patient", (payload) => {
    const patient = queue.find((p) => p.token === payload.token);
    if (patient && patient.status === "current") {
      // Save state for undo
      saveState();

      // Mark as skipped
      queue = queue.map((p) =>
        p.token === payload.token ? { ...p, status: "skipped" } : p
      );

      // Call next
      const nextPatient = queue.find((p) => p.status === "waiting");
      if (nextPatient) {
        queue = queue.map((p) =>
          p.token === nextPatient.token ? { ...p, status: "current" } : p
        );
        currentToken = nextPatient.token;
      } else {
        currentToken = 0;
      }

      io.emit("queue_update", getState());
    }
  });

  // Event 5: undo_call
  socket.on("undo_call", () => {
    if (previousState) {
      queue = previousState.queue;
      currentToken = previousState.currentToken;
      previousState = null;
      io.emit("queue_update", getState());
    }
  });

  // Event 6: reset_day
  socket.on("reset_day", () => {
    // Remove all called/skipped patients, keep waiting/current
    queue = queue.filter((p) =>
      p.status === "waiting" || p.status === "current"
    );
    // Reset token counter to current maximum token or 0 if no patients
    tokenCounter = queue.length > 0 ? Math.max(...queue.map(p => p.token)) : 0;
    io.emit("queue_update", getState());
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Queue Cure server running on port ${PORT}`);
  setInterval(() => {
    console.log(`Server is alive on port ${PORT}`);
  }, 3000);
});
