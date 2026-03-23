import { SelectField as SF } from "alex-evo-sh-ui-kit";


export const SelectField = (props: any) => (
    <SF {...props} container={document.getElementById("menu")}/>
)