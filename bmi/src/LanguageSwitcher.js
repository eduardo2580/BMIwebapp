import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
        English
      </button>
      <button onClick={() => changeLanguage('es')} disabled={i18n.language === 'es'}>
        Español
      </button>
      <button onClick={() => changeLanguage('pt')} disabled={i18n.language === 'pt'}>
        Português
      </button>
    </div>
  );
};

export default LanguageSwitcher;
