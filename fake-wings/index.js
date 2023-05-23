import cors from "cors";
import express from "express";
import expressWs from "express-ws";
import jwt from "jsonwebtoken";

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

const panelURL = "http://192.168.228.128";
const tokenId = "ad738EcLSoC4nvv1"; // config.yml token_id
const token = "iow2cY6CrJKHzMWXmvOQgYEwjT2TTSEcXXU05fQtKIvE85eXk1dlkqM9jWchxsly"; // config.yml token (none of these tokens are valid. there are mere examples.)

app.use((req, _res, next) => {
  if (req.originalUrl !== "/api/system") {
    console.log('==============');
    console.log(`${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  }
  next();
});

app.get('/api/system', (req, res) => {
  res.json({
    architecture: 'amd64',
    cpu_count: 2,
    kernel_version: '5.19.0-41-generic',
    os: 'linux',
    version: '1.11.6'
  });
});

app.post('/api/update', (req, res) => {
  res.json({
    applied: true
  });
});

app.post('/api/servers', async (req, res) => {
  const request1 = await fetch(`${panelURL}/api/remote/servers/${req.body.uuid}`, {
    headers: {
      authorization: `Bearer ${tokenId}.${token}`, // config.yml token_id.token
      accept: "application/vnd.pterodactyl.v1+json",
      "accept-encoding": "gzip"
    }
  });
  console.log("r1", await request1.json());

  const request2 = await fetch(`${panelURL}/api/remote/servers/${req.body.uuid}/install`, {
    method: "post",
    headers: {
      authorization: `Bearer ${tokenId}.${token}`, // config.yml token_id.token
      'content-type': 'application/json',
      accept: "application/json",
    },
    body: JSON.stringify({
      successful: true,
      reinstall: true
    })
  });
  console.log("r2", request2.status);

  res.json({});
});

app.get("/api/servers/:uuid/files/list-directory", (req, res) => {
  res.json([]);
});

app.ws("/api/servers/:uuid/ws", (ws, req) => {
  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);
    console.log("ws", data);

    switch(data.event) {
      case "auth":
        ws.send(JSON.stringify({ event: "auth success" }));
        break;
      case "send logs":
        ws.send(JSON.stringify({ event: "console output", args: ["hi lol"] }))
        break;
      case "send stats":
        ws.send(JSON.stringify({ event: "status", args: ["offline"] }))
        break;
    }
  };
  ws.onclose = () => {
    console.log("ws closed");
  };
});

app.post("/api/transfers", async (req, res) => {
  const { sub } = jwt.decode(req.headers.authorization.slice("Bearer ".length), { allowInvalidAsymmetricKeyTypes: true });
  
  const request = await fetch(`${panelURL}/api/remote/servers/${sub}/transfer/success`, {
    method: "post", // "get" does the same thing (why. who designed this api?)
    headers: {
      authorization: `Bearer ${tokenId}.${token}`, // config.yml token_id.token
      accept: "application/vnd.pterodactyl.v1+json",
      "accept-encoding": "gzip"
    },
  });
  console.log("response", request.status);

  res.sendStatus(200);
});

app.post("/api/servers/:uuid/transfer", async (req, res) => {
  // Doesn't work.

  // try {
  //   const request = await fetch(req.body.url, {
  //     method: "post",
  //     headers: {
  //       // 'transfer-encoding': 'chunked',
  //       authorization: req.body.token,
  //       'content-type': 'multipart/form-data; boundary=09c32253291161daf213b1113f5c7696fe8bb02b17859d957f6cb70fbf2a',
  //       'accept-encoding': 'gzip'
  //     }
  //   });
  //   console.log(await request.json());
  // } catch(err) {
  //   console.error(err);
  //   return res.sendStatus(500);
  // }

  res.sendStatus(200);
});

app.listen(8080);