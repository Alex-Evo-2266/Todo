import { IconButton, LogoutIcon, Typography, useThemes } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import { stringToColor } from "../../../shared/helpers/stringToColor"
import { useAuth } from "alex-evo-sh-auth"

interface LogoutButtonProps{
    style?: React.CSSProperties;
}

export const LogoutButton = ({style}:LogoutButtonProps) => {
    const { t } = useTranslation()
    const { user, logout } = useAuth()
    const { colors } = useThemes()

    const letter = user?.userName?.[0]?.toUpperCase() ?? "?"
    const color = stringToColor(user?.userId ?? "")

    const nav = () => {
        window.location.href = `${window.location.origin}/auth-service/users`
    }

    return (
        <div
            style={{
                width: "calc(100% - 20px)",
                // marginInline: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "12px",
                cursor: "pointer",
                ...style
            }}
        >
            {/* Левая часть — профиль */}
            <div
                onClick={nav}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flex: 1
                }}
            >
                <div
                    className="avatar"
                    style={{
                        background: color,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600
                    }}
                >
                    {letter}
                </div>

                <Typography type="body">
                    {user?.userName || t("profile")}
                </Typography>
            </div>

            <IconButton
                onClick={logout}
                icon={<LogoutIcon primaryColor={colors.Primary_color} />}
            />
        </div>
    )
}