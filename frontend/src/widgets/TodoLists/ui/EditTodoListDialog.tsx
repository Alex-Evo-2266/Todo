
import { TextDialog } from "alex-evo-sh-ui-kit"
import type { TodoList } from "../../../entites/todos/models/todo"
import { useUpdateTodoListMutation } from "../../../entites/todos/slices/todos"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

type EditDialogProps = {
    open: boolean
    hide: () => void
    data: TodoList
}

export const EditTodoListDialog = ({open, hide, data}:EditDialogProps) => {

    const [request] = useUpdateTodoListMutation()
    const {t} = useTranslation()

    const handler = useCallback(async (newTitle: string) => {
        request({id: data.id, title: newTitle})
    },[request, data])

    if(!open)
        return null

    return(
        <TextDialog
            header={t("edit_board-head")}
            text={t("edit_board-text")}
            defaultValue={data.title}
            onSuccess={handler}
            onHide={hide}
        />
    )
}