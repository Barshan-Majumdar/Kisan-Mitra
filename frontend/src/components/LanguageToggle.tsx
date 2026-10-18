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
            className="flex items-center gap-1 sm:gap-1.5 px-2 min-[380px]:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#F5F5F0] hover:bg-[#EBEBE3] border border-stone-200/80 text-stone-700 hover:text-stone-900 transition-all text-[11px] sm:text-xs font-semibold tracking-wide active:scale-95 shadow-xs shrink-0"
        >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
            <span className="hidden min-[380px]:inline">{i18n.language === 'en' ? 'বাংলা' : 'English'}</span>
            <span className="inline min-[380px]:hidden">{i18n.language === 'en' ? 'বাং' : 'EN'}</span>
        </button>
    );
};
