const checkDebtForMe = (msg) => {
  if (msg.text.toLowerCase().match('сколько мне должен')) return true;
  return false;
};

export default checkDebtForMe;
