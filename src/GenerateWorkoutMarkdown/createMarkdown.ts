import moment from 'moment';
import pluralize from 'pluralize';
import { addCommas } from '../utils';
import { StravaDetailedActivity } from './stravaTypes';

const createMarkdown = (activity: StravaDetailedActivity): string => {
  const heartrateSection =
    activity.has_heartrate &&
    `
_Average Heart Rate_

### ${Math.floor(activity.average_heartrate)} BPM

_Max Heart Rate_

### ${Math.floor(activity.max_heartrate)} BPM
`.trim();

  const distance = activity.distance / 1609.34;
  const hours = parseInt(
    moment.utc(activity.moving_time * 1000).format('h'),
    10
  );
  const minutes = parseInt(
    moment.utc(activity.moving_time * 1000).format('m'),
    10
  );

  const elapsedTime = () => {
    const hourString = `${hours} ${pluralize('hour', hours)}`;
    const minuteString = `${minutes} ${pluralize('minute', minutes)}`;
    if (hours > 0 && minutes > 0) {
      return `${hourString}, ${minuteString}`;
    } else if (hours === 0 && minutes > 0) {
      return minuteString;
    } else if (hours > 0 && minutes === 0) {
      return hourString;
    }
  };

  const calories = addCommas(JSON.stringify(Math.floor(activity.calories)));

  const averageSpeed = (): string | undefined => {
    const speed = activity.average_speed * 2.237;
    if (activity.type === 'VirtualRide' || activity.type === 'Ride') {
      return `${speed.toFixed(2)} MPH`;
    } else if (activity.type === 'Run' || activity.type === 'VirtualRun') {
      const pace = 60 / speed;
      return `${pace.toFixed(2)} / Mile`;
    }
  };

  const paceSection =
    averageSpeed &&
    `
_Average Pace_

### ${averageSpeed()}
`.trim();

  const elevationSection =
    (activity.type === 'Run' ||
      activity.type === 'Ride' ||
      activity.type === 'VirtualRide' ||
      activity.type === 'VirtualRun') &&
    `
_Elevation Gain_

### ${addCommas(
      JSON.stringify(Math.floor(activity.total_elevation_gain * 3.281))
    )} feet
`.trim();

  return `
## [${activity.name}](https://www.strava.com/activities/${activity.id})

_Distance_

### ${distance.toFixed(2)} miles

_Total Time_

### ${elapsedTime()}

${paceSection}

${elevationSection}

${heartrateSection}

_Calories_

### ${calories} Calories
`.trim();
};

export { createMarkdown };
