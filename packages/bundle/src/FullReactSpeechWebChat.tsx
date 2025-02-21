import { ReactSpeechWebChat, type ReactSpeechWebChatProps } from 'botframework-webchat-component';
import React from 'react';

import AddFullBundle, { type AddFullBundleProps } from './AddFullBundle';

type FullReactSpeechWebChatProps = Readonly<ReactSpeechWebChatProps & Omit<AddFullBundleProps, 'children'>>;

// Add additional props to <WebChat>, so it support additional features
const FullReactSpeechWebChat = (props: FullReactSpeechWebChatProps) => (
  <AddFullBundle {...props}>{extraProps => <ReactSpeechWebChat {...props} {...extraProps} />}</AddFullBundle>
);

export default FullReactSpeechWebChat;

export type { FullReactSpeechWebChatProps };
