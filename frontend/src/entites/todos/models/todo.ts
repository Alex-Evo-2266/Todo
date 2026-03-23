
// ---------- Типы на основе схем OpenAPI ----------


export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  todoListId: string;
  createdAt: string;
  updatedAt: string;
  posVersion: number;
  contVersion: number
  runk: string
  status: string
  parentId: string
  date: string
  _optimistic?: boolean
}

export interface Comment {
  id: string;
  text: string;
  todoId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoList {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
}

export interface TodoListWithTodos extends TodoList {
  todos: Todo[];
  meta: {
    nextCursor: string | null;
    limit: number;
  };
}

export interface TodoWithComments extends Todo {
  comments: Comment[];
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}