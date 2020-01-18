import get from 'lodash/get';

const module = {
  namespaced: true,
  actions: {
    /**
         * Функция валидации до первого правила, не прошедшего проверку
         *
         * @param undefined
         * @param {object} payload - объект для валидации:
         * validators - массив правил валидации в формате simpleVueValidator
         * bind - контекст this как в компоненте
         *
         * @returns {boolean} завершается false на первом правиле, которое не прошло проверку
         */
    some(undefined, payload) {
      const { validators, bind } = payload;
      return !Object.entries(validators).some(([key, validator]) => {
        const validated = validator.call(bind, value(bind, key));
        return validated && validated.hasImmediateError();
      });
    },
  },
};

/**
 * Вспомогательная функция для входного параметра value функции валидатора
 *  *
 * @param {*} bind - контекст this как в компоненте
 * @param {*} key - проверяемое поле
 */
const value = (bind, key) => get(bind, key);

export default {
  name: 'vuex-validator',

  install(Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.');
    }

    options.store.modules.validate = module;
  },
};
