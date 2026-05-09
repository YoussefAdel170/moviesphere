export function useSearchTest({
  handleSearchChange,
  handleVoice,
}: {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVoice: () => void;
}) {
  const onVoiceClick = () => {
    handleVoice();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e);
  };

  return {
    onVoiceClick,
    onChange,
  };
}
