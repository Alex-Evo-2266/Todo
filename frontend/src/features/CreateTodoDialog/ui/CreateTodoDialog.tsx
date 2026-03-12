import { Form, type FormRef, FullScreenTemplateDialog } from "alex-evo-sh-ui-kit"
import { useCreateTodoMutation } from "../../../entites/todos/slices/todos"
import { useTranslation } from "react-i18next"
import { useCallback, useRef } from "react"
import { useError } from "../../../shared/hooks/errorMessage.hook"

type CreateDialogProps = {
    open: boolean
    onHide: () => void
    listId: string
}

export const CreateTodoDialog = ({open, onHide, listId}:CreateDialogProps) => {
    const form = useRef<FormRef>(null)
    const [request, {error, isError}] = useCreateTodoMutation()
    const message = useError({error, isError})
    const {t} = useTranslation()

    const saveHandler = () => {
        form.current?.submit()
    }

    const onFinish = useCallback(async (data: Record<string, unknown>) => {
        console.log(data)
        const title = data["title"]
        const description = data["description"]
        if(typeof(title) === "string" && title !== "")
        {
            await request({ todoListId: listId, title: title, description: description? String(description): undefined })
            onHide()
        }
        else
            message(t("invalid data"))
    },[message, request, onHide])

    if(!open)
        return null

    return(
        <FullScreenTemplateDialog header={t("create_task")} saveText={t("save")} cancelText={t("cancel")} onHide={onHide} onSave={saveHandler}>
            <Form ref={form} onFinish={onFinish}>
                <Form.TextInput placeholder={t("title")} border name="title"/>
                <Form.TextArea placeholder={t("description")} border name="description" rows={15}/>
            </Form>
        </FullScreenTemplateDialog>
    )
}