import { Request, Response } from 'express';
import moment from 'moment-timezone';
import github from 'octonode';

const writeWorkoutMarkdown = (req: Request, res: Response) => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.send('couldnt find token');
  }

  const absoluteDate = moment();
  const date = moment.tz(absoluteDate, 'America/Denver').format('YYYY-MM-DD');
  const dummyContent = `
---
date: "${date}"
title: "Testing the cloud function"
categories:
  - Run
---

## This is a test
I am testing out this side of the cloud function to see if I can easily
generate markdown files and insert them into the repo.
  `.trim();

  const client = github.client(token);
  const repo = client.repo('namack/nateistraining.com');

  const callback = (error: Error) => {
    if (error) {
      return res.send({ error });
    }
    return res.send('it worked! in typescript!');
  };

  repo.createContents(
    `blog/${date}/index4.mdx`,
    'testing cloud function with typescript',
    dummyContent,
    'master',
    callback
  );
};

export { writeWorkoutMarkdown };
