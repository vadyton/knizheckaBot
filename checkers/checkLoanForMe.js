const checkLoanForMe = (msg) => {
  if (msg.text.toLowerCase().match('мне занял')) {
    return true;
  }
  return false;
};

export default checkLoanForMe;
