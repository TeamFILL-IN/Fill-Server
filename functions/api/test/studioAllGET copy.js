const { studioOneGET } = require('./studioOneGET');

  describe('studioOneGET', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn()
    };
    const next = jest.fn();

    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
      const req = {
          isAuthenticated: jest.fn(() => true),
      };
      isLoggedIn(req, res, next);
      expect(next).toBeCalledTimes(1);
  });
};
