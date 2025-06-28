// student/certificate/CertificateCanvas.jsx

import React, { useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";

// image component with Transformer
const DraggableImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const [image] = useImage(shapeProps.src);
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        draggable
        onClick={() => onSelect(shapeProps.id)}
        onTap={() => onSelect(shapeProps.id)}
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(40, node.width() * scaleX),
            height: Math.max(40, node.height() * scaleY),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

const CertificateCanvas = ({
  backgroundImage,
  backgroundColor = "#ffffff", // NEW
  elements,
  setElements,
  selectedId,
  setSelectedId,
  canvasSize,
}) => {
  const [bg] = useImage(backgroundImage);

  const handleSelect = (id) => setSelectedId(id);
  const handleDrag = (id, attrs) =>
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...attrs } : el))
    );

  return (
    <Stage
      width={canvasSize.width}
      height={canvasSize.height}
      style={{
        margin: "0 auto",
        boxShadow: "0 0 12px rgba(0,0,0,0.05)",
      }}
    >
      <Layer>
        {/* solid background */}
        <Rect
          x={0}
          y={0}
          width={canvasSize.width}
          height={canvasSize.height}
          fill={backgroundColor}
        />

        {/* background image (if any) */}
        {bg && (
          <KonvaImage
            image={bg}
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
          />
        )}

        {/* dynamic elements */}
        {elements.map((el) => {
          if (el.type === "text") {
            // combine bold/italic into one fontStyle string
            const styleParts = [];
            if (el.bold) styleParts.push("bold");
            if (el.italic) styleParts.push("italic");
            const fontStyle = styleParts.join(" ") || "normal";

            return (
              <Text
                key={el.id}
                text={el.text}
                x={el.x}
                y={el.y}
                fontSize={el.fontSize}
                fontFamily={el.fontFamily}
                fill={el.color}
                fontStyle={fontStyle} // ← bold/italic combo
                textDecoration={el.underline ? "underline" : ""} // underline
                draggable
                onClick={() => handleSelect(el.id)}
                onTap={() => handleSelect(el.id)}
                onDragEnd={(e) =>
                  handleDrag(el.id, { x: e.target.x(), y: e.target.y() })
                }
              />
            );
          } else if (el.type === "image") {
            return (
              <DraggableImage
                key={el.id}
                shapeProps={el}
                isSelected={selectedId === el.id}
                onSelect={handleSelect}
                onChange={(attrs) => handleDrag(el.id, attrs)}
              />
            );
          }
          return null;
        })}
      </Layer>
    </Stage>
  );
};

export default CertificateCanvas;
