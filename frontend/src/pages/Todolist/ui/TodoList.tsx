import { useParams } from "react-router-dom"
import { useGetTodoListWithTodosQuery, useMoveTodoMutation } from "../../../entites/todos/slices/todos"
import { ListContainer, Panel } from "alex-evo-sh-ui-kit"
import "./TodoList.scss"
import React, { useCallback, useEffect, useState } from "react"
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { TodoItem } from "../../../widgets/TodoItem"
import { buildMoveColumnPayload } from "../helpers/buildMoveColumnPayload"
import { TodoSearch } from "./searchTodo"
import { Loader } from "../../../shared"

type TodoListProps = {
    onCreate: () => void
    onEdit: (id: string) => void
}

const TodoListNoMemo = ({onCreate, onEdit}:TodoListProps) => {

    const {id} = useParams()
    const [cursor, setCursor] = useState<string | null>(null)
    const [search, setSearch] = useState<{search?: string, complited?: boolean}>({})

    const { data, isLoading, isFetching } = useGetTodoListWithTodosQuery({
        id: id ?? "",
        cursor,
        limit: 20,
        search: search.search === ""? undefined: search.search,
        completed: search.complited === undefined ? undefined : search.complited
    })

    const [request, {error, isError}] = useMoveTodoMutation()
    useError({error, isError})

    const setNewFilter = (data:{search?: string, complited?: boolean}) => {
        setCursor(null)
        setSearch(data)
    }

    const dragEndHandler = useCallback((event: DropResult) => {
        if (!id || !data) return
        if (!event.destination) return

        if (event.type === 'TASK') {
            const reqData = buildMoveColumnPayload(event, data.todos, id)
            if (!reqData) return

            request(reqData)
        }
    }, [request, data, id])

    const fatchNewBlock:IntersectionObserverCallback = useCallback((entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && !isFetching && data?.meta?.nextCursor) {
        setCursor(data.meta.nextCursor)
        }
    },[isFetching, data?.meta?.nextCursor])

    useEffect(() => {
        setCursor(null)
    }, [id])

    if(!id)
        return null

    if(isLoading)
        return(<Loader/>)

    return (
        <>
            <TodoSearch title={data?.title ?? ""} onCreate={onCreate} onSearch={setNewFilter}/>
            <Panel className="todo-list-content-panel" shadow={6}>
                <DragDropContext onDragEnd={dragEndHandler}>
                    <Droppable droppableId="root" direction="vertical" type="TASK">
                        {(provided) => (
                            <ListContainer 
                            onObserv={fatchNewBlock} 
                            scroll 
                            transparent 
                            ref={provided.innerRef} 
                            {...provided.droppableProps} 
                            style={{display: "flex", gap: "5px", flexDirection: "column", height: "calc(100% - 20px)", paddingLeft: "5px"}}
                            >
                                {data?.todos.map((item, index) => (
                                <TodoItem
                                    onClick={() => onEdit(item.id)}
                                    key={item.id}
                                    index={index}
                                    item={item}
                                />
                                ))}

                                {provided.placeholder}

                                {isFetching && <Loader/>}
                            </ListContainer>
                        )}
                    </Droppable>
                </DragDropContext>
            </Panel>
        </>
    )
}

export const TodoList = React.memo(TodoListNoMemo)