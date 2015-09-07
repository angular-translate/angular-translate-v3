import TranslationsEntry from './TranslationsEntry';

export default class UniformTranslationsReader {

  constructor() {
  }

  uniform(language, data = {}, options = {}) {
    return new TranslationsEntry(language)
      .withTranslations(data)
      .withOptions(options);
  }

}
