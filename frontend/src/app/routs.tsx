import { CallbackPage, ProtectGate, useAuth } from "alex-evo-sh-auth"
import { Navigate, Route, Routes } from "react-router-dom";
import { TodoListRoot } from "../pages/TodoListsRoot";
import { TodoListPage } from "../pages/Todolist";
import { ROOT_URL } from "./config";

export const RoutesComponent = ()=>{

	const { loading } = useAuth();

	if (loading) return <p>Загрузка...</p>;

	return (
            <Routes>
				<Route path={ROOT_URL}>
					<Route path="callback" element={<CallbackPage/>}/>
					<Route element={<ProtectGate/>}>
						<Route path="todo" element={<TodoListRoot/>}>
							<Route path=":id" element={<TodoListPage/>}/>
							<Route path="*" element={<Navigate replace to="/todo" />} />
						</Route>
					</Route>
				</Route>
            </Routes>
	)
}