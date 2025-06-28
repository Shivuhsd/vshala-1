// school_Admin/academic/NoticeBoard.jsx
import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";
import NoticeForm from "./NoticeForm";
import { format } from "date-fns";

// Replace with real API
const getNotices = async () => [
  {
    id: 1,
    notice: "Important: Mid-Term Examination Schedule Updated",
    link_type: "attachment",
    attachment_url: "#",
    notice_url: "",
    is_active: true,
    date: "2025-06-24",
    added_by: "Admin",
  },
];

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = notices.filter((n) =>
      n.notice.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [searchTerm, notices]);

  const fetchData = async () => {
    const data = await getNotices();
    setNotices(data);
  };

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedNotice(null);
    setShowForm(true);
  };

  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Notice Board</h2>
        <button style={styles.addButton} onClick={handleAddNew}>
          <FiPlus size={16} /> Add Notice
        </button>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.entryLabel}>Showing {rowsPerPage} entries</div>
        <div style={styles.searchBar}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Notice</th>
            <th style={styles.th}>Link</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Added By</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>{item.notice}</td>
                <td style={styles.td}>
                  {item.link_type === "attachment" ? (
                    <a href={item.attachment_url} target="_blank" rel="noreferrer">
                      <FaFileAlt size={18} color="#4f46e5" />
                    </a>
                  ) : item.link_type === "url" ? (
                    <a href={item.notice_url} target="_blank" rel="noreferrer" style={styles.urlLink}>
                      Visit
                    </a>
                  ) : (
                    <span style={styles.dimText}>None</span>
                  )}
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: item.is_active ? "#d1fae5" : "#fef2f2",
                      color: item.is_active ? "#065f46" : "#991b1b",
                    }}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={styles.td}>{format(new Date(item.date), "dd MMM yyyy")}</td>
                <td style={styles.td}>{item.added_by}</td>
                <td style={styles.td}>
                  <button style={styles.editButton} onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={styles.noData} colSpan="6">
                No notices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={styles.pageBtn}
        >
          Previous
        </button>
        <span style={styles.pageNumber}>{currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((p) =>
              p * rowsPerPage < filtered.length ? p + 1 : p
            )
          }
          disabled={currentPage * rowsPerPage >= filtered.length}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <NoticeForm
          onClose={() => setShowForm(false)}
          existing={selectedNotice}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "10px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
  },
  addButton: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  entryLabel: {
    fontSize: "14px",
    color: "#4b5563",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "#f9fafb",
    borderRadius: "6px",
    padding: "6px 12px",
    border: "1px solid #e5e7eb",
  },
  searchIcon: {
    marginRight: "6px",
    color: "#6b7280",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#111827",
    width: "180px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#374151",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "top",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  urlLink: {
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "underline",
  },
  dimText: {
    color: "#9ca3af",
  },
  editButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
  },
  pagination: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    gap: "12px",
  },
  pageBtn: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
  },
  pageNumber: {
    fontSize: "15px",
    fontWeight: "500",
    padding: "4px 8px",
    color: "#111827",
  },
  noData: {
    textAlign: "center",
    padding: "24px",
    color: "#6b7280",
    fontSize: "15px",
  },
};

export default NoticeBoard;
