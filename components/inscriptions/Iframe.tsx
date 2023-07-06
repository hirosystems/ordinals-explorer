import { cn } from "../../lib/utils";

const Iframe = (props: { src: string; className?: string }) => {
  return (
    <iframe
      src={props.src}
      className={cn("aspect-square w-full border-none", props.className)}
      loading="lazy"
      sandbox="allow-scripts"
    />
  );
};

export default Iframe;
