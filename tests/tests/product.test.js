const request = require('supertest');
const { createApp } = require('../../app');
const dataSource = require('../../API/models/appDataSource');

describe('Product list/detail', () => {
  let app;
  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();
  });
});
