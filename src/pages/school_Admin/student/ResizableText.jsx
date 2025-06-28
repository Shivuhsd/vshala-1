// /pages/school_Admin/student/ResizableText.jsx
import React, { useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";

const ResizableText = ({
  id,
  text,
  x,
  y,
  fontSize,
  fill,
  fontFamily = "Arial",
  isSelected,
  onSelect,
  onDrag,
  onChange,
}) => {
  const textRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={textRef}
        text={text}
        x={x}
        y={y}
        fontSize={fontSize}
        fill={fill}
        fontFamily={fontFamily}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={onDrag}
        onTransformEnd={(e) => {
          const node = textRef.current;
          const scaleX = node.scaleX();

          onChange({
            id,
            text,
            x: node.x(),
            y: node.y(),
            fontSize: node.fontSize() * scaleX,
            fill,
            fontFamily,
          });

          // Reset scale so resizing doesn’t accumulate
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ResizableText;
