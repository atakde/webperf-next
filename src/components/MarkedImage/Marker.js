const Marker = ({ xPercent, yPercent, imgWidth, imgHeight }) => {
  const x = (xPercent / 100) * imgWidth;
  const y = (yPercent / 100) * imgHeight;

  return (
    <div
      className={`flex absolute items-center justify-center`}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        width: "16px",
        height: "16px",
      }}
    >
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
    </div>
  );
};

export default Marker;
