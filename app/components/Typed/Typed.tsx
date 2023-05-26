"use client";

import React from 'react';
import Typewriter from "typewriter-effect";

const Typed = () => {
    return (
        <>
            <Typewriter
                options={{
                    skipAddStyles: true,
                    strings: ["I'm Devanshu Verma!", "I'm a Frontend Developer."],
                    autoStart: true,
                    loop: true,
                }}
            />
        </>
    );
};

export default Typed;