const kakaoUser = {
  name: '테스트1',
  password: 'testpassword!',
  email: 'test1@kakao.com',
  phone: '010-1234-1234',
  address: '테헤란로427',
  birth: '1998-01-01',
  gender: 'M',
};

const naverUser = {
  name: '테스트2',
  password: 'testpassword!',
  email: 'test2@kakao.com',
  phone: '010-1234-1234',
  address: '테헤란로427',
  birth: '1998-01-02',
  gender: 'F',
};

const defaltProductListEnum = Object.freeze({
  DEFAULT_LIMIT: 15,
  DEFAULT_OFFSET: 0,
});

module.exports = { kakaoUser, naverUser };
