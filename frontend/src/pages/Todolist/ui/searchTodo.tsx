import { Check, FilterIcon, IconButton, Panel, Plus, SearchIcon, TextField, Typography, X } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import { useCallback, useState } from "react"
import { FilterPopover, type FilterType } from "../../../shared/ui/FilterPopover/FilterPopover"
import { combineToDate, formatDate } from "../../../shared/helpers/date"

export type TodoSearchProps = {
    title: string,
    onSearch: (data:{search?: string, complited?: boolean, dateFrom?: string, dateTo?: string}) => void
    onCreate: () => void
}



export const TodoSearch = ({title, onCreate, onSearch}:TodoSearchProps) => {

    const {t} = useTranslation()
    const [completed, setCompleted] = useState<undefined | boolean>()
    const [from, setFrom] = useState<undefined | Date>()
    const [to, setTo] = useState<undefined | Date>()
    const [filterOpen, setFilterOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")

    const searchHandler = useCallback(() => {
        onSearch({search, complited: completed, dateFrom: from?.toISOString(), dateTo: to?.toISOString()})
    },[onSearch, search, completed, to, from])

    const filterHandler = (key: string, value: any) => {
        if(key === "complited"){
            setCompleted(()=>{
                if(value === "undefined")
                    return undefined
                return value === "true"
            })
        }
        if(key === "dateFrom"){
            setFrom(()=>{
                if(!value || value === "undefined" || value === "")
                    return undefined
                return combineToDate(value)
            })
        }
        if(key === "dateTo"){
            setTo(()=>{
                if(!value || value === "undefined" || value === "")
                    return undefined
                return combineToDate(value)
            })
        }
    }

    const filters: FilterType[] = [
        { type: "select", label: t("complited"), value: "complited", options: [
            { title: t("any"), value: "undefined" },
            { title: t("check"), value: "true", icon: <Check/> },
            { title: t("no-check"), value: "false", icon: <X/> }
            ]
        },
        {
            type: "date", label: t("dateFrom"), value: "dateFrom"
        },
        {
            type: "date", label: t("dateTo"), value: "dateTo"
        }
    ];

    return(
        <>
        <Panel className="title_div" shadow={6} style={{flex: "0 0 160px"}}>
            <div className="toolbar" style={{width: "100%"}}>

                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <Typography type="title">
                    {t("title_todolist")}: {title}
                    </Typography>
                    <IconButton shadow={5} icon={<Plus />} onClick={onCreate} />
                </div>

                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10}}>
                    <IconButton shadow={5} icon={<FilterIcon />} onClick={()=>setFilterOpen(true)} />
                    <TextField placeholder="search" className="search-todo" value={search} onChange={e=>setSearch(e)} border/>
                    <IconButton shadow={5} icon={<SearchIcon />} onClick={searchHandler} />
                </div>

            </div>
        </Panel>
        <FilterPopover 
            title={t("filter-title")}
            onClose={()=>setFilterOpen(false)} 
            isOpen={filterOpen} 
            filters={filters}
            filterValues={{
                complited: completed !== undefined? String(completed):"undefined",
                dateFrom: from ? formatDate(from) : undefined,
                dateTo: to ? formatDate(to) : undefined
            }}
            updateFilter={filterHandler}
        />
        </>
        
    )
}