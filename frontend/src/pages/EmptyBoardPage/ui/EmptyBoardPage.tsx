import { Button, Panel, Plus, Typography } from "alex-evo-sh-ui-kit";
import { CreateDialog } from "../../../features/CreactTodoListDialog";
import { useState } from "react";
import './EmptyBoardPage.scss'
import { useTranslation } from "react-i18next";

export function EmptyBoardPlaceholder() {

    const [visibleCreateDialog, setVisibleCreateDialog] = useState(false)
    const {t} = useTranslation()
    
  return (
    <div className="empty-board-placeholder">
      <Panel className="empty-board-panel">
        <div className="empty-board-icon">
          <Plus size={"48"} />
        </div>
        <Typography type="title" className="empty-board-title">
          {t("empty-board-high")}
        </Typography>
        <Typography type="body" className="empty-board-text">
          {t("empty-board-text")}
        </Typography>
        <Button onClick={() => setVisibleCreateDialog(true)} className="empty-board-button">
          {t("empty-board-btn")}
        </Button>
      </Panel>
      <CreateDialog
            open={visibleCreateDialog}
            hide={()=>setVisibleCreateDialog(false)}
        />
    </div>
  );
}