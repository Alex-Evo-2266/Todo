import { Checkbox, ListItem } from "alex-evo-sh-ui-kit"

import { useTranslation } from "react-i18next"
import { Draggable } from "@hello-pangea/dnd"
import type { Todo } from "../../../entites/todos/models/todo"
import { useCallback, type ChangeEvent } from "react"
import { useCheckTodoMutation } from "../../../entites/todos/slices/todos"
import { useError } from "../../../shared/hooks/errorMessage.hook"

type TodoItemProps = {
    item: Todo
    index: number
    onClick: () => void
}

export const TodoItem = ({item, index, onClick}:TodoItemProps) => {

    const {t} = useTranslation()
    const [request, {error, isError}] = useCheckTodoMutation()
    useError({error, isError})

    const checkHandler = useCallback((e:ChangeEvent<HTMLInputElement>) => {
        request({id: item.id, todoList: item.todoListId, check: e.target.checked, posVersion: item.posVersion, contVersion: item.contVersion})
    },[item])

    return (
        <Draggable draggableId={`task=${item.id}`} index={index}>
            {(provided2) => (
                <ListItem
                onClick={onClick}
                ref={provided2.innerRef} 
                shadow={10} 
                hovered 
                style={{transition: "none"}}
                control={<Checkbox checked={item.completed} onChange={checkHandler}/>}
                header={`${t("todo_title")}${item.title}`}
                {...provided2.draggableProps}
                {...provided2.dragHandleProps}
                />
            )}
        </Draggable>
    )
}