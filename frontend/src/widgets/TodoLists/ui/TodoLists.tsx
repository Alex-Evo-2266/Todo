import { FilledButton, ListContainer, Panel } from "alex-evo-sh-ui-kit"

import './TodoLists.scss'
import { useState } from "react"
import { CreateDialog } from "./CreateDialog"
import { useGetTodoListsQuery } from "../../../entites/todos/slices/todos"
import { useParams } from "react-router-dom"
import { TodoListCard } from "./TodoListCard"

export const TodoLists = () => {

    const [visibleCreateDialog, setVisibleCreateDialog] = useState(false)
    const {data} = useGetTodoListsQuery()
    const {id} = useParams()

    return (
        <Panel className="todolists-panel">
            <FilledButton style={{width: "100%"}} onClick={()=>setVisibleCreateDialog(true)}>create</FilledButton>
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