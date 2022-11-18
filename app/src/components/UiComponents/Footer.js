import React from "react";

import "../../css/footer/footer.scss";

const Footer = ({ isOpen }) => (
  <footer className="page-footer font-small blue pt-4">
    <div className="footer-copyright text-center py-3 footer-wrapper">
      <div
        style={{
          textAlign: "center",
          width: isOpen ? "calc(100% - 250px)" : "100%",
        }}
      >
        {" "}
        © 2022 Copyright: TeamUp
      </div>
    </div>
  </footer>
);

export default Footer;
