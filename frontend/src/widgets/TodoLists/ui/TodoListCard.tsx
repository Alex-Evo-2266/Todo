import { BaseDialog, IconButton, ListItem, MoreVertical } from "alex-evo-sh-ui-kit"
import type { TodoList } from "../../../entites/todos/models/todo"
import { useNavigate } from "react-router-dom"
import { useCallback, useMemo, useState } from "react"
import { Menu } from "../../../shared/ui/Menu"
import { useDeleteTodoListMutation } from "../../../entites/todos/slices/todos"
import { useTranslation } from "react-i18next"
import { EditTodoListDialog } from "../../../features/EditTodoListDialog"
import { ROOT_URL } from "../../../config"

type TodoListCardProps = {
    item: TodoList
    active: boolean
    onHide?: ()=>void
}

export const TodoListCard = ({item, active, onHide}:TodoListCardProps) => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [isOpenEditDialog, setOpenEditDialog] = useState(false)
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openMenu, setOpenMenu] = useState<{x: number, y:number} | null>(null)
    const [request] = useDeleteTodoListMutation()
    const blocks = useMemo(()=>[{
        items: [{
            title:  t("edit"),
            onClick: ()=>setOpenEditDialog(true),
        },{
            title: t("access"),
            onClick: ()=>navigate(`${ROOT_URL}/todos/access/${item.id}`)
        },{
            title: t("delete"),
            onClick: ()=>setOpenDeleteDialog(true)
        }]
    }],[item.id])

    const toglePath = useCallback((e:React.MouseEvent<HTMLLIElement>, id:string) => {
        e.stopPropagation()
        navigate(`${ROOT_URL}/todos/todo/${id}`)
        onHide?.()
    },[onHide, navigate])

    const deleteHandler = useCallback(() => {
        request(item.id)
    },[request, item.id])

    return(
        <>
            <ListItem 
                shadow={7}
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
                header={t("delete_board_head")}
                text={t("delete_board_text")}
                onSuccess={deleteHandler}
                onHide={()=>setOpenDeleteDialog(false)}
            />
            }
            
        </>
    )
}