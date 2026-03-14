import { Panel } from "alex-evo-sh-ui-kit"
import { Outlet } from "react-router-dom"
import { TodoLists } from "../../../widgets/TodoLists"

import './TodoListRoot.scss'

export const TodoListRoot = () => {

    return(
        <div className="todo-list-root">
            <TodoLists/>
            <Panel style={{ flex: 1}}>
                <Outlet/>
            </Panel>
        </div>
    )
}