import React from 'react';
import { Constants } from 'botframework-webchat-core';
import { hooks } from 'botframework-webchat-api';
import MicrophoneButton from './MicrophoneButton';
import SuggestedActions from '../SendBox/SuggestedActions';
import DictationInterims from '../SendBox/DictationInterims';
import TextBox from '../SendBox/TextBox';
import { useStyleToEmotionObject } from '../hooks/internal/styleToEmotionObject';

const SEND_BOX_CONTAINER = {
  alignItems: 'stretch',
  backgroundColor: 'white',
  borderTop: '1px solid rgb(230, 230, 230)',
  minHeight: '40px',
  display: 'flex'
};

const SEND_BOX_FLEX_GROW = {
  flex: '10000 1 0%'
};

type SendBoxProps = {
  readonly changeView: (view: string) => void;
};

const { useDictateState } = hooks;

const {
  DictateState: { DICTATING, STARTING }
} = Constants;

function useSendBoxSpeechInterimsVisible(): [boolean] {
  const [dictateState] = useDictateState();

  return [dictateState === STARTING || dictateState === DICTATING];
}

const SendBox = ({ changeView }: SendBoxProps) => {
  const sendBoxContainerClassName = useStyleToEmotionObject()(SEND_BOX_CONTAINER) + '';
  const sendBoxFlexGrow = useStyleToEmotionObject()(SEND_BOX_FLEX_GROW) + '';
  const [speechInterimsVisible] = useSendBoxSpeechInterimsVisible();

  return (
    <div>
      <SuggestedActions />
      <div className={sendBoxContainerClassName}>
        {speechInterimsVisible ? (
          <DictationInterims className={sendBoxFlexGrow} />
        ) : (
          <TextBox className={sendBoxFlexGrow} />
        )}
        <MicrophoneButton changeView={changeView} />
      </div>
    </div>
  );
};

SendBox.displayName = 'SendBox';

export default SendBox;
