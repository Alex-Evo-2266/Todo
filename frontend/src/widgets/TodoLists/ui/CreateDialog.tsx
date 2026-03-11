import { TextDialog } from "alex-evo-sh-ui-kit"
import { useCreateTodoListMutation } from "../../../entites/todos/slices/todos"
import { useTranslation } from "react-i18next"

type CreateDialogProps = {
    open: boolean
    hide: () => void
}

export const CreateDialog = ({open, hide}:CreateDialogProps) => {
    const [request] = useCreateTodoListMutation()
    const {t} = useTranslation()

    if(!open)
        return null

    return(
        <TextDialog
            header={t("create_todo_list_title")} 
            text={t("create_todo_list_text")}
            onSuccess={data=>request({title: data})}
            onHide={hide}
        />
    )
}