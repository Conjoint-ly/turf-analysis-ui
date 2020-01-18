export default {
  entriesByAQseqNum: (a, b) => a[1].AQseqNum - b[1].AQseqNum,
  byAQseqNum: (a, b) => a.AQseqNum - b.AQseqNum,
  byIseqNum: (a, b) => a.IseqNum - b.IseqNum,
  byTypeDesc: (a, b) => {
    if (a.type > b.type) return -1;
    if (a.type < b.type) return 1;

    return 0;
  },
};
