import React, { memo } from 'react';
import useUnSpokenActivities from './useLastBotActivity';
import SpeakActivity from '../Activity/Speak';

function BotResponse() {
  const unSpokenActivities = useUnSpokenActivities();

  return (
    <React.Fragment>
      {unSpokenActivities.map(activity => (
        <SpeakActivity activity={activity} key={activity.id} />
      ))}
    </React.Fragment>
  );
}

export default memo(BotResponse);
