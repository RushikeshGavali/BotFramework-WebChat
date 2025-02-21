import React, { useCallback } from 'react';
import { hooks } from 'botframework-webchat-api';
import { useMicrophoneButtonClick } from '../hooks';
import IconButton from '../SendBox/IconButton';
import MicrophoneIcon from '../SendBox/Assets/MicrophoneIcon.js';

type MicroPhoneButtonProps = {
  readonly changeView: (view: string) => void;
};

const { useShouldSpeakIncomingActivity, useLocalizer } = hooks;

const MicrophoneButton = ({ changeView }: MicroPhoneButtonProps) => {
  const microphoneClick = useMicrophoneButtonClick();
  const [, setShouldSpeakIncomingActivity] = useShouldSpeakIncomingActivity();
  const localize = useLocalizer();

  const handleMicrophoneButtonClick = useCallback(() => {
    changeView('speech');
    setShouldSpeakIncomingActivity(false);
    microphoneClick();
  }, [changeView, microphoneClick, setShouldSpeakIncomingActivity]);

  return (
    <IconButton
      alt={localize('TEXT_INPUT_SPEAK_BUTTON_ALT')}
      className="webchat__microphone-button__button"
      onClick={handleMicrophoneButtonClick}
    >
      <MicrophoneIcon className="webchat__microphone-button__icon" />
    </IconButton>
  );
};

export default MicrophoneButton;
