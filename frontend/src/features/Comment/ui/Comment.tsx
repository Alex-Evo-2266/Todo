import { BaseDialog, ListItem, Pen, Trash, type IPoint } from "alex-evo-sh-ui-kit"
import { useGetUserQuery } from "../../../entites/users/slices/user"
import './Comment.scss'
import { stringToColor } from "../../../shared/helpers/stringToColor"
import { useTranslation } from "react-i18next"
import { Menu } from "../../../shared/ui/Menu"
import { useCallback, useContext, useState, type MouseEvent } from "react"
import { useDeleteCommentMutation } from "../../../entites/todos/slices/todos"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import type { Comment as CommentType } from "../../../entites/todos/models/todo"
import { AuthContext } from "alex-evo-sh-auth"

type CommentProps = {
    data: CommentType
}

export const Comment = ({data: item}: CommentProps) => {
    const {data} = useGetUserQuery(item.authorId)
    const [request, {error, isError}] = useDeleteCommentMutation()
    useError({error, isError})
    const {t} = useTranslation()
    const [menu, setMenu] = useState<IPoint | null>(null)
    const [isDialog, setDialog] = useState<boolean>(false)
    const auth = useContext(AuthContext)

    const deleteComment = useCallback(()=>{
        request({id: item.id, todoId: item.todoId})
    },[request, item])

    const openMenu = (e:MouseEvent<HTMLLIElement>) => {
        e.preventDefault()
        setMenu({x: e.clientX, y: e.clientY})
    }

    const letter = data?.name?.[0]?.toUpperCase() ?? "?"
    const color = stringToColor(item.authorId)

    return (
        <>
        <ListItem
            className="comment-item"
            icon={<div className="avatar" style={{background: color}}>{letter}</div>}
            header={item.text}
            style={{backgroundColor: auth?.user?.user_id === item.authorId? "var(--Primary-container-color)": undefined}}
            onContextMenu={openMenu}
        />
        {isDialog && <BaseDialog
            header={t("delete_comment_head")} 
            text={t("delete_comment_text")} 
            onCancel={()=>setDialog(false)}
            onSuccess={deleteComment}
        />}
        {menu && <Menu 
            autoHide
            onHide={()=>setMenu(null)} 
            x={menu.x} 
            y={menu.y} 
            visible={!!menu} 
            blocks={[{items:[{
                    title: "delete",
                    icon: <Trash/>,
                    onClick: ()=>setDialog(true)
                },
                {
                    title: "edit",
                    icon: <Pen/>,
                    onClick: ()=>{}
                }
            ]}]}
        />}
        </>
        
    )
}