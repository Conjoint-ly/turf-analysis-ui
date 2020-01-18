const validationPromisesReducer = (promises) => Promise.all(promises).then((values) => values.reduce((a, v) => a && v, true));

const withError = (dispatch) => (action, payload, errorPayload) => dispatch(action, payload)
  .then((value) => (value === true ? Promise.resolve(value) : Promise.reject(value === false ? {} : value)))
  .catch((errorValue) => Promise.reject(Object.assign(errorValue, errorPayload)));

export { validationPromisesReducer, withError };
