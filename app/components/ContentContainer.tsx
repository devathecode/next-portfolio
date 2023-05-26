"use client";

import React, {useState} from 'react';
import Header from "@/app/components/Header";

const ContentContainer = (props: any) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`${open && 'h-screen overflow-hidden'} font-serif`}>
            <Header handleSubMenuOpen={setOpen}/>
            {props.children}
        </div>
    );
};

export default ContentContainer;