import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

export const sortOptions = {
  // todo: sat ordinal
  "genesis_block_height-desc": "Newest First",
  "genesis_block_height-asc": "Oldest First",
  "rarity-desc": "Most Rare First",
  "rarity-asc": "Most Common First",
};

const Sort = ({ sortKey, updateSort }: any) => {
  return (
    <Select value={sortKey} onValueChange={updateSort}>
      <SelectTrigger className="uppercase text-xs">
        <div className="space-x-3">
          <span>Sort By</span>
          <span>
            [<SelectValue />]
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(sortOptions).map(([key, value], i) => (
          <SelectItem key={i} value={key} className="uppercase text-xs">
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
