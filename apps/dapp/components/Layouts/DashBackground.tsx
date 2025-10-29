const GlowingBackground = ({ children }: { children?: React.ReactNode }) => {
    return (
      <div className="relative h-[402px] min-h-[402px] bg-black overflow-hidden w-full rounded-t-3xl">
        {/* Top Left Blue Glow */}
        <div className="absolute right-[90px] -bottom-[-90px] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(10,109,225,0.66),transparent_70%)] pointer-events-none" />
        {/* Bottom Center Purple Glow */}
        <div className="absolute bottom-[-310px] left-3/7 transform -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(118,84,254,0.6)_10%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  };
  
  export default GlowingBackground;
  