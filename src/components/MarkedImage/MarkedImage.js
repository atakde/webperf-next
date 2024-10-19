import React, { useState, useRef, useEffect } from "react";
import Marker from "./Marker";

const MarkedImage = ({
  initialMarkers,
  imageUrl
}) => {
  const [markers, setMarkers] = useState(initialMarkers);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    const updateImgSize = () => {
      if (imgRef.current) {
        setImgSize({
          width: imgRef.current.offsetWidth,
          height: imgRef.current.offsetHeight,
        });
      }
    };

    updateImgSize();
    window.addEventListener("resize", updateImgSize);
    return () => window.removeEventListener("resize", updateImgSize);
  }, []);

  const addMarker = (e) => {
    const imgRect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    const yPercent = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    setMarkers([...markers, { xPercent, yPercent }]);
  };

  return (
    <div className="relative inline-block">
      <img
        src={imageUrl}
        alt="World"
        ref={imgRef}
        onClick={addMarker}
        style={{ width: "100%", height: "auto" }}
      />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          xPercent={marker.xPercent}
          yPercent={marker.yPercent}
          imgWidth={imgSize.width}
          imgHeight={imgSize.height}
        />
      ))}
    </div>
  );
};

export default MarkedImage;
