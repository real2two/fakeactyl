import cors from "cors";
import express from "express";
import fetch from "node-fetch";

const app = new express();

app.use(express.text());

app.use(cors());

const wingsURL = "http://192.168.228.128";
// const fakeServerUUID = "310fc7c4-f719-4cce-8772-18f48a19457b";

app.use(async (req, res, next) => {
  console.log("==============");
  console.log(`${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  try {
    console.log("Body:", req.body, JSON.parse(req.body));
  } catch(err) {
    console.log("Body:", req.body);
  }
  
  // if (req.originalUrl.startsWith("/api/remote/servers/")) {
  //   return next();
  // }

  const text = await (
    await fetch(`${wingsURL}/${req.originalUrl}`, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body
    })
  ).text();

  try {
    const json = JSON.parse(text);
    console.log("Response:", json);
    return res.json(json);
  } catch(err) {
    console.log("Response:", text);
    return res.send(text);
  }

  // next();
});

// app.get("/api/remote/servers/:uuid", async (req, res) => {
//   const text = await (
//     await fetch(`${wingsURL}/api/remote/servers/${fakeServerUUID}`, {
//       method: req.method,
//       headers: req.headers,
//       body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body
//     })
//   ).text();

//   const json = JSON.parse(text);
//   console.log("Response:", json);
//   return res.json(json);
// });

app.listen(80);