import React, { useRef, useEffect, useState } from "react";

import { IconContext } from "react-icons";
import { IoCaretForwardCircle } from 'react-icons/io5';


export default function SidePanel() {

    const [expanded, setExpanded] = useState(true);

    return <div className={`SidePanel ${(expanded) ? "expanded" : ""}`}>
        <button className={'button toggle icon'} onClick={() => setExpanded(!expanded)}>
            <IconContext.Provider value={{size: '4em'}}>
                <IoCaretForwardCircle />
            </IconContext.Provider>
        </button>
    </div>
}
