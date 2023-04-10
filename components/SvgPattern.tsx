export default function SvgPattern({
  height = 512,
  fh = 0.1,
  fw = 0.1,
}: {
  height?: number;
  fh?: number;
  fw?: number;
}) {
  return (
    <svg height={height} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="Pattern" x="0" y="0" width={fw} height={fh}>
          <circle cx="8" cy="8" r="8" fill="black" />
        </pattern>
      </defs>

      <rect fill="url(#Pattern)" width="100%" height={height} />
    </svg>
  );
}
