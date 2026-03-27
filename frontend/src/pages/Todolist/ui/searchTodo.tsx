import { Check, FilterIcon, IconButton, Panel, Plus, SearchIcon, TextField, Typography, X } from "alex-evo-sh-ui-kit"
import { useTranslation } from "react-i18next"
import { useCallback, useState } from "react"
import { FilterPopover, type FilterType } from "../../../shared/ui/FilterPopover/FilterPopover"

export type TodoSearchProps = {
    title: string,
    onSearch: (data:{search?: string, complited?: boolean}) => void
    onCreate: () => void
}

const filters: FilterType[] = [
  { type: "select", label: "Complited", value: "complited", options: [
      { title: "Any", value: "undefined" },
      { title: "true", value: "true", icon: <Check/> },
      { title: "false", value: "false", icon: <X/> }
    ]
  },
];

export const TodoSearch = ({title, onCreate, onSearch}:TodoSearchProps) => {

    const {t} = useTranslation()
    const [completed, setCompleted] = useState<undefined | boolean>()
    const [filterOpen, setFilterOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")

    const searchHandler = useCallback(() => {
        onSearch({search, complited: completed})
    },[onSearch, search, completed])

    const filterHandler = (key: string, value: any) => {
        if(key === "complited"){
            setCompleted(()=>{
                if(value === "undefined")
                    return undefined
                return value === "true"
            })
        }
    }

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
            onClose={()=>setFilterOpen(false)} 
            isOpen={filterOpen} 
            filters={filters}
            filterValues={{complited: completed !== undefined? String(completed):"undefined"}}
            updateFilter={filterHandler}
        />
        </>
        
    )
}