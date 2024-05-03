import Header from "./Header";

const ContentContainer = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <>
            <Header />
            <div className="cpm">
                {children}
            </div>
        </>
    )
}

export default ContentContainer;