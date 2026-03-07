
import { TextDialog } from "alex-evo-sh-ui-kit"
import type { TodoList } from "../../../entites/todos/models/todo"
import { useUpdateTodoListMutation } from "../../../entites/todos/slices/todos"
import { useCallback } from "react"

type EditDialogProps = {
    open: boolean
    hide: () => void
    data: TodoList
}

export const EditTodoListDialog = ({open, hide, data}:EditDialogProps) => {

    const [request] = useUpdateTodoListMutation()

    const handler = useCallback(async (newTitle: string) => {
        request({id: data.id, title: newTitle})
    },[request, data])

    if(!open)
        return null

    return(
        <TextDialog
            header="Изменить название списка задач" 
            text="Введите название списка задачьы" 
            defaultValue={data.title}
            onSuccess={handler}
            onHide={hide}
        />
    )
}