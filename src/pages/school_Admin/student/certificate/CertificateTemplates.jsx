import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTemplates } from "./certificateUtils";
import { FiPlusCircle } from "react-icons/fi";

const CertificateTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTemplates(getAllTemplates());
  }, []);

  const handleUseTemplate = (templateId) => {
    localStorage.setItem("selectedCertificateTemplate", templateId);
    navigate("/school-admin/student/certificate/designer");
  };

  const handleCreateNew = () => {
    navigate("/school-admin/student/certificate/designer");
  };

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px", color: "#1F2937" }}>
          Saved Certificate Templates
        </h2>

        <button
          onClick={handleCreateNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#6B21A8",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            fontWeight: 500,
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <FiPlusCircle size={18} /> New Template
        </button>
      </div>

      {/* Empty State */}
      {templates.length === 0 ? (
        <div
          style={{
            marginTop: 80,
            textAlign: "center",
            color: "#64748B",
            padding: "40px",
            borderRadius: "12px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: 12 }}>😔</div>
          <h3 style={{ margin: "0 0 8px", color: "#334155" }}>
            No Certificate Templates Found
          </h3>
          <p style={{ fontSize: "15px", marginBottom: 20 }}>
            You haven't created any certificate templates yet.
          </p>
          <button
            onClick={handleCreateNew}
            style={{
              background: "#6B21A8",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Create Your First Template
          </button>
        </div>
      ) : (
        // Grid Layout
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {templates.map((template) => (
            <div
              key={template.id}
              style={{
                background: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                border: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "all 0.3s",
              }}
            >
              {/* Image */}
              <img
                src={template.background}
                alt="Certificate Background"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderBottom: "1px solid #E5E7EB",
                }}
              />

              {/* Content */}
              <div
                style={{
                  padding: "16px 20px",
                  flex: 1,
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1E293B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={template.name}
                >
                  {template.name}
                </h4>
              </div>

              {/* Action */}
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid #F1F5F9",
                  background: "#F9FAFB",
                  textAlign: "right",
                }}
              >
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  style={{
                    background: "#6B21A8",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateTemplates;
