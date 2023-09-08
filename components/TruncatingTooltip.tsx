import { truncateAmount } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

const TruncatingTooltip = (props: { num: string }) => {
  const truncated = truncateAmount(props.num);
  console.log(truncated);
  return (
    <Tooltip>
      <TooltipTrigger>
        {truncated}
        {truncated.includes(".") && props.num !== truncated && <>&hellip;</>}
      </TooltipTrigger>
      <TooltipContent variant="light">{props.num}</TooltipContent>
    </Tooltip>
  );
};

export default TruncatingTooltip;
