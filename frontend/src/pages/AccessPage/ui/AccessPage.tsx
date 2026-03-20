import { Check, IconButton, Panel, Table, Typography, UserIcon, X, type IColumn } from "alex-evo-sh-ui-kit"
import { useParams } from "react-router-dom"
import { useGetAccessListQuery, useGetTodoListWithTodosQuery, useGrantAccessMutation, useRevokeAccessMutation } from "../../../entites/todos/slices/todos"
import { useGetAllUserQuery, type User } from "../../../entites/users/slices/user"
import { useError } from "../../../shared/hooks/errorMessage.hook"
import { useTranslation } from "react-i18next"

type UserTable = User & {type: "owner" | "access" | "other"}

export const AccessPage = () => {

    const {id} = useParams()
    const {data} = useGetTodoListWithTodosQuery(id ?? "")
    const {data:usersData } = useGetAllUserQuery()
    const {t} = useTranslation()
    const {data:usersAccessData } = useGetAccessListQuery(id ?? "")
    const [requestAdd, {error: errorAdd, isError: isErrorAdd}] = useGrantAccessMutation()
    useError({error: errorAdd, isError: isErrorAdd})
    const [requestDelete, {error, isError}] = useRevokeAccessMutation()
    useError({error, isError})

    const accessUserIds = new Set(usersAccessData?.map(item => item.userId) || []);

    function sortUsers(usersData: User[], accessUserIds:Set<string>, ownerId: string){
        const owner:UserTable[] = []
        const accessUsers:UserTable[] = []
        const otherUsers:UserTable[] = []
        usersData.forEach(user=>{
            if(user.id === ownerId)
                return owner.push({...user, type: "owner"})
            if(accessUserIds.has(user.id))
                return accessUsers.push({...user, type: "access"})
            otherUsers.push({...user, type: "other"})
        })
        return[...owner, ...accessUsers, ...otherUsers]
    }
    
    const sortedUsers = sortUsers(usersData?.users ?? [], accessUserIds, data?.ownerId ?? "")

    const cols:IColumn[] = [{
        field: "name",
        title: "name"
    },{
        field: "type",
        title: "shear",
        template(_, data) {
            if(data.type === "owner"){
                return <IconButton transparent icon={<UserIcon/>}/>
            }
            if(data.type === "access"){
                return <IconButton transparent onClick={()=>id?requestDelete({todoListId: id, userId: String(data.id)}):undefined} icon={<Check/>}/>
            }
            return <IconButton transparent onClick={()=>id?requestAdd({todoListId: id, userId: String(data.id)}):undefined} icon={<X/>}/>
        },
    }]

    return(
        <>
            <Panel className="title_div" shadow={6}>
                <Typography type="title">{t("title_todolist")}: {data?.title}</Typography>
            </Panel>
            <Table shadow={6} columns={cols} data={sortedUsers}/>
        </>
    )
}