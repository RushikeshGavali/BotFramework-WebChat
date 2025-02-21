import PropTypes from 'prop-types';
import React, { FC, useCallback, useMemo, useState } from 'react';

import Composer from '../Composer';
import { useMicrophoneButtonClick } from '../SendBox/MicrophoneButton';
import BotResponse from './BotResponse';
import BasicWebChat from '../BasicWebChat';
import { ComposerProps, hooks } from 'botframework-webchat-api';
import { useStyleToEmotionObject } from '../hooks/internal/styleToEmotionObject';
import { Constants } from 'botframework-webchat-core';
import classNames from 'classnames';
import Mic from './Assets/Mic';
import IconButton from '../SendBox/IconButton';
import Keyboard from './Assets/Keyboard';
import { useSetDictateState } from 'botframework-webchat-api/internal';
import SendBox from './SendBox';

const ARIA_LANDMARK_ROLES = ['complementary', 'contentinfo', 'form', 'main', 'region'];

const { DictateState } = Constants;

type ReactSpeechWebChatProps = Readonly<
  Omit<ComposerProps, 'children'> & {
    className?: string;
    role?: 'complementary' | 'contentinfo' | 'form' | 'main' | 'region';
  }
>;

type ReactSpeechWebChatCoreProps = {
  className?: string;
  role?: 'complementary' | 'contentinfo' | 'form' | 'main' | 'region';
  changeView: (view: string) => void;
  currentView: 'speech' | 'text';
};

const PILL_STYLE = {
  width: '165px',
  height: '60px',
  display: 'flex',
  borderRadius: '26px',
  outlineColor: 'rgba(255, 255, 255, 0.3)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  outlineStyle: 'solid',
  outlineWidth: '0px',
  padding: '0 10px',
  boxSizing: 'border-box',
  gap: '15px',
  justifyContent: 'center',
  alignItems: 'center'
};

const SPEAKING_STYLE = {
  animation: 'glow 1s infinite alternate',
  '@keyframes glow': {
    '0%': {
      outlineWidth: '3px'
    },
    '20%': {
      outlineWidth: '4px'
    },
    '40%': {
      outlineWidth: '5px'
    },
    '60%': {
      outlineWidth: '6px'
    },
    '80%': {
      outlineWidth: '7px'
    },
    '100%': {
      outlineWidth: '8px'
    }
  }
};

const BUTTON_STYLE = {
  '&.webchat__icon-button': {
    width: '54px',
    height: '54px',
    borderRadius: '100%',
    cursor: 'pointer',
    '&:not(:disabled):not([aria-disabled="true"])': {
      '&:not(:active)': {
        '&:hover': {
          '& .webchat__icon-button__shade': {
            backgroundColor: 'transparent'
          }
        }
      },
      '&:active': {
        '& .webchat__icon-button__shade': {
          backgroundColor: 'transparent'
        }
      }
    }
  }
};

const MIC_ANIMATION_STYLE = {
  '&.webchat__icon-button': {
    animation: 'innerShadow 1s infinite alternate',
    backgroundColor: '#95B8C3',
    border: '1px solid white',
    '& svg': {
      fill: '#01678C'
    },
    '@keyframes innerShadow': {
      '0%': {
        boxShadow: '0 0 20px 0 white inset'
      },
      '20%': {
        boxShadow: '0 0 18px 0 white inset'
      },
      '40%': {
        boxShadow: '0 0 16px 0 white inset'
      },
      '60%': {
        boxShadow: '0 0 14px 0 white inset'
      },
      '80%': {
        boxShadow: '0 0 12px 0 white inset'
      },
      '100%': {
        boxShadow: '0 0 10px 0 white inset'
      }
    }
  }
};

const KEYBOARD_STYLE = {
  fill: '#242424'
};

const { useShouldSpeakIncomingActivity, useDictateState, useBotSpeakingState, useLocalizer } = hooks;

const ReactSpeechWebChatCore: FC<ReactSpeechWebChatCoreProps> = ({ className, role, changeView, currentView }) => {
  const [dictateState] = useDictateState();
  const localize = useLocalizer();
  const pillClassName = useStyleToEmotionObject()(PILL_STYLE) + '';
  const speakingClassName = useStyleToEmotionObject()(SPEAKING_STYLE) + '';
  const buttonClassName = useStyleToEmotionObject()(BUTTON_STYLE) + '';
  const micAnimationClassName = useStyleToEmotionObject()(MIC_ANIMATION_STYLE) + '';
  const keyboardClassName = useStyleToEmotionObject()(KEYBOARD_STYLE) + '';
  const [, setShouldSpeakIncomingActivity] = useShouldSpeakIncomingActivity();
  const microphoneClick = useMicrophoneButtonClick();
  const botSpeakingState = useBotSpeakingState();
  const setDictateState = useSetDictateState();

  const openWebChatView = useCallback(() => {
    changeView('text');
    setShouldSpeakIncomingActivity(false);
    setDictateState(DictateState.IDLE);
  }, [changeView, setDictateState, setShouldSpeakIncomingActivity]);

  const handleMicrophoneClick = useCallback(() => {
    changeView('speech');
    setShouldSpeakIncomingActivity(false);
    microphoneClick();
  }, [changeView, microphoneClick, setShouldSpeakIncomingActivity]);

  return (
    <React.Fragment>
      {currentView === 'speech' ? (
        <div className={classNames(pillClassName, { [speakingClassName]: botSpeakingState }, 'webchat_pill-container')}>
          <BotResponse />
          <IconButton
            alt={localize('KEYBOARD_BUTTON_ALT')}
            className={classNames(buttonClassName, 'webchat_pill-keyboard-button')}
            onClick={openWebChatView}
          >
            <Keyboard className={classNames(keyboardClassName, 'webchat_pill-keyboard-icon')} />
          </IconButton>
          <IconButton
            alt={localize('TEXT_INPUT_SPEAK_BUTTON_ALT')}
            className={classNames(
              buttonClassName,
              {
                [micAnimationClassName]: dictateState === DictateState.DICTATING && !botSpeakingState
              },
              'webchat_pill-mic-button'
            )}
            onClick={handleMicrophoneClick}
          >
            <Mic />
          </IconButton>
        </div>
      ) : (
        <BasicWebChat className={className} role={role} />
      )}
    </React.Fragment>
  );
};

const ReactSpeechWebChat = ({ className, role, ...composerProps }: ReactSpeechWebChatProps) => {
  const [currentView, setCurrentSpeechWebChatView] = useState<'speech' | 'text'>('speech');

  const handleChangeView = useCallback(newView => {
    setCurrentSpeechWebChatView(newView);
  }, []);

  const SendBoxMiddlewareComponent = useMemo(() => <SendBox changeView={handleChangeView} />, [handleChangeView]);
  return (
    <Composer {...composerProps} sendBoxMiddleware={[() => () => () => () => SendBoxMiddlewareComponent]}>
      <ReactSpeechWebChatCore
        changeView={handleChangeView}
        className={className}
        currentView={currentView}
        role={role}
      />
    </Composer>
  );
};

ReactSpeechWebChat.defaultProps = {
  className: undefined,
  role: undefined,
  ...Composer.defaultProps
};

const {
  // Excluding "children" from ComposerProps.
  children: _,
  ...composerPropTypesWithoutChildren
} = Composer.propTypes;

ReactSpeechWebChat.propTypes = {
  className: PropTypes.string,
  // Ignoring deficiencies with TypeScript/PropTypes inference.
  // @ts-ignore
  role: PropTypes.oneOf(ARIA_LANDMARK_ROLES),
  ...composerPropTypesWithoutChildren
};

ReactSpeechWebChatCore.defaultProps = {
  changeView: () => undefined,
  className: '',
  currentView: 'speech',
  role: 'complementary'
};

ReactSpeechWebChatCore.propTypes = {
  changeView: PropTypes.func,
  className: PropTypes.string,
  currentView: PropTypes.oneOf(['speech', 'text']),
  // @ts-ignore
  role: PropTypes.oneOf(ARIA_LANDMARK_ROLES)
};

export default ReactSpeechWebChat;

export type { ReactSpeechWebChatProps };
