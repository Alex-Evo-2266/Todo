import { Button, DangerButton, Form, type FormRef } from "alex-evo-sh-ui-kit"
import { useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { useDeleteTodoMutation, useEditTodoMutation } from "../../../entites/todos/slices/todos"
import type { Todo } from "../../../entites/todos/models/todo"
import { combineToDate, formatDate, formatTime } from "../../../shared/helpers/date"
import './EditTodo.scss'

type EditDialogProps = {
    onHide: () => void
    todo: Todo
}

type EditDitailForm = {
    title: string
    description?: string
    date?: string
    time?: string
}

export const EditTodoDialog = ({onHide, todo}:EditDialogProps) => {
    const form = useRef<FormRef<EditDitailForm>>(null)
    const [request, {error, isError}] = useEditTodoMutation()
    const [requestDelete, {error: errorDelete, isError: isErrorDelete}] = useDeleteTodoMutation()
    useError({error, isError})
    const message = useError({error: errorDelete, isError: isErrorDelete})
    const {t} = useTranslation()

    const enableTime = false
    const enableDate = true

    const saveHandler = () => {
        form.current?.submit()
    }

    const deleteHandler = useCallback(() => {
        requestDelete({id: todo.id, todoListId: todo.todoListId})
    },[requestDelete, todo])

    const onFinish = useCallback(async (data: EditDitailForm) => {
        const title = data["title"]
        const description = data["description"]
        const date = data['date']
        const timeU = data['time'] 
        const time = typeof(timeU) === "string"? timeU: undefined
        let dataTime: string | undefined = undefined
        function isValidDatePart(date?: string) {
            return date && !date.includes("NaN")
        }

        function isValidTimePart(time?: string) {
            return time && !time.includes("NaN")
        }

        const hasValidDate = isValidDatePart(date)
        const hasValidTime = isValidTimePart(time)

        if (hasValidDate || hasValidTime) {
            try {
                const combined = hasValidDate && date ? combineToDate(
                    date,
                    hasValidTime ? time : undefined
                ): undefined

                const iso = combined?.toISOString()

                if (iso && !isNaN(new Date(iso).getTime())) {
                dataTime = iso
                }
            } catch {
                dataTime = undefined
            }
        }
        console.log(timeU, date, dataTime)
        if(typeof(title) === "string" && title !== "")
        {
            await request({ 
                id: todo.id, 
                todoListId: todo.todoListId, 
                title: title, 
                description: String(description), 
                contVersion: todo.contVersion,
                date: dataTime
            })
            onHide()
        }
        else
            message(t("invalid data"))
    },[message, request, onHide, todo])

    const value:EditDitailForm = {
        title: todo.title, 
        description: todo.description, 
        date: formatDate(new Date(todo.date)),
        time: formatTime(new Date(todo.date))
    }


    return(
        <>
            <Form<EditDitailForm> ref={form} onFinish={onFinish} value={value}>
                <Form.TextInput placeholder={t("title")} border name="title"/>
                <Form.TextArea placeholder={t("description")} border name="description" rows={15}/>
                <div className="flex-field">
                    <Form.DateField disabled={!enableDate} className="flex-field__field" container={document.getElementById("modal")} placeholder={t("finaly_date")} border name="date"/>
                    {enableTime && <Form.TimeField className="flex-field__field" container={document.getElementById("modal")} placeholder={t("finaly_time")} border name="time"/>}
                </div>
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