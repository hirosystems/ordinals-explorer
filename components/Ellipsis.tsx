const Ellipsis = ({ text, size = 6 }: { text: string; size?: number }) => {
  // todo: add tooltip to show full address and add trailing copy to clipboard button
  // todo: do this in a wrapper component called e.g. "address"
  return (
    <span>
      {text.slice(0, size)}&hellip;{text.slice(-size)}
    </span>
  );
};

export default Ellipsis;
