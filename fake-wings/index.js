import cors from "cors";
import express from "express";

const app = new express();

app.use(express.json({
  inflate: true,
  limit: '500kb',
  reviver: null,
  strict: true,
  type: 'application/json',
  verify: undefined
}));

app.use(cors());

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

app.post('/api/servers', (req, res) => {
  res.json({});
});

app.listen(8080);