import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const enTranslation = require('./src/locals/en.json');
const frTranslation = require('./src/locals/fr.json');
const deTranslation = require('./src/locals/de.json');
const esTranslation = require('./src/locals/es.json');
const ptTranslation = require('./src/locals/pt.json');
const itTranslation = require('./src/locals/it.json');
const csTranslation = require('./src/locals/cs.json');

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  compatibilityJSON: 'v3',
  resources: {
    en: {translation: enTranslation},
    fr: {translation: frTranslation},
    de: {translation: deTranslation},
    es: {translation: esTranslation},
    pt: {translation: ptTranslation},
    it: {translation: itTranslation},
    cs: {translation: csTranslation},
  },
  interpolation: {
    escapeValue: false,
  },
});
