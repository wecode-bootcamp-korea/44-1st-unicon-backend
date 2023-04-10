const express = require('express');

require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');

const app = express();

const { errorHandler } = require('./middlewares/error');
const appDataSource = require('./models/appDataSource');

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(routes);
app.use(errorHandler);

appDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.log('Error occurred during Data Source initialization', err);
    appDataSource.destroy();
  });

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const PORT = process.env.PORT;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
