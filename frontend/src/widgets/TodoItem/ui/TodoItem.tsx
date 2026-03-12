import { ListItem } from "alex-evo-sh-ui-kit"

import { useTranslation } from "react-i18next"
import { Draggable } from "@hello-pangea/dnd"
import type { Todo } from "../../../entites/todos/models/todo"
import { EditTodoDialog } from "../../../features/EditTodoDialog"
import { useState } from "react"

type TodoItemProps = {
    item: Todo
    index: number
}

export const TodoItem = ({item, index}:TodoItemProps) => {

    const {t} = useTranslation()
    const [isOpenEditDialog, setOpenEditDialog] = useState(false)

    return (
        <>
        <Draggable draggableId={`task=${item.id}`} index={index}>
            {(provided2) => (
                <ListItem
                onClick={()=>setOpenEditDialog(true)}
                ref={provided2.innerRef} 
                shadow={5} 
                hovered 
                header={`${t("todo_title")}${item.title}`}
                {...provided2.draggableProps}
                {...provided2.dragHandleProps}
                />
            )}
        </Draggable>
        <EditTodoDialog todo={item} open={isOpenEditDialog} onHide={()=>setOpenEditDialog(false)}/>
        </>
        
    )
}