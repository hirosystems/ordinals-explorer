import ReactTimeAgo from "react-time-ago";
import JsTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { forwardRef } from "react";

type TimeAgoProps = React.ComponentProps<typeof ReactTimeAgo>;

JsTimeAgo.addDefaultLocale(en);

const TimeAgo = forwardRef<React.ElementType, TimeAgoProps>((props, ref) => {
  return <ReactTimeAgo {...props} ref={ref} />;
});

TimeAgo.displayName = "TimeAgo";

export { TimeAgo };
