export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8081'
    : 'https://nuggetai.com';
export const SANDBOX_URL = 'https://sandbox-dev.nuggetai.com';

export const AWS_CREDENTIALS = {
  bucketName: process.env.REACT_APP_AWS_BUCKETNAME,
  dirName: process.env.REACT_APP_AWS_DIRNAME,
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESSKEYID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
};

export const AWS_RESUME_S3_CREDENTIALS = {
  bucketName: process.env.REACT_APP_AWS_RESUMEBUCKET,
  dirName: process.env.REACT_APP_AWS_RESUMEDIR,
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESSKEYID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
};

export const PIXEL_ID = '2262723547138604';
