const Iframe = ({ src }: { src: string }) => {
  // todo: look into iframe caching
  return (
    <iframe
      src={src}
      className="w-full h-full pointer-events-none border-none"
      // loading="lazy"
      sandbox="allow-scripts"
      scrolling="no"
    />
  );
};

export default Iframe;
