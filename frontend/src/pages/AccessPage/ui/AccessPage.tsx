import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  FilterIcon,
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
import { FilterPopover, Loader, type FilterType } from "../../../shared";

export const AccessPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [access, setAccess] = useState<boolean | undefined>(undefined);

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

  const getType = useCallback((user: User) => {
    if (user.id === data?.ownerId) return "owner";
    if (accessUserIds.has(user.id)) return "access";
    return "other";
  },[accessUserIds, data])

  // 🔹 обработчик
  const handleToggle = useCallback((user: User) => {
    if (!id) return;

    const type = getType(user);

    if (type === "owner") return;

    if (type === "access") {
      requestDelete({ todoListId: id, userId: String(user.id) });
    } else {
      requestAdd({ todoListId: id, userId: String(user.id) });
    }
  },[getType])

  const fatchNewBlock:IntersectionObserverCallback = useCallback((entries) => {
          const entry = entries[0]

          if (entry.isIntersecting && !isFetching && usersData?.next_cursor) {
              setCursor(usersData.next_cursor);
          }
  },[isFetching, usersData?.next_cursor])


  const filterHandler = (key: string, value: any) => {
      if(key === "access"){
          setAccess(()=>{
              if(value === "undefined")
                  return undefined
              return value === "true"
          })
      }
  }

  const filters: FilterType[] = [
      { type: "select", label: t("access-filter"), value: "access", options: [
          { title: t("any"), value: "undefined" },
          { title: t("access-yes"), value: "true", icon: <Check/> },
          { title: t("access-no"), value: "false", icon: <X/> }
          ]
      }
  ];

  const dataFilter = useCallback((users: User[] | undefined) => {
    return users?.map(user=>({user: user, type: getType(user)})).filter(user=>access === undefined || ((user.type === "owner" || user.type === "access") && access) || (user.type === "other" && !access))
  },[getType, access])


  return (
    <>
      <Panel className="title-access-div" shadow={6}>
        <Search onSearch={searchHandler} btn={{icon: <FilterIcon/>, onClick: ()=>setFilterOpen(true),}}/>
        <Typography type="title">
          {t("title_todolist")}: {data?.title}
        </Typography>
        <FilterPopover
            title={t("filter-title")}
            btnClick={()=>setFilterOpen(false)} 
            textBtn={t('close')}
            isOpen={!!filterOpen} 
            filters={filters}
            filterValues={{
                access: access !== undefined? String(access):"undefined",
            }}
            updateFilter={filterHandler}
        />
      </Panel>

      <ListContainer onObserv={fatchNewBlock} scroll flex gap={5} transparent style={{display: "flex", gap: "5px", flexDirection: "column", height: "calc(100% - 150px)", paddingInline: "5px"}}>
        {dataFilter(usersData?.users)?.map(({user, type}) => {

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