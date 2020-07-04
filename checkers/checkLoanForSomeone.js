const checkLoanForSomeone = (msg) => {
  if (msg.text.toLowerCase().match('я занял')) {
    return true;
  }
  return false;
};

export default checkLoanForSomeone;
