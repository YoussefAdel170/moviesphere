import "./TooltipComponent.scss";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type Props = {
  title: string;
  position?: TooltipPosition;
  customClass?: string;
  children: React.ReactNode;
};

export default function TooltipComponent({
  title,
  position = "bottom",
  customClass = "",
  children,
}: Props) {
  return (
    <span className={`tooltip tooltip--${position} ${customClass}`}>
      {children}
      <span className="tooltip__content">{title}</span>
    </span>
  );
}
