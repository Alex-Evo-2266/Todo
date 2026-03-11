import { FilledButton, ListContainer, Panel } from "alex-evo-sh-ui-kit"

import './TodoLists.scss'
import { useState } from "react"
import { CreateDialog } from "./CreateDialog"
import { useGetTodoListsQuery } from "../../../entites/todos/slices/todos"
import { useParams } from "react-router-dom"
import { TodoListCard } from "./TodoListCard"
import { useTranslation } from "react-i18next"

export const TodoLists = () => {

    const [visibleCreateDialog, setVisibleCreateDialog] = useState(false)
    const {data} = useGetTodoListsQuery()
    const {id} = useParams()
    const {t} = useTranslation()

    return (
        <Panel className="todolists-panel">
            <FilledButton style={{width: "100%"}} onClick={()=>setVisibleCreateDialog(true)}>{t("create")}</FilledButton>
            <ListContainer transparent>
            {
                data?.map((item)=>(
                    <TodoListCard item={item} key={item.id} active={item.id === id}/>
                ))
            }
            </ListContainer>
            <CreateDialog 
                open={visibleCreateDialog}
                hide={()=>setVisibleCreateDialog(false)}
            />
        </Panel>
    )
}