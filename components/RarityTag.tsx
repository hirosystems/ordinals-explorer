import IconEye from "./icons/IconEye";
import IconFlame from "./icons/IconFlame";
import IconSparkle from "./icons/IconSparkle";
import IconUnicorn from "./icons/IconUnicorn";

const satRarityMap = {
  common: [1, "bg-neutral-0"],
  uncommon: [2, "bg-neutral-0"],
  rare: [3, "bg-gold", IconSparkle],
  epic: [4, "bg-pink", IconFlame],
  legendary: [5, "bg-mint", IconEye],
  mythic: [6, "bg-sky", IconUnicorn],
} as Record<
  string,
  [number, string] | [number, string, React.FC<{ className?: string }>]
>;

const RarityTag = (props: { rarity: string }) => {
  const [dots, bgColor, Icon] = satRarityMap[props.rarity];
  // todo: maybe add tooltip with all descriptions, or current description, or link to more information
  return (
    <div className="flex h-[34px] cursor-default items-center space-x-1">
      {Icon && (
        <div
          className={`flex aspect-square items-center justify-center self-stretch rounded-[3px] ${bgColor}`}
        >
          <Icon className="scale-[1.2]" />
        </div>
      )}
      <div className={`inline-flex rounded-[5px] p-[2px] ${bgColor}`}>
        <div className="inline-flex space-x-[8px] rounded-[3px] bg-neutral-0 px-[9px] py-[5px] uppercase">
          <span>{props.rarity}</span>
          <RarityDots dots={dots} />
        </div>
      </div>
    </div>
  );
};

const RarityDots = ({ dots }: { dots: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {Array(dots).fill(
        <div className="inline-block h-2 w-2 rounded-full bg-black" />
      )}
      {Array(6 - dots).fill(
        <div className="inline-block h-2 w-2 rounded-full bg-neutral-200" />
      )}
    </div>
  );
};

export default RarityTag;
