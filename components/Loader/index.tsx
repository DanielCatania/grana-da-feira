import "./style.css";
import React from "react";

export default function Loader() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}
