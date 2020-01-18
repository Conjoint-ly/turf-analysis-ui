export default {
  single: (item) => item.isAmongConjointQuestions != true && item.RQseqNum === null,
  conjoint: (item) => item.isAmongConjointQuestions == true,
  notConjoint: (item) => item.isAmongConjointQuestions == false,
  randomisation: (item) => item.RQseqNum != null,
  randomisationByAQ(item) {
    return item.RQseqNum == this;
  },
  byParent(item) {
    return item.parent == this;
  },
  byAQ(item) {
    return item.AQseqNum == this;
  },
};
