import { BaseDialog, Pen, Trash, type IPoint } from "alex-evo-sh-ui-kit"
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
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

type CommentProps = {
    data: CommentType
    onEditClick?: ()=>void
}

export const Comment = ({ data: item, onEditClick }: CommentProps) => {
    const { data } = useGetUserQuery(item.authorId)
    const [request, { error, isError }] = useDeleteCommentMutation()
    useError({ error, isError })

    const { t } = useTranslation()
    const [menu, setMenu] = useState<IPoint | null>(null)
    const [isDialog, setDialog] = useState(false)
    const auth = useContext(AuthContext)

    const isOwn = auth?.user?.userId === item.authorId

    const deleteComment = useCallback(() => {
        request({ id: item.id, todoId: item.todoId })
    }, [request, item])

    const openMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setMenu({ x: e.clientX, y: e.clientY })
    }

    const letter = data?.name?.[0]?.toUpperCase() ?? "?"
    const color = stringToColor(item.authorId)

    const created = dayjs(item.createdAt)
    const now = dayjs()

    const time =
    now.diff(created, "day") < 1
        ? created.fromNow()
        : created.format("DD MMM HH:mm")

    const menuItems = [{
                    title: "delete",
                    icon: <Trash />,
                    onClick: () => setDialog(true),
                }]
    
    if(onEditClick)menuItems.push({
                                    title: "edit",
                                    icon: <Pen />,
                                    onClick: onEditClick,
                                })

    return (
        <>
            <div 
                className={`comment ${isOwn ? "comment--own" : ""}`}
                onContextMenu={openMenu}
            >
                {!isOwn && (
                    <div 
                        className="comment__avatar"
                        style={{ background: color }}
                    >
                        {letter}
                    </div>
                )}

                <div className="comment__bubble">
                    {!isOwn && (
                        <div className="comment__author">
                            {data?.name ?? "Unknown"}
                        </div>
                    )}

                    <div className="comment__text">
                        {item.text}
                    </div>

                    <div className="comment__meta">
                        <span className="comment__time">{time}</span>
                    </div>
                </div>
            </div>

            {isDialog && (
                <BaseDialog
                    header={t("delete_comment_head")}
                    text={t("delete_comment_text")}
                    onCancel={() => setDialog(false)}
                    onSuccess={deleteComment}
                />
            )}

            {menu && (
                <Menu
                    autoHide
                    onHide={() => setMenu(null)}
                    x={menu.x}
                    y={menu.y}
                    visible={!!menu}
                    blocks={[
                        {
                            items: menuItems,
                        },
                    ]}
                />
            )}
        </>
    )
}