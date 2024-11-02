import { Input } from "./ui/input";

import SearchIcon from "../../public/assets/icons/search.svg";

type Props = {
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput = ({ placeholder, value, onChange }: Props) => {
  return (
    <div className="max-w-[320px] min-w-max w-full relative">
      <Input placeholder={placeholder} value={value} onChange={onChange} />
      <SearchIcon className="absolute top-1/2 right-4 transform -translate-y-1/2" />
    </div>
  );
};

export default SearchInput;
