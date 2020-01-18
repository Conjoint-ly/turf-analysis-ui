import get from 'lodash/get';

export default function (payload) {
  return {
    methods: {
      validate() {
        return new Promise((resolve) => {
          this.$validate().then((result) => {
            resolve({
              payload: get(this, payload),
              result,
            });
          });
        });
      },
    },
  };
}
