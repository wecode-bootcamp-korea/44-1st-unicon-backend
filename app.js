const express = require('express');

require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const appDataSource = require('./models/appDataSource');
const routes = require('./routes');

const app = express();

const { errorHandler } = require('./middlewares/error');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

appDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.log('Error occurred during Data Source initialization', err);
    appDataSource.destroy();
  });

app.use(routes);
app.use(errorHandler);

const PORT = process.env.PORT;

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const start = async () => {
  try {
    app.listen(3000, () => console.log(`Server is listening on 3000`));
  } catch (err) {
    console.log(err);
  }
};
start();
