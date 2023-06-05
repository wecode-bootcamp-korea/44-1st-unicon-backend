const { createApp } = require('./app');
const appDataSource = require('./src/models/appDataSource');

const startServer = async () => {
  const app = createApp();

  await appDataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
      appDataSource.destroy();
    });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Listening to request on port ${PORT}`);
  });
};

startServer();
