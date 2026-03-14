
import { ArrowUp, Form, IconButton, ListContainer, type FormRef } from "alex-evo-sh-ui-kit"
import type { TodoWithComments } from "../../../entites/todos/models/todo"
import { useTranslation } from "react-i18next"
import './Comment.scss'
import { useAddCommentMutation } from "../../../entites/todos/slices/todos"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { useCallback, useEffect, useRef } from "react"
import { Comment } from "../../../features/Comment/ui/Comment"

type CommentsDialogProps = {
    todo: TodoWithComments
}

export const CommentTodoDialog = ({todo}:CommentsDialogProps) => {
    
    const form = useRef<FormRef>(null)
    const ul = useRef<HTMLUListElement>(null)
    const {t} = useTranslation()
    const [addComment, {error, isError}] = useAddCommentMutation()
    useError({error, isError})

    const sendComment = useCallback(async(data: Record<string, unknown>) => {
        const comment = data["comment"]
        if(comment && typeof(comment) === 'string'){
            await addComment({todoId: todo.id, text:comment})
            ul.current?.scrollIntoView({behavior: "smooth"})
        }
    },[addComment, todo])

    const submite = () => {
        form.current?.submit()
        form.current?.reset()
    }

    useEffect(() => {
        if (ul.current) {
            ul.current.scrollTop = ul.current.scrollHeight
        }
    }, [todo.comments])

    return(
        <div className="comment-page">
            <ListContainer className="comment-page__list" ref={ul} scroll maxHeight="300px">
            {
                todo.comments.map((item)=>{
                    return (
                        <Comment key={item.id} data={item}/>
                    )
                })
            }
            </ListContainer>
            <Form className="comment-page__input-container" ref={form} onFinish={sendComment}>
                <Form.TextInput name="comment" className="comment-page__input-container__input" border placeholder={t("input_comment")}/>
                <IconButton icon={<ArrowUp/>} onClick={submite}/>
            </Form>
        </div>
    )
}