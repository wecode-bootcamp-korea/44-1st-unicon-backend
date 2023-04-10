const express = require('express');

require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const appDataSource = require('./models/appDataSource');
const routes = require('./routes');

const app = express();

const { errorHandler } = require('./middlewares/error');

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());


appDataSource
.initialize()
.then(() => {
  console.log("Data Source has been initialized!");
})
.catch((err) => {
  console.error("Error during Data Source initialization", err);
  appDataSource.destroy();
}); 


app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });

});

app.use(routes);
app.use(errorHandler);

const PORT = process.env.PORT;

const start = () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();




