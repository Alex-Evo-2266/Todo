import { useParams } from "react-router-dom"
import { useGetTodoListWithTodosQuery, useMoveTodoMutation } from "../../../entites/todos/slices/todos"
import { IconButton, ListContainer, Panel, Plus, Typography } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import "./TodoList.scss"
import React, { useCallback } from "react"
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { TodoItem } from "../../../widgets/TodoItem"
import { buildMoveColumnPayload } from "../helpers/buildMoveColumnPayload"

type TodoListProps = {
    onCreate: () => void
    onEdit: (id: string) => void
}

const TodoListNoMemo = ({onCreate, onEdit}:TodoListProps) => {

    const {id} = useParams()
    const {data, isLoading} = useGetTodoListWithTodosQuery(id ?? "")
    const {t} = useTranslation()

    const [request, {error, isError}] = useMoveTodoMutation()
    useError({error, isError})

    const dragEndHandler = useCallback((event: DropResult) => {
        console.log(event, data, id)
        if(!id || !data)return;
        if (event.type === 'TASK') {
            const reqData = buildMoveColumnPayload(event, data.todos, id)
            if(!reqData)return
            request(reqData)
        }
    },[request, data, id])

    if(!id)
        return null

    if(isLoading)
        return(<div>...loading</div>)

    return (
        <>
            <Panel className="title_div" shadow={6}>
                <Typography type="title">{t("title_todolist")}: {data?.title}</Typography>
                <IconButton shadow={5} icon={<Plus/>} onClick={onCreate}/>
            </Panel>
            <Panel style={{flex: 1}} shadow={6}>
                <DragDropContext onDragEnd={dragEndHandler}>
                    <Droppable droppableId="root" direction="vertical" type="TASK">
                        {(provided) => (
                            <ListContainer transparent ref={provided.innerRef} {...provided.droppableProps} style={{display: "flex", gap: "5px", flexDirection: "column"}}>
                                {
                                    data?.todos.map((item, index)=>(
                                    <TodoItem onClick={()=>onEdit(item.id)} key={item.id} index={index} item={item}/>  
                                    ))  
                                }
                                {provided.placeholder}
                            </ListContainer>
                        )}
                    </Droppable>
                </DragDropContext>
            </Panel>
        </>
    )
}

export const TodoList = React.memo(TodoListNoMemo)