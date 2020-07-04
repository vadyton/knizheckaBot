const checkDebtForSomeone = (msg) => {
  if (msg.text.toLowerCase().match('сколько я должен')) return true;
  return false;
};

export default checkDebtForSomeone;

