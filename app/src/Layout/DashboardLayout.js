import { useState } from "react";

import { SideBar, RNavbar, Footer } from "../components/UiComponents";
import "../css/layout/layout.scss";

const DashboardLayout = ({ children }) => {

  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <>
      <div className="layout">
        <SideBar isOpen={isOpen} />
        <div style={{ width: "100%", paddingBottom: 50 }}>
          <RNavbar setIsOpen={setIsOpen} isOpen={isOpen} />
          {children}
          <Footer isOpen={isOpen} />
        </div>
      </div>
    </>
  );
};
export default DashboardLayout;
