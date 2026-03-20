import { CallbackPage, ProtectGate, useAuth } from "alex-evo-sh-auth"
import { Navigate, Route, Routes } from "react-router-dom";
import { TodoListRoot } from "../pages/TodoListsRoot";
import { TodoListPage } from "../pages/Todolist";
import { ROOT_URL } from "../config";
import { AccessPage } from "../pages/AccessPage";

export const RoutesComponent = ()=>{

	const { loading } = useAuth();

	if (loading) return <p>Загрузка...</p>;

	return (
            <Routes>
				<Route path={ROOT_URL}>
					<Route path="callback" element={<CallbackPage/>}/>
					<Route element={<ProtectGate/>}>
						<Route path="todos" element={<TodoListRoot/>}>
							<Route path="access/:id" element={<AccessPage/>}/>
							<Route path="todo/:id" element={<TodoListPage/>}/>
							<Route path="*" element={<Navigate replace to="/todos" />} />
						</Route>
					</Route>
				</Route>
            </Routes>
	)
}