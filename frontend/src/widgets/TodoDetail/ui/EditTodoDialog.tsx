import { Button, DangerButton, Form, type FormRef } from "alex-evo-sh-ui-kit"
import { useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { useDeleteTodoMutation, useEditTodoMutation } from "../../../entites/todos/slices/todos"
import type { Todo } from "../../../entites/todos/models/todo"

type EditDialogProps = {
    onHide: () => void
    todo: Todo
}

export const EditTodoDialog = ({onHide, todo}:EditDialogProps) => {
    const form = useRef<FormRef>(null)
    const [request, {error, isError}] = useEditTodoMutation()
    const [requestDelete, {error: errorDelete, isError: isErrorDelete}] = useDeleteTodoMutation()
    useError({error, isError})
    const message = useError({error: errorDelete, isError: isErrorDelete})
    const {t} = useTranslation()

    const saveHandler = () => {
        form.current?.submit()
    }

    const deleteHandler = useCallback(() => {
        requestDelete({id: todo.id, todoListId: todo.todoListId})
    },[requestDelete, todo])

    const onFinish = useCallback(async (data: Record<string, unknown>) => {
        const title = data["title"]
        const description = data["description"]
        const date = data['date']
        if(typeof(title) === "string" && title !== "")
        {
            await request({ 
                id: todo.id, 
                todoListId: todo.todoListId, 
                title: title, 
                description: String(description), 
                contVersion: todo.contVersion,
                date: date? new Date(String(date)).toISOString(): undefined
            })
            onHide()
        }
        else
            message(t("invalid data"))
    },[message, request, onHide, todo])


    return(
        <>
            <Form ref={form} onFinish={onFinish} value={{title: todo.title, description: todo.description, date: todo.date !== "" ? new Date(todo.date).toLocaleDateString("sv-SE"):undefined}}>
                <Form.TextInput placeholder={t("title")} border name="title"/>
                <Form.TextArea placeholder={t("description")} border name="description" rows={15}/>
                <Form.DateField container={document.getElementById("modal")} placeholder={t("finaly_date")} border name="date"/>
            </Form>
            <div style={{display: 'flex', gap: "10px", justifyContent: "end"}}>
                <DangerButton 
                    style={{backgroundColor: "var(--Error-color)", color: "var(--On-error-color)"}}
                    header={t("confirm_delete_header")} 
                    text={t("confirm_delete_text")} 
                    styleType="filled" 
                    onClick={deleteHandler}
                >{t("delete")}</DangerButton>
                <Button onClick={saveHandler}>{t("save")}</Button>
            </div>
        </>
            
    )
}