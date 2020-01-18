export default {
  formatMoney(money, sign) {
    const n = 0;
    const re = `\\d(?=(\\d{3})+${n > 0 ? '\\.' : '$'})`;
    return (sign || '') + money.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  },
  reformatMoney: (money) => money.replace(/(\$|,|\.\d{2}|\s)/g, ''),
  isNumeric: (number) => !isNaN(parseFloat(number)) && isFinite(number),
};
