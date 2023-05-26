"use client";

import React, {useEffect, useState} from 'react';

const Imagepreload = (props: any) => {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && <div className={`${props.classes} bg-gray-500 absolute top-0 right-0 left-0 bottom-auto`}>loading..</div>}
            <img src={props.imgArr[0]} onLoad={() => setLoading(false)} className={`${props.classes}`} alt=""/>
        </>
    );
};

export default Imagepreload;