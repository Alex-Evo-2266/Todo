import { BaseDialog, IconButton, ListItem, MoreVertical } from "alex-evo-sh-ui-kit"
import type { TodoList } from "../../../entites/todos/models/todo"
import { useNavigate } from "react-router-dom"
import { EditTodoListDialog } from "./EditTodoListDialog"
import { useCallback, useState } from "react"
import { Menu } from "../../../shared/ui/Menu"
import { useDeleteTodoListMutation } from "../../../entites/todos/slices/todos"
import { useTranslation } from "react-i18next"

type TodoListCardProps = {
    item: TodoList
    active: boolean
}

export const TodoListCard = ({item, active}:TodoListCardProps) => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [isOpenEditDialog, setOpenEditDialog] = useState(false)
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openMenu, setOpenMenu] = useState<{x: number, y:number} | null>(null)
    const [request] = useDeleteTodoListMutation()

    const toglePath = (e:React.MouseEvent<HTMLLIElement>, id:string) => {
        e.stopPropagation()
        navigate(`/todo/${id}`)
    }

    const deleteHandler = useCallback(() => {
        request(item.id)
    },[request, item.id])

    const blocks = [{
        items: [{
            title:  t("edit"),
            onClick: ()=>setOpenEditDialog(true),
        },{
            title: t("delete"),
            onClick: ()=>setOpenDeleteDialog(true)
        }]
    }]

    return(
        <>
            <ListItem 
                active={active} 
                key={item.id} 
                header={item.title} 
                onClick={(e)=>toglePath(e, item.id)}
                control={
                    <IconButton 
                        onClick={(event)=>setOpenMenu({x: event.clientX, y: event.clientY})} 
                        size="small" 
                        transparent 
                        icon={<MoreVertical/>}
                    />
                }
            /> 
            <Menu 
                autoHide 
                onHide={()=>setOpenMenu(null)} 
                blocks={blocks} 
                visible={!!openMenu} x={openMenu?.x ?? 0} y={openMenu?.y ?? 0}
            />
            <EditTodoListDialog 
                data={item} 
                open={isOpenEditDialog} 
                hide={()=>setOpenEditDialog(false)}
            />
            {
            isOpenDeleteDialog && 
            <BaseDialog 
                header="Удалить доску" 
                text="Вы уверены что хотите удалить доску" 
                onSuccess={deleteHandler}
                onHide={()=>setOpenDeleteDialog(false)}
            />
            }
            
        </>
    )
}