import Header from "./Header";

const ContentContainer = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      <div className="mt-16 lg:mt-24">{children}</div>
    </>
  );
};

export default ContentContainer;
