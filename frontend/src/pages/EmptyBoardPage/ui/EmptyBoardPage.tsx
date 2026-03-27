import { Button, Panel, Plus, Typography } from "alex-evo-sh-ui-kit";
import { CreateDialog } from "../../../features/CreactTodoListDialog";
import { useState } from "react";
import './EmptyBoardPage.scss'

export function EmptyBoardPlaceholder() {

    const [visibleCreateDialog, setVisibleCreateDialog] = useState(false)
    
  return (
    <div className="empty-board-placeholder">
      <Panel className="empty-board-panel">
        <div className="empty-board-icon">
          <Plus size={"48"} />
        </div>
        <Typography type="title" className="empty-board-title">
          Выберите доску
        </Typography>
        <Typography type="body" className="empty-board-text">
          Пока доска не выбрана, задачи отображаться не будут.
        </Typography>
        <Button onClick={() => setVisibleCreateDialog(true)} className="empty-board-button">
          Создать доску
        </Button>
      </Panel>
      <CreateDialog
            open={visibleCreateDialog}
            hide={()=>setVisibleCreateDialog(false)}
        />
    </div>
  );
}