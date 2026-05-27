import { TabsProvider, useTabs } from "./TabsContext.jsx";

export const Tabs = ({ children, defaultIndex }) => {
  return <TabsProvider defaultIndex={defaultIndex}>{children}</TabsProvider>;
};

export const TabList = ({ children }) => {
  return (
    <div className="flex space-x-1">
      {children}
    </div>
  );
};

export const Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      className={`p-2 md:px-4 md:py-2 cursor-pointer border border-[#f2f2f2] relative top-[1px] 
        ${activeTab === index ? "bg-[#013879] text-white border-b-white" : "bg-[#f2f2f26b]"}
      `}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({ index, children }) => {
  const { activeTab } = useTabs();
  return activeTab === index ? (
    <div className="pt-4 md:p-3 md:min-w-[750px] bg-white">{children}</div>
  ) : null;
};
