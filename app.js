const express = require('express');

require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(routes);

const { errorHandler } = require('./middlewares/error');

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });

});

const PORT = process.env.PORT;

const start = () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();




