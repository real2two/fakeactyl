// No WebSocket support.

import cors from "cors";
import express from "express";
import expressWs from "express-ws";

const app = new express();
expressWs(app);

app.use(express.json({
  inflate: true,
  limit: '500kb',
  reviver: null,
  strict: true,
  type: 'application/json',
  verify: undefined
}));

app.use(cors());

const wingsURL = "http://192.168.228.128:8080";
const wingsAuthorization = "iow2cY6CrJKHzMWXmvOQgYEwjT2TTSEcXXU05fQtKIvE85eXk1dlkqM9jWchxsly"

app.use(async (req, res, next) => {
  console.log('==============');
  console.log(`${req.method} ${wingsURL}${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  if (req.headers.connection === "Upgrade") {
    return res.sendStatus(500);
  }

  const headers = { ...req.headers };
  delete headers['content-length'];
  headers.authorization = `Bearer ${wingsAuthorization}`;
  
  try {
    const text = await (
      await fetch(`${wingsURL}${req.originalUrl}`, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body
      })
    ).text();

    res.send(text);

    try {
      const json = JSON.parse(text);
      console.log("Response:", json);
    } catch(err) {
      console.log("Response:", text);
    }
  } catch(err) {
    console.error(err);
  }
});

app.listen(8080);