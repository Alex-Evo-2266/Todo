import { ScreenSize, SizeContext } from "alex-evo-sh-ui-kit"
import { Outlet } from "react-router-dom"
import { TodoLists, TodoListsMobile } from "../../../widgets/TodoLists"

import './TodoListRoot.scss'
import { useContext } from "react"

export const TodoListRoot = () => {

    const {screen} = useContext(SizeContext)

    return(
        <div className="todo-list-root">
            {
                screen === ScreenSize.MOBILE?
                <TodoListsMobile/>:
                <TodoLists/>
            }
            <div style={{ flex: 1 }}>
                <Outlet/>
            </div>
        </div>
    )
}