import { hooks } from 'botframework-webchat-api';
import type { WebChatActivity } from 'botframework-webchat-core';
import PropTypes from 'prop-types';
import React, { FC, memo, useCallback, useMemo } from 'react';
import ReactSay, { SayUtterance } from 'react-say';

import SayAlt from './SayAlt';

// TODO: [P1] Interop between Babel and esbuild.
const Say = 'default' in ReactSay ? ReactSay.default : ReactSay;
const { useMarkActivityAsSpoken, useStyleOptions, useVoiceSelector, useSetBotSpeaking } = hooks;

// TODO: [P4] Consider moving this feature into BasicActivity
//       And it has better DOM position for showing visual spoken text

type SpeakProps = {
  activity: WebChatActivity;
};

const Speak: FC<SpeakProps> = ({ activity }) => {
  const [{ showSpokenText }] = useStyleOptions();
  const markActivityAsSpoken = useMarkActivityAsSpoken();
  const selectVoice = useVoiceSelector(activity);
  const setBotSpeaking = useSetBotSpeaking();

  const markAsSpoken = useCallback(() => {
    setBotSpeaking(false);
    markActivityAsSpoken(activity);
  }, [activity, markActivityAsSpoken, setBotSpeaking]);

  const singleLine: false | string = useMemo(() => {
    if (activity.type !== 'message') {
      return false;
    }

    const { attachments = [], speak, text } = activity;

    // return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-IN">
    //     <voice name="en-US-AvaMultilingualNeural">
    //       <mstts:express-as style="cheerful" role="YoungAdultFemale">
    //         <prosody rate="5%">
    //           ${text ?? speak}
    //         </prosody>
    //       </mstts:express-as>
    //     </voice>
    //   </speak>`;

    let res = speak;
    if (!speak) {
      res =  `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
      <voice name="en-US-ChristopherNeural">
        <prosody rate="0%" pitch="0%">
          ${text}
        </prosody>
      </voice>
    </speak>`;
    }

    return [
      res,
      ...attachments
        .filter(({ contentType }) => contentType === 'application/vnd.microsoft.card.adaptive')
        .map(attachment => attachment?.content?.speak)
    ]
      .filter(line => line)
      .join('\r\n');
  }, [activity]);

  const speechSynthesisUtterance: false | SpeechSynthesisUtterance | undefined =
    activity.type === 'message' && activity.channelData?.speechSynthesisUtterance;

  const handleOnStartSpeaking = useCallback(() => {
    setBotSpeaking(true);
  }, [setBotSpeaking]);

  return (
    !!activity && (
      <React.Fragment>
        {speechSynthesisUtterance ? (
          <SayUtterance
            onEnd={markAsSpoken}
            onError={markAsSpoken}
            onStart={handleOnStartSpeaking}
            utterance={speechSynthesisUtterance}
          />
        ) : (
          <Say
            onEnd={markAsSpoken}
            onError={markAsSpoken}
            onStart={handleOnStartSpeaking}
            text={singleLine}
            voice={selectVoice}
          />
        )}
        {!!showSpokenText && <SayAlt speak={singleLine} />}
      </React.Fragment>
    )
  );
};

Speak.propTypes = {
  // PropTypes cannot fully capture TypeScript types.
  // @ts-ignore
  activity: PropTypes.shape({
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        speak: PropTypes.string,
        subtitle: PropTypes.string,
        text: PropTypes.string,
        title: PropTypes.string
      })
    ),
    channelData: PropTypes.shape({
      speechSynthesisUtterance: PropTypes.any
    }),
    speak: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string.isRequired
  }).isRequired
};

Speak.displayName = 'SpeakActivity';

export default memo(Speak);
