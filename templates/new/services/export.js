export default {
  exportGGraphAsPicture(chart, filename) {
    if (typeof chart !== 'undefined') {
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(window.dataURItoBlob(chart.getImageURI()), filename);
      } else {
        const link = document.createElement('a');
        link.href = chart.getImageURI();
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  },
};
