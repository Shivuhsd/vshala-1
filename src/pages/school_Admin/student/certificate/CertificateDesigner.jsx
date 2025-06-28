// student/certificate/CertificateDesigner.jsx

import React, { useEffect, useState, useRef } from "react";
import CertificateCanvas from "./CertificateCanvas";
import CertificateToolbar from "./CertificateToolbar";
import { saveTemplateToLocal, getTemplateById } from "./certificateUtils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CertificateDesigner = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // NEW
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 850 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef();

  // load from localStorage if needed
  useEffect(() => {
    const id = localStorage.getItem("selectedCertificateTemplate");
    if (id) {
      const tpl = getTemplateById(id);
      if (tpl) {
        // stored background might be a color or an image URL
        if (tpl.background.startsWith("#")) {
          setBackgroundColor(tpl.background);
        } else {
          setBackgroundImage(tpl.background);
        }
        setElements(tpl.elements);
      }
      localStorage.removeItem("selectedCertificateTemplate");
    }
  }, []);

  const handleAddText = (placeholder = "") => {
    setElements((prev) => [
      ...prev,
      {
        id: `text-${Date.now()}`,
        type: "text",
        text: placeholder || "Sample Text",
        x: 100,
        y: 100,
        fontSize: 24,
        fontFamily: "Arial",
        color: "#000000",
        bold: false,
        italic: false,
        underline: false,
      },
    ]);
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setElements((prev) => [
        ...prev,
        {
          id: `img-${Date.now()}`,
          type: "image",
          src,
          x: 150,
          y: 150,
          width: 150,
          height: 150,
        },
      ]);
    }
  };

  const handleUploadBackground = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(URL.createObjectURL(file));
    }
  };

  const handleBackgroundColorChange = (e) => {
    setBackgroundColor(e.target.value);
    setBackgroundImage(null); // clear any image background
  };

  const handleDeleteElement = () => {
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return alert("Enter a template name");
    if ((!backgroundImage && !backgroundColor) || elements.length === 0) {
      return alert(
        "Add a background (color or image) and at least one element"
      );
    }
    saveTemplateToLocal({
      name: templateName,
      background: backgroundImage || backgroundColor,
      elements,
    });
    alert("Template saved!");
    setShowSaveModal(false);
    setTemplateName("");
  };

  const handleCanvasSizeChange = (e) => {
    const v = e.target.value;
    if (v === "A4_L") setCanvasSize({ width: 1200, height: 850 });
    else if (v === "A4_P") setCanvasSize({ width: 850, height: 1200 });
    else if (v === "Custom") {
      const w = parseInt(prompt("Width in px:"), 10);
      const h = parseInt(prompt("Height in px:"), 10);
      if (!isNaN(w) && !isNaN(h)) setCanvasSize({ width: w, height: h });
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation:
        canvasSize.width > canvasSize.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvasSize.width, canvasSize.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvasSize.width, canvasSize.height);
    pdf.save(`${templateName || "certificate"}.pdf`);
  };

  const toggleTextStyle = (key) => {
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, [key]: !el[key] } : el))
    );
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div style={{ padding: 24, background: "#F3F4F6", minHeight: "100vh" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <select onChange={handleCanvasSizeChange} style={{ padding: 8 }}>
          <option value="A4_L">A4 Landscape</option>
          <option value="A4_P">A4 Portrait</option>
          <option value="Custom">Custom Size</option>
        </select>

        <CertificateToolbar
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          onUploadBackground={handleUploadBackground}
        />

        {/* background‐color picker */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <label htmlFor="bg-color">Bg Color:</label>
          <input
            id="bg-color"
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
          />
        </div>

        <select
          onChange={(e) => handleAddText(e.target.value)}
          defaultValue=""
          style={{ padding: 8 }}
        >
          <option disabled value="">
            Insert Placeholder
          </option>
          <option value="{{student_name}}">Student Name</option>
          <option value="{{course}}">Course</option>
          <option value="{{issue_date}}">Issue Date</option>
          <option value="{{school_name}}">School Name</option>
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label>Zoom:</label>
          <input
            type="range"
            min="0.3"
            max="1.5"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
          />
          <span>{zoom.toFixed(1)}×</span>
        </div>

        <button
          onClick={() => setShowSaveModal(true)}
          style={{
            marginLeft: "auto",
            background: "#6B21A8",
            color: "#fff",
            padding: "8px 14px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          💾 Save
        </button>
        <button
          onClick={handleExportPDF}
          style={{
            background: "#3B82F6",
            color: "#fff",
            padding: "8px 14px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          📄 Export PDF
        </button>
      </div>

      {/* Editor */}
      <div style={{ display: "flex", gap: 24 }}>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: 12,
            background: "#CBD5E1",
            maxHeight: "calc(100vh - 220px)",
          }}
        >
          <div
            ref={canvasRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: canvasSize.width,
              height: canvasSize.height,
              margin: "auto",
            }}
          >
            <CertificateCanvas
              backgroundImage={backgroundImage}
              backgroundColor={backgroundColor}
              elements={elements}
              setElements={setElements}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              canvasSize={canvasSize}
            />
          </div>
        </div>

        {/* Properties Panel */}
        {selectedElement?.type === "text" && (
          <div
            style={{
              width: 320,
              background: "#FFF",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <h4>Edit Text</h4>
            <label>Text:</label>
            <input
              value={selectedElement.text}
              onChange={(e) =>
                setElements((prev) =>
                  prev.map((el) =>
                    el.id === selectedId ? { ...el, text: e.target.value } : el
                  )
                )
              }
              style={{ width: "100%", marginBottom: 10 }}
            />

            <label>Font Size:</label>
            <input
              type="number"
              value={selectedElement.fontSize}
              onChange={(e) =>
                setElements((prev) =>
                  prev.map((el) =>
                    el.id === selectedId
                      ? { ...el, fontSize: +e.target.value }
                      : el
                  )
                )
              }
              style={{ width: "100%", marginBottom: 10 }}
            />

            <label>Font Family:</label>
            <select
              value={selectedElement.fontFamily}
              onChange={(e) =>
                setElements((prev) =>
                  prev.map((el) =>
                    el.id === selectedId
                      ? { ...el, fontFamily: e.target.value }
                      : el
                  )
                )
              }
              style={{ width: "100%", marginBottom: 10 }}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
            </select>

            <label>Color:</label>
            <input
              type="color"
              value={selectedElement.color}
              onChange={(e) =>
                setElements((prev) =>
                  prev.map((el) =>
                    el.id === selectedId ? { ...el, color: e.target.value } : el
                  )
                )
              }
              style={{ marginBottom: 10 }}
            />

            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <button
                onClick={() => toggleTextStyle("bold")}
                style={{
                  flex: 1,
                  background: "#E0E7FF",
                  border: "none",
                  padding: 8,
                }}
              >
                B
              </button>
              <button
                onClick={() => toggleTextStyle("italic")}
                style={{
                  flex: 1,
                  background: "#E0E7FF",
                  border: "none",
                  padding: 8,
                }}
              >
                I
              </button>
              <button
                onClick={() => toggleTextStyle("underline")}
                style={{
                  flex: 1,
                  background: "#E0E7FF",
                  border: "none",
                  padding: 8,
                }}
              >
                U
              </button>
            </div>

            <button
              onClick={handleDeleteElement}
              style={{
                background: "#DC2626",
                color: "#fff",
                border: "none",
                padding: 10,
                width: "100%",
                borderRadius: 4,
              }}
            >
              Delete Element
            </button>
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 10,
              width: 400,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h3>Save Template</h3>
            <input
              type="text"
              value={templateName}
              placeholder="Template Name"
              onChange={(e) => setTemplateName(e.target.value)}
              style={{ padding: 8, width: "100%", marginTop: 10 }}
            />
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                onClick={handleSaveTemplate}
                style={{
                  flex: 1,
                  background: "#10B981",
                  color: "#fff",
                  padding: 10,
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  flex: 1,
                  background: "#9CA3AF",
                  color: "#fff",
                  padding: 10,
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDesigner;
