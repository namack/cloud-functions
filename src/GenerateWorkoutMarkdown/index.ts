import axios from 'axios';
import { Request, Response } from 'express';
import moment from 'moment-timezone';
import github from 'octonode';
import {
  StravaDetailedActivity,
  StravaRequestType,
  StravaWebhookEvent,
} from './stravaTypes';

const determineRequestType = (req: Request): StravaRequestType | undefined => {
  const { body } = req;
  if (
    req.query['hub.mode'] &&
    req.query['hub.verify_token'] &&
    req.query['hub.challenge']
  ) {
    return StravaRequestType.StravaHubRequest;
  } else if (body.object_id && body.aspect_type && body.object_type) {
    return StravaRequestType.StravaWebhookEvent;
  }
};

const writeActivityToGithub = (activity: StravaDetailedActivity): void => {
  const githubToken = process.env.GITHUB_TOKEN;
  const absoluteDate = moment();
  const date = moment.tz(absoluteDate, 'America/Denver').format('YYYY-MM-DD');
  const startDate = moment(activity.start_date).format('dddd, MMMM Do YYYY');

  const elevationGain =
    (activity.type === 'Run' ||
      activity.type === 'Ride' ||
      activity.type === 'VirtualRide' ||
      activity.type === 'VirtualRun') &&
    `* Elevation Gain: ${activity.total_elevation_gain}`;

  const content = `
---
date: ${activity.start_date}
title: ${activity.name}
categories:
  - ${activity.type}
---

## [${startDate}: ${activity.name}](https://www.strava.com/activities/${
    activity.id
  })
  * Distance: ${activity.distance}
  * Elapsed Time: ${activity.elapsed_time}
  ${elevationGain}
  `.trim();

  const client = github.client(githubToken);
  const repo = client.repo('namack/nateistraining.com');

  const callback = (error: Error) => {
    if (error) {
      throw error;
    }

    // tslint:disable
    console.log(`Wrote Activity to GitHub: ${activity.id}`);
  };

  repo.createContents(
    `blog/${date}/index.mdx`,
    `${startDate}: ${activity.type}`,
    content,
    'master',
    callback
  );
};

const generateWorkoutMarkdown = (req: Request, res: Response) => {
  const stravaVerifyToken = process.env.STRAVA_VERIFY_TOKEN;
  const requestType = determineRequestType(req);

  switch (requestType) {
    case StravaRequestType.StravaHubRequest:
      const hub = {
        'hub.challenge': req.query['hub.challenge'],
        'hub.verify_token': req.query['hub.verify_token'],
        'hub.mode': req.query['hub.mode'],
      };
      const tokenVerified = hub['hub.verify_token'] === stravaVerifyToken;
      return tokenVerified ? res.send({ ['hub.challenge']: hub['hub.challenge']}) : res.status(400).send()
    case StravaRequestType.StravaWebhookEvent:
      const webhookBody: StravaWebhookEvent = req.body;

      if (
        webhookBody.aspect_type !== 'create' ||
        webhookBody.object_type !== 'activity'
      ) {
        return;
      }

      return axios
        .get(
          `https://www.strava.com/api/v3/activities/${webhookBody.object_id}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.STRAVA_TOKEN}`
            }
          }
        )
        .then(({ data }) => {
          const activity = data as StravaDetailedActivity;
          return writeActivityToGithub(activity);
        })
        .catch(error => {
          throw error;
        });

    default:
      break;
  }
};

export { generateWorkoutMarkdown };
