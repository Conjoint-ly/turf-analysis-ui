import $ from 'jquery';

export default {
  segregate(experimentId, scenario, csrfToken) {
    const data = { ...scenario, csrf_token: csrfToken };
    return new Promise((resolve, reject) => {
      $.post(`/reports/${experimentId}/run-segregate/`, data).done((data) => {
        resolve(data);
      }).fail((jHR) => {
        reject(jHR.responseText);
      });
    });
  },
};
