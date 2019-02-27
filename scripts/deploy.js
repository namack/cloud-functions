var shell = require('shelljs')

const deploy = () => {
  const funcName = process.argv[2]
  shell.exec(
    `gcloud functions deploy ${funcName} --env-vars-file .env.yaml  --runtime nodejs6 --trigger-http`
  );
}

deploy();