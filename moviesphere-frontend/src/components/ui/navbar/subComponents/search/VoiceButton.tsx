import { FiMic } from "react-icons/fi";
import TooltipComponent from "../../../helper/tooltip/TooltipComponent";

type Props = {
  onClick: () => void;
  listening: boolean;
  ariaLabel: string;
};

export default function VoiceButton({ onClick, listening, ariaLabel }: Props) {
  return (
    <TooltipComponent title={ariaLabel} position="bottom">
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`voice-btn ${listening ? "listening" : ""}`}
      >
        <FiMic />
      </button>
    </TooltipComponent>
  );
}
