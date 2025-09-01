const MobileLayout = ({ children }) => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100 overflow-hidden object-contain">
      <div className="w-full max-w-sm bg-[#FAFAFA] shadow-lg p-0">
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;