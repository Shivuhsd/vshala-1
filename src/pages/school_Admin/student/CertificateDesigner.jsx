import React, { useState } from "react";
import CertificateCanvas from "./CertificateCanvas";
import { FiImage, FiPlus, FiSave } from "react-icons/fi";

const CertificateDesigner = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const selectedElement = elements.find((el) => el.id === selectedId);

  const updateSelectedElement = (updatedFields) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId ? { ...el, ...updatedFields } : el
      )
    );
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBackgroundImage(url);
  };

  const handleAddText = () => {
    const newId = `text-${Date.now()}`;
    setElements([
      ...elements,
      {
        id: newId,
        text: "Sample Text",
        x: 100,
        y: 100,
        fontSize: 20,
        fontFamily: "Arial",
        fill: "#000000",
        placeholder: "",
      },
    ]);
    setSelectedId(newId);
  };

  const handleSaveTemplate = () => {
    const templateData = {
      backgroundImage,
      elements,
    };
    console.log("Saving template: ", templateData);
    // axios.post("/api/templates", templateData)
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
        {/* Controls Panel */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow border h-fit">
          <h3 className="text-lg font-semibold mb-3 text-purple-700">Tools</h3>

          {/* Upload + Add */}
          <div className="flex flex-col gap-3 mb-4">
            <label className="cursor-pointer bg-purple-100 text-purple-700 px-3 py-1 rounded flex items-center gap-2">
              <FiImage />
              Upload Background
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleAddText}
              className="bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FiPlus />
              Add Text
            </button>

            <button
              onClick={handleSaveTemplate}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FiSave />
              Save Template
            </button>
          </div>

          {/* Element Properties */}
          {selectedElement && (
            <>
              <h4 className="text-md font-semibold text-gray-600 mb-2">
                Selected Field
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Text / Placeholder
                  </label>
                  <input
                    type="text"
                    value={selectedElement.text}
                    onChange={(e) =>
                      updateSelectedElement({ text: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Font Size
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={72}
                    value={selectedElement.fontSize}
                    onChange={(e) =>
                      updateSelectedElement({
                        fontSize: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">
                    {selectedElement.fontSize}px
                  </span>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Font Color
                  </label>
                  <input
                    type="color"
                    value={selectedElement.fill}
                    onChange={(e) =>
                      updateSelectedElement({ fill: e.target.value })
                    }
                    className="w-full h-8 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Font Family
                  </label>
                  <select
                    value={selectedElement.fontFamily}
                    onChange={(e) =>
                      updateSelectedElement({ fontFamily: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Canvas */}
        <div className="lg:col-span-4">
          <CertificateCanvas
            backgroundImage={backgroundImage}
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateDesigner;
