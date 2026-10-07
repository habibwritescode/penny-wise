import { Input } from "./ui/input";

import SearchIcon from "../../public/assets/icons/search.svg";

type Props = {
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// Sized for a flex row of filters: grows up to 320px and can shrink.
const SearchInput = ({ placeholder, value, onChange }: Props) => {
  return (
    <div className="max-w-[320px] min-w-0 flex-1 relative">
      <Input
        className="pr-10"
        // The keyboard's return key says "Search".
        enterKeyHint="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <SearchIcon className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2" />
    </div>
  );
};

export default SearchInput;
