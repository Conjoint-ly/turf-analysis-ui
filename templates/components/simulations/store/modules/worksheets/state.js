export default {
    attributes: [],
    worksheets: [],
    savedWorksheets: [],
    currentWorksheetIndex: 0,
    currentScenarioIndexes: [],
    defaultCurrentScenarioIndex: 0,
    hashes: [],
    worksheetsHasRevenue: [],
    worksheetsElasticityChart: [],
    worksheetsElasticityChartVariableConcept: [],
    applyHideFlag: false,
    saved: true,
    btpoAfterAdceptASeqNum: 3,
    currentRevenueIds: {},
    default: {
        title: "New revenue calculation",
        xAxisTitle: "Revenue projections (assuming 1,000 units offered)",
        defaultFormula: "share * price * 1000",
        formulas: {}
    },
    applicability: [],
    // todo флаг получения applicability из version 1 table.
    isVersion1: false
}
