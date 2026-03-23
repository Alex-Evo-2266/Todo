import type { DropResult } from "@hello-pangea/dnd";
import type { Todo } from "../../../entites/todos/models/todo";
import type { MoveTodoRequest } from "../../../entites/todos/slices/todos";

export function buildMoveColumnPayload(
  event: DropResult,
  todos: Todo[],
  list: string
): MoveTodoRequest | undefined {
  if (!todos || !list) return;
  const sourseId = event.draggableId.split('=')[1];
  const dragTodo = todos.find((item) => item.id === sourseId);
  const destIndex = event.destination?.index;

  if (!dragTodo || !sourseId || destIndex === undefined || event.source.index === destIndex)
    return;

  // if (destIndex === 0) {
  //   return {
  //     todoList: list,
  //     id: sourseId,
  //     posVersion: dragTodo.posVersion,
  //     placement: 'start'
  //   };
  // }

  // if (destIndex === todos.length - 1) {
  //   return {
  //       todoList: list,
  //       id: sourseId,
  //       posVersion: dragTodo.posVersion,
  //       placement: 'end',
  //   };
  // }
  const target = todos[destIndex];

  if (destIndex > event.source.index) {
    return {
      todoList: list,
      id: sourseId,
      placement: 'after',
      posVersion: dragTodo.posVersion,
      targetTask: target.id
    };
  }

  return {
    todoList: list,
    id: sourseId,
    posVersion: dragTodo.posVersion,
    placement: 'before',
    targetTask: target.id
  };
}