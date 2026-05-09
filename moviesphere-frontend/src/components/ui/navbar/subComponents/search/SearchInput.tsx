import TooltipComponent from "../../../helper/tooltip/TooltipComponent";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  ariaLabel: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

export default function SearchInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  inputRef,
}: Props) {
  return (
    <TooltipComponent title={ariaLabel} customClass="flex-1" position="bottom">
      <input
        ref={inputRef}
        type="search"
        value={value}
        className="flex-1"
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </TooltipComponent>
  );
}
