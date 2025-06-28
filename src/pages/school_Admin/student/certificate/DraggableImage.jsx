// student/certificate/DraggableImage.jsx
import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const DraggableImage = ({ el, isSelected, onDragEnd, onClick }) => {
  const [image] = useImage(el.src);

  return (
    <Image
      image={image}
      x={el.x}
      y={el.y}
      width={el.width}
      height={el.height}
      draggable
      onDragEnd={(e) => onDragEnd(e, el.id)}
      onClick={() => onClick(el.id)}
      stroke={isSelected ? "#9333EA" : ""}
      strokeWidth={isSelected ? 1 : 0}
    />
  );
};

export default DraggableImage;
