import { TextDialog } from "alex-evo-sh-ui-kit"
import { useCreateTodoListMutation } from "../../../entites/todos/slices/todos"

type CreateDialogProps = {
    open: boolean
    hide: () => void
}

export const CreateDialog = ({open, hide}:CreateDialogProps) => {
    const [request] = useCreateTodoListMutation()

    if(!open)
        return null

    return(
        <TextDialog
            header="Создать список задач" 
            text="Введите название списка задачьы" 
            onSuccess={data=>request({title: data})}
            onHide={hide}
        />
    )
}