import { FullScreenTemplateDialog, Tabs } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import { EditTodoDialog } from "./EditTodoDialog"
import { CommentTodoDialog } from "./CommentsDialog"
import { useGetTodoWithCommentsQuery } from "../../../entites/todos/slices/todos"
import { Loader } from "../../../shared"

type TodoDetailProps = {
    id: string
    onHide: ()=>void
}

export const TodoDetail = ({id, onHide}:TodoDetailProps) => {
    const {t} = useTranslation()
    const {data, isLoading} = useGetTodoWithCommentsQuery(id ?? "")

    return(
        <FullScreenTemplateDialog header={data?.title ?? ""} onHide={onHide} btns={[]}>
            {
                (isLoading || !data)?
                <Loader/>:
                <Tabs tabs={[
                    {label: t("edit_tab"), content: <EditTodoDialog onHide={onHide} todo={data}/>},
                    {label: t("comment_tab"), content: <CommentTodoDialog todo={data}/>}
                ]}/>
            }
        </FullScreenTemplateDialog>
    )
}