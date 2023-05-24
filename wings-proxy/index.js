// No WebSocket support.

import cors from "cors";
import express from "express";
import expressWs from "express-ws";

const app = new express();

app.use(express.text({ type: "*/*" }));
app.use(cors());

expressWs(app);

const wingsURL = "http://192.168.228.128:8080";
const wingsAuthorization = "iow2cY6CrJKHzMWXmvOQgYEwjT2TTSEcXXU05fQtKIvE85eXk1dlkqM9jWchxsly"

app.all("*", async (req, res) => {
  console.log('==============');
  console.log(`${req.method} ${wingsURL}${req.originalUrl}`);
  console.log('Headers:', req.headers);
  try {
    console.log('Body:', JSON.parse(req.body));
  } catch(err) {
    console.log('Body:', req.body);
  }

  if (req.headers.connection === "Upgrade") {
    return res.sendStatus(500);
  }

  const headers = { ...req.headers };
  delete headers['content-length'];
  headers.authorization = `Bearer ${wingsAuthorization}`;
  
  try {
    const fetched = await fetch(`${wingsURL}${req.originalUrl}`, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body
    });
    const text = await fetched.text();
    res.status(fetched.status).send(text);

    try {
      const json = JSON.parse(text);
      console.log("Response:", fetched.status, json);
    } catch(err) {
      console.log("Response:", fetched.status, text);
    }
  } catch(err) {
    console.error(err);
  }
});

app.listen(8080);