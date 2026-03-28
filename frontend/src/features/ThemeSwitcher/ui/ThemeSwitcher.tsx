import { useEffect } from "react"
import { useThemes } from "alex-evo-sh-ui-kit"
import { SelectField } from "../../../shared/ui/SelectField"

export const ThemeSwitcher = () => {
    const { setActiveTheme, themes, activeTheme } = useThemes()

    useEffect(() => {
        const storedTheme = localStorage.getItem("activeTheme")
        if (storedTheme && themes[storedTheme]) {
            setActiveTheme(storedTheme)
        }
    }, [themes, setActiveTheme])

    const handleChange = (theme: string) => {
        setActiveTheme(theme)
        localStorage.setItem("activeTheme", theme)
    }

    return (
        <SelectField
            value={activeTheme}
            onChange={handleChange}
            items={Object.keys(themes).map(t => ({ title: t, value: t }))}
            style={{ width: 120 }}
        />
    )
}