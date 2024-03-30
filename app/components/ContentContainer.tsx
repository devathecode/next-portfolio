import Header from "./Header";

const ContentContainer = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <div className="cpm">
            <Header />
            {children}
        </div>
    )
}

export default ContentContainer;