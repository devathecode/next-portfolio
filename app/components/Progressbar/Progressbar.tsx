"use client";

import React, {useEffect, useState} from 'react';

const Progressbar = (props: any) => {
    const [style, setStyle] = useState({});
    // label of counter
    // number to increment to
    // duration of count in seconds
    const {percentage } = props.data

    // number displayed by component
    const [count, setCount] = useState("0")
    setTimeout(() => {
        const newStyle = {
            opacity: 1,
            width: `${props.data.percentage}%`
        }

        setStyle(newStyle);
    }, 200);

    useEffect(() => {
        let start = 0;
        // first three numbers from props
        const end = parseInt(percentage.substring(0,3))
        // if zero, return
        if (start === end) return;
        let timer = setInterval(() => {
            start += 1;
            setCount(String(start) + percentage.substring(3))
            if (start === end) clearInterval(timer)
        }, 15);

        // dependency array
    }, [percentage, '2']);
    return (
        <>
            <div className="text-white my-2 flex justify-between">
                <div>
                    <p className="text-xl md:text-2xl font-bold">{props.data.title} </p>
                    <p className="text-xs tracking-widest text-gray-400">{props.data.experience}+ year experience</p>
                </div>
                <p className={`text-lg md:text-xl font-bold text-yellow-600 font-bold transition-all ease-in duration-700 my-auto`}>{count} %</p>
            </div>
            <div className='h-2 w-full bg-white'>
                <div
                    style={style}
                    className={`h-full bg-yellow-600 flex items-center transition-all ease-in-out duration-1000 opacity-0 w-0`}>
                    <span className="text-xs ml-2 text-white"></span>
                </div>
            </div>
        </>
    );
};

export default Progressbar;