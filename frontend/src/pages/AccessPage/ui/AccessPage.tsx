import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  IconButton,
  ListContainer,
  ListItem,
  Panel,
  Search,
  Typography,
  X
} from "alex-evo-sh-ui-kit";
import { useParams } from "react-router-dom";
import {
  useGetAccessListQuery,
  useGetTodoListWithTodosQuery,
  useGrantAccessMutation,
  useRevokeAccessMutation
} from "../../../entites/todos/slices/todos";
import { useGetAllUserQuery, type User } from "../../../entites/users/slices/user";
import { useError } from "../../../shared/hooks/errorMessage.hook";
import { useTranslation } from "react-i18next";
import './AccessPage.scss'
import { Loader } from "../../../shared";

export const AccessPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { data } = useGetTodoListWithTodosQuery({ id: id ?? "" });

  const {
    data: usersData,
    isFetching
  } = useGetAllUserQuery({
    limit: 20,
    cursor,
    search
  });

  const { data: usersAccessData } = useGetAccessListQuery(id ?? "");

  const [requestAdd, { error: errorAdd, isError: isErrorAdd }] =
    useGrantAccessMutation();

  const [requestDelete, { error, isError }] =
    useRevokeAccessMutation();

  useError({ error: errorAdd, isError: isErrorAdd });
  useError({ error, isError });

  const accessUserIds = useMemo(
    () => new Set(usersAccessData?.map(item => item.userId) || []),
    [usersAccessData]
  );

  const searchHandler = (data: string) => {
    if(data === "")
        setSearch(undefined)
    else
        setSearch(data)
    setCursor(undefined)
  }

  useEffect(() => {
    setCursor(undefined);
  }, [id]);

  const getType = (user: User) => {
    if (user.id === data?.ownerId) return "owner";
    if (accessUserIds.has(user.id)) return "access";
    return "other";
  };

  // 🔹 обработчик
  const handleToggle = (user: User) => {
    if (!id) return;

    const type = getType(user);

    if (type === "owner") return;

    if (type === "access") {
      requestDelete({ todoListId: id, userId: String(user.id) });
    } else {
      requestAdd({ todoListId: id, userId: String(user.id) });
    }
  };

    const fatchNewBlock:IntersectionObserverCallback = useCallback((entries) => {
            const entry = entries[0]
  
            if (entry.isIntersecting && !isFetching && usersData?.next_cursor) {
                setCursor(usersData.next_cursor);
            }
    },[isFetching, usersData?.next_cursor])


  return (
    <>
      <Panel className="title-access-div" shadow={6}>
        <Search onSearch={searchHandler}/>
        <Typography type="title">
          {t("title_todolist")}: {data?.title}
        </Typography>
      </Panel>

      <ListContainer onObserv={fatchNewBlock} scroll flex gap={5} transparent style={{display: "flex", gap: "5px", flexDirection: "column", height: "calc(100% - 150px)", paddingInline: "5px"}}>
        {usersData?.users.map((user) => {
          const type = getType(user);

          return (
            <ListItem
              key={user.id}
              shadow={15}
              header={user.name}
              text={`email: ${user.email}`}
              control={
                type !== "owner" && (
                  <IconButton
                    transparent
                    onClick={() => handleToggle(user)}
                    icon={
                      type === "access" ? <Check /> : <X />
                    }
                  />
                )
              }
            />
          );
        })}
      </ListContainer>

      {isFetching && <Loader/>}
    </>
  );
};