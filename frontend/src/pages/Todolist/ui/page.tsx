import { useParams } from "react-router-dom"
import { useGetTodoListWithTodosQuery } from "../../../entites/todos/slices/todos"
import { IconButton, ListContainer, ListItem, Plus, Typography } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import "./TodoList.scss"
import { CreateTodoDialog } from "../../../features/CreateTodoDialog"
import { useState } from "react"

export const TodoListPage = () => {

    const {id} = useParams()
    const {data, isLoading} = useGetTodoListWithTodosQuery(id ?? "")
    const {t} = useTranslation()
    const [isOpenCreateTodoDialog, setOpenCreateTodoDialog] = useState(false)

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
            <ListContainer transparent>
            {
                data?.todos.map((item)=>(
                    <ListItem shadow={5} key={item.id} hovered header={`${t("todo_title")}${item.title}`}/>
                ))  
            }
            </ListContainer>
            <CreateTodoDialog listId={id} open={isOpenCreateTodoDialog} onHide={()=>setOpenCreateTodoDialog(false)}/>
        </div>
    )
}