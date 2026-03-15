import { BottomSheetsUi, Button, ListContainer, MenuIcon } from "alex-evo-sh-ui-kit"

import './TodoLists.scss'
import { useState } from "react"
import { useGetTodoListsQuery } from "../../../entites/todos/slices/todos"
import { useParams } from "react-router-dom"
import { TodoListCard } from "./TodoListCard"
import { useTranslation } from "react-i18next"
import { CreateDialog } from "../../../features/CreactTodoListDialog"

export const TodoListsMobile = () => {

    const [visibleCreateDialog, setVisibleCreateDialog] = useState(false)
    const [isOpenList, setOpenList] = useState(false)
    const {data} = useGetTodoListsQuery()
    const {id} = useParams()
    const {t} = useTranslation()

    return (
        <>
        <Button onClick={()=>setOpenList(true)} className="boards-btn" styleType="filledTotal">
            <MenuIcon className="boards-btn__icon"/>
            {t("boards")}
        </Button>
        <BottomSheetsUi visible={isOpenList} onHide={()=>setOpenList(false)}>
            <ListContainer className="todolists-panel__list" transparent>
            {
                data?.map((item)=>(
                    <TodoListCard item={item} key={item.id} active={item.id === id} onHide={()=>setOpenList(false)}/>
                ))
            }
            </ListContainer>
        </BottomSheetsUi>
        <CreateDialog
                open={visibleCreateDialog}
                hide={()=>setVisibleCreateDialog(false)}
            />
        </>
    )
}