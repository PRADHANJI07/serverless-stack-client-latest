const config = {
    MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "bhabesh-bucket",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://cwuf676t90.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_iTQ8X3M0d",
    APP_CLIENT_ID: "3jkmonve56q3lk2tvj5ia18fdl",
    IDENTITY_POOL_ID: "us-east-1:2a1a14d4-5231-4c61-acd8-fca28dae0ae1",
  },
};
export default config;
