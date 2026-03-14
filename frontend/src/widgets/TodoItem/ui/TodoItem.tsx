import { ListItem } from "alex-evo-sh-ui-kit"

import { useTranslation } from "react-i18next"
import { Draggable } from "@hello-pangea/dnd"
import type { Todo } from "../../../entites/todos/models/todo"

type TodoItemProps = {
    item: Todo
    index: number
    onClick: () => void
}

export const TodoItem = ({item, index, onClick}:TodoItemProps) => {

    const {t} = useTranslation()

    return (
        <Draggable draggableId={`task=${item.id}`} index={index}>
            {(provided2) => (
                <ListItem
                onClick={onClick}
                ref={provided2.innerRef} 
                shadow={5} 
                hovered 
                header={`${t("todo_title")}${item.title}`}
                {...provided2.draggableProps}
                {...provided2.dragHandleProps}
                />
            )}
        </Draggable>
    )
}