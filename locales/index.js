const { readFileSync } = require('fs');
//

class locale {
  
  constructor () {
    this.locales = ["en", "ar"];
    this.defaultLocale = this.locales[0];
    this.directory = __dirname + '/';
    this.currentLang = 'en';
  }
  
  setLang (lang) {
    this.currentLang = (this.locales.includes(lang.trim().toLowerCase())) ? lang.trim().toLowerCase() : this.defaultLocale;
  }

  getLang () {
    return this.currentLang;
  }
  
  get (key) {
    const localeFile = require(`${this.directory}/replys`);
    return localeFile[key];
  }
  
}

module.exports = new locale;
