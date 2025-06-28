// school_Admin/academic/NoticeForm.jsx
import React, { useEffect, useState } from "react";

const NoticeForm = ({ onClose, existing, onRefresh }) => {
  const [notice, setNotice] = useState(existing?.notice || "");
  const [linkType, setLinkType] = useState(existing?.link_type || "none");
  const [attachment, setAttachment] = useState(null);
  const [noticeURL, setNoticeURL] = useState(existing?.notice_url || "");
  const [status, setStatus] = useState(
    existing?.is_active ? "active" : "inactive"
  );
  const [classId, setClassId] = useState(existing?.class_id || "");
  const [sectionId, setSectionId] = useState(existing?.section_id || "");
  const [studentId, setStudentId] = useState(existing?.student_id || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("notice", notice);
    formData.append("link_type", linkType);
    formData.append("is_active", status === "active");

    if (linkType === "attachment") {
      formData.append("attachment", attachment);
    } else if (linkType === "url") {
      formData.append("notice_url", noticeURL);
    }

    if (classId) formData.append("class_id", classId);
    if (sectionId) formData.append("section_id", sectionId);
    if (studentId) formData.append("student_id", studentId);

    if (existing?.id) {
      // Update notice API
      console.log("Updating notice...", formData);
    } else {
      // Create notice API
      console.log("Creating new notice...", formData);
    }

    onRefresh();
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.header}>
          {existing ? "Edit Notice" : "Add New Notice"}
        </h3>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          style={styles.form}
        >
          {/* Notice Text */}
          <label style={styles.label}>* Notice:</label>
          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            required
            placeholder="Enter notice"
            style={styles.textarea}
          />

          {/* Link To */}
          <label style={styles.label}>* Link to:</label>
          <div style={styles.radioGroup}>
            <label>
              <input
                type="radio"
                checked={linkType === "none"}
                onChange={() => setLinkType("none")}
              />{" "}
              None
            </label>
            <label>
              <input
                type="radio"
                checked={linkType === "attachment"}
                onChange={() => setLinkType("attachment")}
              />{" "}
              Attachment
            </label>
            <label>
              <input
                type="radio"
                checked={linkType === "url"}
                onChange={() => setLinkType("url")}
              />{" "}
              URL
            </label>
          </div>

          {linkType === "url" && (
            <>
              <label style={styles.label}>Notice URL:</label>
              <input
                type="url"
                value={noticeURL}
                onChange={(e) => setNoticeURL(e.target.value)}
                placeholder="https://example.com"
                style={styles.input}
              />
            </>
          )}

          {linkType === "attachment" && (
            <>
              <label style={styles.label}>Attachment:</label>
              <input
                type="file"
                accept="*"
                onChange={(e) => setAttachment(e.target.files[0])}
                style={styles.input}
              />
            </>
          )}

          {/* Class/Section/Students */}
          <div style={styles.dropdownRow}>
            <div style={styles.dropdown}>
              <label>Class:</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                style={styles.input}
              >
                <option value="">All Classes</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
              </select>
            </div>
            <div style={styles.dropdown}>
              <label>Section:</label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                style={styles.input}
              >
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
            <div style={styles.dropdown}>
              <label>Students:</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={styles.input}
              >
                <option value="">All Students</option>
                <option value="1">Student 1</option>
                <option value="2">Student 2</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <label style={styles.label}>* Status:</label>
          <div style={styles.radioGroup}>
            <label>
              <input
                type="radio"
                checked={status === "active"}
                onChange={() => setStatus("active")}
              />{" "}
              Active
            </label>
            <label>
              <input
                type="radio"
                checked={status === "inactive"}
                onChange={() => setStatus("inactive")}
              />{" "}
              Inactive
            </label>
          </div>

          {/* Buttons */}
          <div style={styles.actions}>
            <button type="submit" style={styles.submitBtn}>
              {existing ? "Update" : "Add"}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    width: "90%",
    maxWidth: 700,
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  },
  header: {
    fontSize: "20px",
    marginBottom: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontWeight: "500", marginBottom: "4px" },
  textarea: {
    minHeight: 80,
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    fontSize: "14px",
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 6,
  },
  radioGroup: {
    display: "flex",
    gap: 20,
    marginBottom: 6,
  },
  dropdownRow: {
    display: "flex",
    gap: 16,
    marginTop: 10,
  },
  dropdown: {
    flex: 1,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 10,
  },
  submitBtn: {
    backgroundColor: "#5b21b6",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#e5e7eb",
    color: "#000",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default NoticeForm;
