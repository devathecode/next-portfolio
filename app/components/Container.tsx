"use client";

import {motion} from 'framer-motion';
import React from 'react';

const Container = (props: any) => {
    return (
        <motion.div initial={{x: 100}}
                    animate={{x: 0}}
                    exit={{x: 0}}
                    transition={{duration: 0.5}}
                    className="mt-32 md:mt-6 px-2 sm:px-12 py-3 sm:py-4 2xl:px-40 md:py-5 lg:py-6">
            {props.children}
        </motion.div>
    );
};

export default Container;