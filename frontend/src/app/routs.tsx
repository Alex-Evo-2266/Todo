import { useEffect } from "react"
import { AuthGuard, useAuth } from "alex-evo-sh-auth"
import { Navigate, Route, Routes } from "react-router-dom";
import { TodoListRoot } from "../pages/TodoListsRoot";
import { TodoListPage } from "../pages/Todolist";

export const RoutesComponent = ()=>{

	const { user, isAuthenticated, loading } = useAuth();

	useEffect(()=>{
		console.log(`auth data ${isAuthenticated} ${JSON.stringify(user)}`)
	},[isAuthenticated, user])

	if (loading) return <p>Загрузка...</p>;

	if (!isAuthenticated) return <p>Перенаправление на логин...</p>;

	return (
		<AuthGuard>
            <Routes>
                <Route path="/todo" element={<TodoListRoot/>}>
                    <Route path=":id" element={<TodoListPage/>}/>
                    <Route path="*" element={<Navigate replace to="/todo" />} />
                </Route>
            </Routes>
		</AuthGuard>

		
	)
}