const fn = require('./fn');

/* Macher : tobe(숫자나 문자 기본타입값 비교시 사용) */
test("1 = 1", () => {
  expect(1).toBe(1); //1일때 기대값1
});

test("2 + 3 = 5", () => {
  expect(fn.add(2,3)).toBe(5); //add(2,3)일때 기대값5 (성공)
});

test("3 + 3 = 5", () => {
  expect(fn.add(3,3)).toBe(5); //add(3,3)일때 기대값5 (실패)
});

test("3 + 3 /= 5", () => {
  expect(fn.add(3,3)).not.toBe(5); //add(3,3)일때 기대값5 아님 (성공)
});