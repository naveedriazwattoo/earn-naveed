"use client";
const PageLayout = ({
  children,
  className,
  visible = false,
}: {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full ">
      {/* <div className="rounded-t-full h-full w-full"> */}
      <div
        className={`h-screen w-full p-t-[1px] rounded-t-3xl bg-gradient-to-r from-[#7D0BF4] via-[#1A26E7] to-[#0D4BEF] ${className} ${
          visible ? "" : "invisible"
        }`}
      >
        <div className="flex flex-col h-full mt-[1px] w-full bg-black rounded-t-3xl">
          {children}
        </div>
      </div>
      {/* </div> */}
    </main>

  );
};

export default PageLayout;
