//importing
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import dbMessages from "./dbMessages";
import cors from "cors";

//app config

const app = express();
const port = process.env.port || 9000;

const pusher = new Pusher({
  appId: "1067400",
  key: "bdc19433724e2c7156c0",
  secret: "47a25787ec41d100d41e",
  cluster: "ap2",
  encrypted: true,
});

//middleware
app.use(express.json());
app.use(cors());

//DB config
const connection_url = `mongodb+srv://admin:sO0ybfAdSSplLxNE@cluster0.7nw4a.mongodb.net/whatsappdb?retryWrites=true&w=majority
`;
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");

  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.user,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//api routes

app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/api/v1/messages/sync", (req, res) => {
  dbMessages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/v1/messages/new", (req, res) => {
  const dbMessage = req.body;

  dbMessages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//listener

app.listen(port, () => console.log(`listening on localhost:${port}`));
