import { Panel, ScreenSize, useScreenSize } from "alex-evo-sh-ui-kit"
import { Outlet } from "react-router-dom"
import { TodoLists, TodoListsMobile } from "../../../widgets/TodoLists"

import './TodoListRoot.scss'

export const TodoListRoot = () => {

    const {screen} = useScreenSize()

    return(
        <div className="todo-list-root">
            {
                screen === ScreenSize.MOBILE?
                <TodoListsMobile/>:
                <TodoLists/>
            }
            <Panel style={{ flex: 1}}>
                <Outlet/>
            </Panel>
        </div>
    )
}