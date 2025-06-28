import React, { useEffect, useRef } from "react";
import { Text, Image, Transformer } from "react-konva";
import useImage from "use-image";

const ResizableTextImage = ({ el, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(el.src || "");

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {el.type === "text" ? (
        <Text
          ref={shapeRef}
          {...el}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) =>
            onChange({ ...el, x: e.target.x(), y: e.target.y() })
          }
          onTransformEnd={() => {
            const node = shapeRef.current;
            onChange({
              ...el,
              x: node.x(),
              y: node.y(),
              fontSize: node.fontSize() * node.scaleY(),
              scaleX: 1,
              scaleY: 1,
            });
          }}
        />
      ) : (
        <Image
          ref={shapeRef}
          image={img}
          {...el}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) =>
            onChange({ ...el, x: e.target.x(), y: e.target.y() })
          }
          onTransformEnd={() => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...el,
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }}
        />
      )}
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default ResizableTextImage;
