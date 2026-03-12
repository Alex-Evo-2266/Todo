import { Form, FullScreenTemplateDialog, type FormRef } from "alex-evo-sh-ui-kit"
import { useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { useDeleteTodoMutation, useEditTodoMutation } from "../../../entites/todos/slices/todos"
import type { Todo } from "../../../entites/todos/models/todo"

type EditDialogProps = {
    open: boolean
    onHide: () => void
    todo: Todo
}

export const EditTodoDialog = ({open, onHide, todo}:EditDialogProps) => {
    const form = useRef<FormRef>(null)
    const [request, {error, isError}] = useEditTodoMutation()
    const [requestDelete, {error: errorDelete, isError: isErrorDelete}] = useDeleteTodoMutation()
    useError({error, isError})
    const message = useError({error: errorDelete, isError: isErrorDelete})
    const {t} = useTranslation()

    const saveHandler = () => {
        form.current?.submit()
    }

    const deleteHandler = () => {
        requestDelete({id: todo.id, todoListId: todo.todoListId})
    }

    const onFinish = useCallback(async (data: Record<string, unknown>) => {
        const title = data["title"]
        const description = data["description"]
        if(typeof(title) === "string" && title !== "")
        {
            await request({ id: todo.id, todoListId: todo.todoListId, title: title, description: String(description), contVersion: todo.contVersion })
            onHide()
        }
        else
            message(t("invalid data"))
    },[message, request, onHide])

    if(!open)
        return null
    return(
        <FullScreenTemplateDialog btns={[
            {
                text: t("delete"),
                danger: true,
                onClick: deleteHandler
            },
            {
                text:t("save"),
                save: true
            },
            {
                text: t("cancel"),
                hide: true
            }            
        ]} header={t("edit_task")} onHide={onHide} onSave={saveHandler}>
            <Form ref={form} onFinish={onFinish} value={{title: todo.title, description: todo.description}}>
                <Form.TextInput placeholder={t("title")} border name="title"/>
                <Form.TextArea placeholder={t("description")} border name="description" rows={15}/>
            </Form>
        </FullScreenTemplateDialog>
    )
}