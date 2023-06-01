import { cn } from "../../lib/helpers";

const Iframe = (props: { src: string; className?: string }) => {
  return (
    <iframe
      src={props.src}
      className={cn(
        "pointer-events-none aspect-square h-full w-full border-none",
        props.className
      )}
      loading="lazy"
      sandbox="allow-scripts"
      scrolling="no"
    />
  );
};

export default Iframe;
