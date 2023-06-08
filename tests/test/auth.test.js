const jwt = require('jsonwebtoken');
const userService = require('../../src/services/userService');

// jwt.verify 모킹
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ id: 'user_id' }), // 모킹된 decoded 객체를 반환
}));

// userService.getUserById 모킹
jest.mock('../../src/services/userService', () => ({
  getUserById: jest.fn().mockResolvedValue({ id: 'user_id', names: 'User' }), // 모킹된 user 객체를 반환
}));

const { loginRequired } = require('../../src/middlewares/auth');

describe('authMiddleware', () => {
  test('should pass authentication and set req.user if valid token and user exists', async () => {
    const req = {
      headers: {
        authorization: 'valid_access_token',
      },
    };
    const res = {};
    const next = jest.fn();

    await loginRequired(req, res, next);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(userService.getUserById).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: 'user_id', names: 'User' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  //   test('should return 401 error if token is missing', async () => {
  //     const req = {
  //       headers: {},
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  //     const next = jest.fn();

  //     await loginRequired(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'NEED_ACCESS_TOKEN' });
  //     expect(jwt.verify).not.toHaveBeenCalled();
  //     expect(userService.getUserById).not.toHaveBeenCalled();
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   test('should return 404 error if user does not exist', async () => {
  //     const req = {
  //       headers: {
  //         authorization: 'valid_access_token',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  //     const next = jest.fn();

  //     userService.getUserById.mockResolvedValue(null); // 모킹된 getUserById가 null 반환

  //     await loginRequired(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'USER_DOES_NOT_EXIST' });
  //     expect(jwt.verify).toHaveBeenCalledTimes(1);
  //     expect(userService.getUserById).toHaveBeenCalledTimes(1);
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   test('should return 500 error if an error occurs', async () => {
  //     const req = {
  //       headers: {
  //         authorization: 'valid_access_token',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };
  //     const next = jest.fn();

  //     jwt.verify.mockImplementation(() => {
  //       throw new Error('Token verification error');
  //     });

  //     await loginRequired(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  //     expect(jwt.verify).toHaveBeenCalledTimes(1);
  //     expect(userService.getUserById).not.toHaveBeenCalled();
  //     expect(next).not.toHaveBeenCalled();
  //   });
});
