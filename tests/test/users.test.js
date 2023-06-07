const request = require('supertest');
const userFixture = require('../fixtures/user.fixtures');
const { createApp } = require('../../app');
const dataSource = require('../../src/models/appDataSource');
const userdata = require('../fixtures/user.data');

describe('Sign up/', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();
    await userFixture.createUser([userdata.kakaoUser, userdata.naverUser]);
  });

  test('🤬SUCCESS: created user', async () => {
    const response = await request(app).post('/users/signup').send({
      name: '테스트',
      password: 'testpassword!',
      email: 'test3@kakao.com',
      phone: '010-1234-1234',
      address: '테헤란로427',
      birth: '1998-01-03',
      gender: 'M',
    });

    expect(response.body).toEqual({ message: 'SIGNUP_SUCCESS' });
    expect(response.statusCode).toEqual(201);
  });

  test('FAILED: invalid email', async () => {
    const response = await request(app).post('/users/signup').send({
      name: '테스트',
      password: 'testpassword!',
      email: '',
      phone: '010-1234-1234',
      address: '테헤란로427',
      birth: '1998-01-04',
      gender: 'F',
    });

    expect(response.body).toEqual({ message: 'KEY_ERROR' });
    expect(response.statusCode).toEqual(400);
  });
  test('FAILED: duplication email', async () => {
    const response = await request(app).post('/users/signup').send({
      name: '테스트',
      password: 'testpassword!',
      email: 'test3@kakao.com',
      phone: '010-1234-1234',
      address: '테헤란로427',
      birth: '1998-01-04',
      gender: 'fuck',
    });

    expect(response.body).toEqual({ message: 'INVALID_DATA_INPUT' });
    expect(response.statusCode).toEqual(500);
  });

  afterAll(async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS=0');
    await dataSource.query(`TRUNCATE users`);
    await dataSource.query(`ALTER TABLE users AUTO_INCREMENT = 1`);
    await dataSource.query('SET FOREIGN_KEY_CHECKS=1');

    await dataSource.destroy();
  });
});

describe('Sign In/', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();
    await userFixture.createUser([userdata.kakaoUser, userdata.naverUser]);
  });

  test('🤬SUCCESS: signin user', async () => {
    const response = await request(app).post('/users/signin').send({
      password: 'testpassword!',
      email: 'test1@kakao.com',
    });

    expect(response.body.names).toEqual('테스트1');
    expect(response.body.accesstoken).toBeTruthy();
    //jwt token확인 또다른 방법 찾기
    expect(response.statusCode).toEqual(200);
  });

  test('FAILED: NOT_AVILABE_USER', async () => {
    const response = await request(app).post('/users/signin').send({
      password: 'testpassword!',
      email: 'test4@kakao.com',
    });

    expect(response.body).toEqual({ message: 'NOT_AVAILABLE_USER' });
    expect(response.statusCode).toEqual(401);
  });

  test('FAILED: PASSWORD FAIL', async () => {
    const response = await request(app).post('/users/signin').send({
      password: 'testpassw',
      email: 'test1@kakao.com',
    });

    expect(response.body).toEqual({ message: 'PASSWORD_NOT_MATCH' });
    expect(response.statusCode).toEqual(401);
  });

  test('FAILED: KEY_ERROR', async () => {
    const response = await request(app).post('/users/signin').send({
      password: '',
      email: '',
    });
    expect(response.body).toEqual({ message: 'KEY_ERROR' });
    expect(response.statusCode).toEqual(400);
  });
  afterAll(async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS=0');
    await dataSource.query(`TRUNCATE users`);
    await dataSource.query(`ALTER TABLE users AUTO_INCREMENT = 1`);
    await dataSource.query('SET FOREIGN_KEY_CHECKS=1');

    await dataSource.destroy();
  });
});
