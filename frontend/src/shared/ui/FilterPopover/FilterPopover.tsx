import { Button, Checkbox, DateField, Panel, TextField, Typography, type IOption } from 'alex-evo-sh-ui-kit';
import './FilterPopover.scss'
import { SelectField } from '../SelectField';

export type FilterType = 
  | { type: "boolean"; label: string; value: string }
  | { type: "select"; label: string; value: string; options: IOption[] }
  | { type: "text"; label: string; value: string }
  | { type: "date"; label: string; value: string };

interface FilterPopoverProps {
  isOpen: boolean;
  btnClick: () => void;
  textBtn: string;
  filters: FilterType[];
  filterValues: Record<string, any>; // текущее состояние фильтров
  updateFilter: (key: string, value: any) => void;
  title: string
}

export const FilterPopover = ({
  isOpen,
  btnClick,
  filters,
  filterValues,
  updateFilter,
  textBtn,
  title,
}: FilterPopoverProps) => {

  if (!isOpen) return null;

  return (
    <div className="filter-popover-backdrop" onClick={btnClick}>
      <Panel
        className="filter-popover"
        shadow={6}
        onClick={(e) => e.stopPropagation()}
      >
        <h4>{title}</h4>
        <div className="filter-list">
          {filters.map((f) => {
            switch (f.type) {
              case "boolean":
                return (
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography type='body'>{f.label}</Typography>
                    <Checkbox
                        key={f.value}
                        checked={!!filterValues[f.value]}
                        onChange={() => updateFilter(f.value, !filterValues[f.value])}
                    />
                    </div>
                );
              case "select":
                return (
                  <SelectField
                    border
                    key={f.value}
                    placeholder={f.label}
                    value={filterValues[f.value] || ""}
                    onChange={(v: string) => updateFilter(f.value, v)}
                    items={f.options}
                  />
                );
              case "text":
                return (
                  <TextField
                    border
                    key={f.value}
                    placeholder={f.label}
                    value={filterValues[f.value] || ""}
                    onChange={(e) => updateFilter(f.value, e.target.value)}
                  />
                );
              case "date":
                return(
                  <DateField
                    container={document.getElementById("modal")}
                    border
                    onClear={()=>updateFilter(f.value, "")}
                    key={f.value}
                    placeholder={f.label}
                    value={filterValues[f.value] || ""}
                    onChange={data=>updateFilter(f.value, data)}
                  />
                )
            }
          })}
        </div>
        <Button styleType='filledTotal' onClick={btnClick}>{textBtn}</Button>
      </Panel>
    </div>
  );
};