import { useParams } from "react-router-dom"
import { useGetTodoListWithTodosQuery, useMoveTodoMutation } from "../../../entites/todos/slices/todos"
import { IconButton, ListContainer, Panel, Plus, Search, Typography } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import "./TodoList.scss"
import React, { useCallback, useEffect, useState } from "react"
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { TodoItem } from "../../../widgets/TodoItem"
import { buildMoveColumnPayload } from "../helpers/buildMoveColumnPayload"
import { SelectField } from "../../../shared/ui/SelectField"

type TodoListProps = {
    onCreate: () => void
    onEdit: (id: string) => void
}

const TodoListNoMemo = ({onCreate, onEdit}:TodoListProps) => {

    const {id} = useParams()
    const [search, setSearch] = useState<string>("")
    const [completed, setCompleted] = useState<undefined | "false" | "true">(undefined)
    const [cursor, setCursor] = useState<string | null>(null)

    const { data, isLoading, isFetching } = useGetTodoListWithTodosQuery({
        id: id ?? "",
        cursor,
        limit: 20,
        search: search === ""? undefined: search,
        completed: completed ? Boolean(completed): undefined
    })
    const {t} = useTranslation()

    const [request, {error, isError}] = useMoveTodoMutation()
    useError({error, isError})

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
        return(<div>...loading</div>)

    return (
        <>
            <Panel className="title_div" shadow={6}>
                <div className="toolbar">
    
                    <Typography type="title">
                    {t("title_todolist")}: {data?.title}
                    </Typography>

                    <Search onSearch={setSearch} border/>

                    <SelectField border value={completed ? completed: "undefined"} items={[{
                        title: "",
                        value: "undefined"
                    },{
                        title: "complited",
                        value: "true"
                    },{
                        title: "uncomplited",
                        value: "false"
                    }]} onChange={(data: any)=>setCompleted(()=>{
                        if(data === "undefined")
                            return undefined
                        return data
                    })}/>

                    {/* <select
                    className="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    >
                    <option value="all">{t("all")}</option>
                    <option value="active">{t("active")}</option>
                    <option value="completed">{t("completed")}</option>
                    </select> */}

                    <IconButton shadow={5} icon={<Plus />} onClick={onCreate} />

                </div>
            </Panel>
            <Panel style={{flex: 1, height: "calc(100vh - 145px)"}} shadow={6}>
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

                                {isFetching && <span>Loading...</span>}
                            </ListContainer>
                        )}
                    </Droppable>
                </DragDropContext>
            </Panel>
        </>
    )
}

export const TodoList = React.memo(TodoListNoMemo)