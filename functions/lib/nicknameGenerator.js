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
  const { first } = name;
  const { last } = name;

  shuffle(first);
  shuffle(last);

  return `${randNickname(first)} ${randNickname(last)}`;
};

module.exports = generateNickname;
