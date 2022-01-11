/**
 * @닉네임_생성
 * @desc 리스트 셔플 후, 형용사와 명사를 뽑아 닉네임을 생성합니다.
 */
const shuffle = (name) => {
  for (let index = name.length - 1; index > 0; index--) {
    const rand = Math.floor(Math.random() * (index + 1));
    const temp = name[index];
    name[index] = name[rand];
    name[rand] = temp;
  }
};

const randNickname = (name) => {
  return name[Math.floor(Math.random() * name.length)];
};

const generateNickname = (name) => {
  const {first} = name;
  const {last} = name;

  shuffle(first);
  shuffle(last);

  return `${randNickname(first)  } ${  randNickname(last)}`;
};

module.exports = generateNickname;
