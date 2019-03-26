import axios from 'axios';
import { Request, Response } from 'express';
import { Base64 } from 'js-base64';
import moment from 'moment-timezone';
import github from 'octonode';
import { createMarkdown } from './createMarkdown';
import {
  RefreshTokenResponse,
  StravaDetailedActivity,
  StravaRequestType,
  StravaWebhookEvent,
  Token,
} from './stravaTypes';

const determineRequestType = (req: Request): StravaRequestType | undefined => {
  const { body } = req;
  if (body.type === 'backfill') {
    return StravaRequestType.CustomBackfillEvent;
  } else if (body.type === 'generate') {
    return StravaRequestType.CustomGenerationEvent;
  } else if (
    req.query['hub.mode'] &&
    req.query['hub.verify_token'] &&
    req.query['hub.challenge']
  ) {
    return StravaRequestType.StravaHubRequest;
  } else if (
    body.object_id &&
    body.aspect_type === 'create' &&
    body.object_type === 'activity'
  ) {
    return StravaRequestType.StravaWebhookEvent;
  }
};

const writeActivityToGithub = (activity: StravaDetailedActivity) => {
  const githubToken = process.env.GITHUB_TOKEN;
  const date = moment
    .tz(activity.start_date, 'America/Denver')
    .format('YYYY-MM-DD');
  const startDate = moment(activity.start_date).format('dddd, MMMM Do YYYY');

  const blogPost = `
---
date: ${activity.start_date}
title: ${startDate}
categories:
  - ${activity.type}
---
${createMarkdown(activity)}
`.trim();

  const returnString = `
`.trim();

  const client = github.client(githubToken);
  const repo = client.repo('namack/nateistraining.com');

  const path = (filename: string) => `blog/${date}/${filename}`;
  const commitMessage = (filetype: string) =>
    `${startDate}: ${activity.type}: ${filetype}`;

  const checkExisting = () =>
    new Promise((resolve, reject) => {
      repo.contents(path('index.mdx'), (err: any, data: any) => {
        if (err && err.statusCode === 404) {
          return resolve();
        }
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });

  const createContents = () =>
    new Promise((resolve, reject) => {
      repo.createContents(
        path('index.mdx'),
        commitMessage('blog post'),
        blogPost,
        'master',
        (err: Error) => {
          if (err) {
            return reject(err);
          }
          // tslint:disable-next-line
          console.log(`Wrote Activity to GitHub: ${activity.id}`);
          return resolve();
        }
      );
    });

  const updateContents = (data: any) =>
    new Promise((resolve, reject) => {
      const workout = createMarkdown(activity);
      const decoded = Base64.decode(data.content);
      const post = decoded.concat(returnString, workout);

      repo.updateContents(
        path('index.mdx'),
        commitMessage('brick workout'),
        post,
        data.sha,
        (err: any) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      );
    });

  return checkExisting().then(data => {
    if (!data) {
      return createContents();
    } else {
      return updateContents(data);
    }
  });
};

const getToken = (): Promise<Token> => {
  const clientId = `client_id=${process.env.STRAVA_CLIENT_ID}`;
  const clientSecret = `client_secret=${process.env.STRAVA_CLIENT_SECRET}`;
  const refreshToken = `refresh_token=${process.env.STRAVA_REFRESH_TOKEN}`;
  const grantType = `grant_type=refresh_token`;

  return axios
    .post(
      `https://www.strava.com/oauth/token?${clientId}&${clientSecret}&${refreshToken}&${grantType}`
    )
    .then(({ data }) => {
      const response = data as RefreshTokenResponse;
      return response.access_token;
    });
};

const getActivityData = (
  activityId: number,
  token: Token
): Promise<StravaDetailedActivity> => {
  return axios
    .get(`https://www.strava.com/api/v3/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      // tslint:disable-next-line
      console.log('Token Refresh Complete');
      return data as StravaDetailedActivity;
    });
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
      return tokenVerified
        ? res.send({ ['hub.challenge']: hub['hub.challenge'] })
        : res.status(400).send();
    case StravaRequestType.StravaWebhookEvent:
      const webhookBody: StravaWebhookEvent = req.body;
      res.status(200).send();

      return getToken()
        .then((token: Token) => {
          return getActivityData(webhookBody.object_id, token);
        })
        .then((activity: StravaDetailedActivity) => {
          return writeActivityToGithub(activity);
        })
        .catch((error: any) => {
          // tslint:disable-next-line
          console.error(error);
        });
    case StravaRequestType.CustomBackfillEvent:
      return getToken()
        .then((token: Token) => {
          return getActivityData(req.body.activityId, token);
        })
        .then((activity: StravaDetailedActivity) => {
          return writeActivityToGithub(activity);
        })
        .then(() => {
          return res.status(200).send();
        })
        .catch((error: any) => {
          // tslint:disable-next-line
          console.error(error);
          return res.status(500).send();
        });

    case StravaRequestType.CustomGenerationEvent:
      return getToken()
        .then((token: Token) => {
          return getActivityData(req.body.activityId, token);
        })
        .then((activity: StravaDetailedActivity) => {
          const parsed = createMarkdown(activity);
          return res.send(parsed);
        })
        .catch((error: any) => {
          // tslint:disable-next-line
           console.error(error);
        });

    default:
      res.status(200).send();
      break;
  }
};

export { generateWorkoutMarkdown };
