"use client";

import React, { useState } from 'react';
import Imageslider from "../Imageslider/Imageslider";
import Image from "next/image";


const Projectcard = (props: any) => {
    const images = props.modalImageArr;
    const heading = props.projectName;
    const cardImage = props.cardImage;
    const desc = props.desc;
    const url = props.url;
    const note = props.note;
    const [showModal, setShowModal] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const prevImage = () => {
        setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
    };

    const nextImage = () => {
        setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1);
    };
    return (
        <div className="overflow-hidden">
            {/* <div
                className="cursor-pointer group hover:scale-110 hover:my-4 lg:hover:my-0 transition-all ease-in-out duration-700 relative">
                <Image src={cardImage}
                    width="384"
                    height="320"
                    className="group-hover:mix-blend-luminosity object-cover h-80 w-96 group-hover:opacity-10 scale-150"
                    alt={`banner-${heading}`} />
                <div
                    className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 text-center opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500">
                    <h1 className="text-2xl font-semibold text-yellow-600 uppercase tracking-widest">{heading}</h1>
                    <h3 className="text-sm mb-2 text-white">React + Tailwind</h3>
                    <button
                        onClick={() => {
                            setShowModal(true)
                        }}
                        className="w-40 border-2 border-yellow-600 px-3 py-1 transition-all ease-in-out delay-75 duration-700 text-white hover:bg-yellow-600">
                        Learn more
                    </button>
                </div>
            </div> */}

            <div className="group relative cursor-pointer items-center justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30">
                <div className="h-[32rem] w-full">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125"
                        src={cardImage} alt="" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70"></div>
                <div className="absolute inset-0 flex translate-y-[60%] flex-col items-center justify-center px-9 text-center transition-all duration-500 group-hover:translate-y-0 group-hover:bg-black/60 text-white group-hover:text-primary-500">
                    <div className="font-dmserif text-3xl font-bold mb-40 group-hover:mb-2 flex flex-col justify-center items-center">
                        <h1>{heading}</h1>
                        <div className="relative w-16 h-6 animate-bounce mt-10 group-hover:hidden z-10">
                            <svg className="absolute bottom-0 left-0 fill-current text-white -rotate-90" viewBox="0 0 24 24">
                                <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>
                            </svg>
                        </div>
                    </div>

                    <p className="mb-3 text-lg italic opacity-0 transition-opacity duration-300 group-hover:opacity-100 line-clamp-2">{desc}</p>
                    <button
                        onClick={() => {
                            setShowModal(true)
                        }}
                        className="w-40 border-2 border-yellow-600 px-3 py-1 transition-all ease-in-out delay-75 duration-700 text-white hover:bg-yellow-600">
                        Learn more
                    </button>
                </div>
            </div>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-4xl">
                            {/*content*/}
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="relative h-[30rem] m-1 group">
                                    {images.map((image: any, index: any) => (
                                        <Imageslider
                                            key={image.id}
                                            imageUrl={image.imageUrl}
                                            caption={image.caption}
                                            currentImage={currentImage}
                                            index={index}
                                        />
                                    ))}
                                    <div
                                        className="absolute top-1/2 -mt-6 left-0 right-0 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={prevImage}
                                            className="bg-gray-200 py-2 text-gray-500 px-2 rounded-r-2xl text-2xl">
                                            {`<`}
                                        </button>
                                    </div>
                                    <div
                                        className="absolute top-1/2 -mt-6 right-0 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-700">
                                        <button
                                            onClick={nextImage}
                                            className="bg-gray-200 py-2 text-gray-500 px-2 rounded-l-2xl text-2xl">
                                            {`>`}
                                        </button>
                                    </div>
                                </div>
                                {/*body*/}
                                <div className="relative px-6 flex-auto">
                                    <span
                                        className="mt-4 text-slate-700 text-3xl leading-relaxed border-b-4 border-yellow-600 tracking-wider">{heading} Website</span>
                                    <p className="my-4 text-slate-400 text-sm leading-relaxed">
                                        {desc}
                                    </p>
                                    {note != undefined && <div className="mb-4 text-lg">
                                        <span className="font-bold tracking-widest text-red-600 underline">NOTE</span>
                                        <span className="text-green-600"> : {note}</span>
                                    </div>}
                                </div>
                                {/*footer*/}
                                <div
                                    className="flex items-center justify-between p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        onClick={() => window.open(`${url}`, '_blank')}
                                        className="order-last tracking-widest text-white w-32 group bg-yellow-600 hover:bg-yellow-700 font-bold uppercase px-6 py-2 text-sm"
                                        type="button">
                                        Visit
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="order-first tracking-widest text-red-600 border border-red-600 w-32 group bg-white hover:bg-red-700 hover:text-white
                                         font-bold uppercase px-6 py-2 text-sm text-center transition-all ease-in-out duration-500">close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>
    );
};

export default Projectcard;