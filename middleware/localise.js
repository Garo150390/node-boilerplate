const nconf = require('../config');
const en = require('../translation/en');
const am = require('../translation/am');
const ru = require('../translation/ru');

const defaultLang = nconf.get('default_lang');
const languages = ['en', 'am', 'ru'];

const LANGMAP = { en, am, ru };

exports.localise = async (req, res, next) => {
  let lang = req.get('lang');

  lang = req.baseUrl ? req.baseUrl.replace('/', '') : (languages.includes(lang) && lang) || defaultLang;

  req.lang = lang;

  res.locals.translate = LANGMAP[lang];
  next();
};

exports.getUserTranslate = lang => LANGMAP[lang] || LANGMAP[defaultLang];
