const Iframe = ({ src }: { src: string }) => {
  // todo: look into iframe caching
  return (
    <iframe
      src={src}
      className="w-full rounded-[4px] aspect-square pointer-events-none border-none"
      // loading="lazy"
      sandbox="allow-scripts"
      scrolling="no"
    ></iframe>
  );
};

export default Iframe;
