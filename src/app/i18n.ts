import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { resources } from './locales'


i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ko: { translation: resources.ko },
            en: { translation: resources.en },
            ja: { translation: resources.ja }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['path', 'navigator']
        }
    })

export default i18n
