import { useParams } from "react-router-dom"
import { useGetTodoListWithTodosQuery, useMoveTodoMutation, type MoveTodoRequest } from "../../../entites/todos/slices/todos"
import { IconButton, ListContainer, ListItem, Plus, Typography } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import "./TodoList.scss"
import { CreateTodoDialog } from "../../../features/CreateTodoDialog"
import { useCallback, useState } from "react"
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import type { Todo } from "../../../entites/todos/models/todo"

export function buildMoveColumnPayload(
  event: DropResult,
  todos: Todo[],
  list: string
): MoveTodoRequest | undefined {
  if (!todos || !list) return;
  console.log(event);
  const sourseId = event.draggableId.split('=')[1];
  const dragTodo = todos.find((item) => item.id === sourseId);
  const destIndex = event.destination?.index;

  if (!dragTodo || !sourseId || destIndex === undefined || event.source.index === destIndex)
    return;

  if (destIndex === 0) {
    return {
      todoList: list,
      id: sourseId,
      posVersion: dragTodo.posVersion,
      placement: 'start'
    };
  }

  if (destIndex === todos.length - 1) {
    return {
        todoList: list,
        id: sourseId,
        posVersion: dragTodo.posVersion,
        placement: 'end',
    };
  }
  const target = todos[destIndex];

  if (destIndex > event.source.index) {
    return {
      todoList: list,
      id: sourseId,
      placement: 'after',
      posVersion: dragTodo.posVersion,
      targetTask: target.id
    };
  }

  return {
    todoList: list,
    id: sourseId,
    posVersion: dragTodo.posVersion,
    placement: 'before',
    targetTask: target.id
  };
}


export const TodoListPage = () => {

    const {id} = useParams()
    const {data, isLoading} = useGetTodoListWithTodosQuery(id ?? "")
    const {t} = useTranslation()
    const [isOpenCreateTodoDialog, setOpenCreateTodoDialog] = useState(false)
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
        <div>
            <div className="title_div">
                <Typography type="title">{t("title_todolist")}: {data?.title}</Typography>
                <IconButton icon={<Plus/>} onClick={()=>setOpenCreateTodoDialog(true)}/>
            </div>
            <DragDropContext onDragEnd={dragEndHandler}>
                <Droppable droppableId="root" direction="vertical" type="TASK">
                    {(provided) => (
                        <ListContainer transparent ref={provided.innerRef} {...provided.droppableProps}>
                            {
                                data?.todos.map((item, index)=>(
                                    <Draggable key={item.id} draggableId={`task=${item.id}`} index={index}>
                                        {(provided2) => (
                                            <ListItem 
                                            onClick={()=>console.log("li")}
                                            ref={provided2.innerRef} 
                                            shadow={5} 
                                            hovered 
                                            header={`${t("todo_title")}${item.title}`}
                                            {...provided2.draggableProps}
                                            {...provided2.dragHandleProps}
                                            />
                                        )}
                                    </Draggable>
                                ))  
                            }
                            {provided.placeholder}
                        </ListContainer>
                    )}
                </Droppable>
            </DragDropContext>
            <CreateTodoDialog listId={id} open={isOpenCreateTodoDialog} onHide={()=>setOpenCreateTodoDialog(false)}/>
        </div>
    )
}