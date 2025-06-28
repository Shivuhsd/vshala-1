// student/certificate/CertificateToolbar.jsx

import React from "react";

const CertificateToolbar = ({ onAddText, onAddImage, onUploadBackground }) => {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button
        onClick={() => onAddText()}
        style={{
          background: "#6B21A8",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ➕ Add Text
      </button>

      <label
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        🖼 Upload Image
        <input type="file" accept="image/*" onChange={onAddImage} hidden />
      </label>

      <label
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        📄 Upload Background
        <input
          type="file"
          accept="image/*"
          onChange={onUploadBackground}
          hidden
        />
      </label>
    </div>
  );
};

export default CertificateToolbar;
