import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'bn' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors text-sm font-medium"
        >
            {i18n.language === 'en' ? 'বাংলা' : 'English'}
        </button>
    );
};
