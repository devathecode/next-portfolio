const Loading = () => {
    return (
        <div className="h-screen w-screen absolute inset-0 z-[5000] text-center flex items-center justify-center">
            <div className="flex flex-col justify-center items-center">
                <div className="font-mono tracking-widest text-black/70 dark:text-white">
                    <span className="text-base sm:text-lg md:text-2xl font-semibold">De</span>
                    <span
                        className="italic text-4xl text-yellow-600">V</span>
                    <span className="text-base sm:text-lg md:text-2xl font-semibold">anshu</span>
                </div>
                <div className="my-6">
                    <div className='flex space-x-2 justify-center items-center '>
                        <span className='sr-only'>Loading...</span>
                        <div className='h-6 w-6 bg-black dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                        <div className='h-6 w-6 bg-black dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                        <div className='h-6 w-6 bg-black dark:bg-white rounded-full animate-bounce'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading;