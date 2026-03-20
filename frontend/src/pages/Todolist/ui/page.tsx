import { useParams } from "react-router-dom"
import "./TodoList.scss"
import { CreateTodoDialog } from "../../../features/CreateTodoDialog"
import { TodoDetail } from "../../../widgets/TodoDetail"
import { TodoList } from "./TodoList"
import { useCallback, useState } from "react"


export const TodoListPage = () => {

    const {id} = useParams()

    const [isOpenCreateTodoDialog, setOpenCreateTodoDialog] = useState(false)
    const [detailTodoDialog, setDetailTodoDialog] = useState<string | null>(null)

    const openCreateDialog = useCallback(()=>{
      setOpenCreateTodoDialog(true)
    },[])

    const openDetailDialog = useCallback((id:string)=>{
      setDetailTodoDialog(id)
    },[])

    if(!id)
        return null

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "5px", height: "100%"}}>
            <TodoList onCreate={openCreateDialog} onEdit={openDetailDialog}/>
            <CreateTodoDialog listId={id} open={isOpenCreateTodoDialog} onHide={()=>setOpenCreateTodoDialog(false)}/>
              {
                detailTodoDialog && <TodoDetail id={detailTodoDialog} onHide={()=>setDetailTodoDialog(null)}/>
              }
        </div>
    )
}