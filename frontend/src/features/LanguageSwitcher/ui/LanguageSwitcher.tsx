import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { SelectField } from "../../../shared/ui/SelectField"

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation()
    const [lang, setLang] = useState(i18n.language)

    useEffect(() => {
        const storedLang = localStorage.getItem("language")
        if (storedLang) {
            i18n.changeLanguage(storedLang)
            setLang(storedLang)
        }
    }, [i18n])

    const handleChange = (value: string) => {
        i18n.changeLanguage(value)
        setLang(value)
        localStorage.setItem("language", value)
    }

    const languages = [
        { title: "EN", value: "en" },
        { title: "RU", value: "ru" },
    ]

    return <SelectField value={lang} onChange={handleChange} items={languages} style={{ width: 80 }} />
}