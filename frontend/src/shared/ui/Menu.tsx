import { Menu as M, type MenuStateProps } from "alex-evo-sh-ui-kit"

export const Menu = (props:MenuStateProps) => {

    return (<M container={document.getElementById("menu")} {...props}/>)
}