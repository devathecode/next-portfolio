const Card = ({ children, redirectUrl, classes }: Readonly<{ children: React.ReactNode, redirectUrl?: string, classes?: string }>) => {
    const cardClass = `border border-gray-600 rounded-md p-7 cursor-pointer group ${classes}`
    return (
        <>
            {redirectUrl ? <a target="_blank" href={redirectUrl} className={cardClass}>{children}</a> : <div className={cardClass}>
                {children}
            </div>}
        </>
    )
}

export default Card;