// /pages/school_Admin/student/CertificateCanvas.jsx
import React, { useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import ResizableText from "./ResizableText";

const CertificateCanvas = ({
  backgroundImage,
  elements,
  setElements,
  selectedId,
  setSelectedId,
}) => {
  const backgroundRef = useRef(null);

  // For drawing image with useImage (optional later)
  useEffect(() => {
    if (backgroundRef.current && backgroundImage) {
      const img = new window.Image();
      img.src = backgroundImage;
      img.onload = () => {
        backgroundRef.current.image(img);
        backgroundRef.current.getLayer().batchDraw();
      };
    }
  }, [backgroundImage]);

  const handleDrag = (id, e) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el
    );
    setElements(updated);
  };

  const handleChange = (updatedText) => {
    const updated = elements.map((el) =>
      el.id === updatedText.id ? updatedText : el
    );
    setElements(updated);
  };

  return (
    <Stage width={1000} height={700} className="border shadow-sm rounded">
      <Layer>
        {/* Background Image */}
        {backgroundImage && (
          <KonvaImage
            ref={backgroundRef}
            x={0}
            y={0}
            width={1000}
            height={700}
            alt="Certificate Background"
          />
        )}

        {/* Text Fields */}
        {elements.map((el) => (
          <ResizableText
            key={el.id}
            {...el}
            isSelected={el.id === selectedId}
            onSelect={() => setSelectedId(el.id)}
            onDrag={(e) => handleDrag(el.id, e)}
            onChange={handleChange}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default CertificateCanvas;
