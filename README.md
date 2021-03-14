# saasbox-webapi

This is a backend for a minimal note taking web application. My goals for this project were to:

* Build something I can use to takes notes
* Experiment with and compare the various website rendering methods (CSR, SSG, and SSR)
* Build something that costs nothing or next to nothing for me to run
* Use 'serverless' technologies to deploy things without directly managing any infrastructure
* Learn about and utilize infrastructure-as-code

The specific technologies used in this project are:

* AWS 
  * SAM
  * Api Gateway
  * Lambda
  * DynamoDB
* Node.js
* Auth0
* Cloudinary

Note that I deliberately choose to *not* use express here because I wanted to try doing things on my own.

## Getting Started

### Prerequisites

* AWS SAM
* Docker
* Node.js
* An Auth0 account (or some other compatible identity provider that supports JWTs)
* A Cloudinary account

### Setup

A `template.empty.yml` file is included with environment variables that can be specified at the top. A copy of this file named `template.yml` should be created. This file is used by AWS SAM to deploy the required services on AWS as well as upload your code. A description of the environment variables is below:

* `JWKS_URI`: The JWKS endpoint.
* `AUDIENCE`: Audience (used for authentication). This should be set to the URL of the webapi when deployed, e.g. the value of the WebEndpoint output variable from AWS SAM.
* `ISSUER`: The issuer URL.
* `ALGORITHM`: Algorithm used to sign JWTs.
* `KID`: The key id of the public signing key that should be used for verifying JWTs. This key should be returned by the JWKS endpoint.
* `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
* `CLOUDINARY_API_KEY`: Cloudinary API key.
* `CLOUDINARY_API_SECRET`: Cloudinary API secret.

To run the application locally:

```bash
sam local start-api
```

Note that running the project locally with DynamoDB can require some additional setup, mainly around connecting a local DynamoDB instance to the instance created by AWS SAM, so for ease of development it's recommended that you instead deploy things to a staging or development environment on AWS.

## Deployment

If this is not your first time deploying this application you can run `sam build` and `sam deploy`, otherwise to build and deploy things for the first time you can run:

```bash
sam build
sam deploy --guided
```

The `--guided` parameter will cause SAM to ask you some questions so it can configure things.

* **Stack Name**: This is the name of the group under which all of the resources associated with this deployment will be placed under.
* **AWS Region**: The AWS region you want to deploy things to, e.g. ap-southeast-1.
* **Confirm changes before deploy**: I recommend setting this to yes. This will cause AWS SAM to ask you to confirm the changes you want to make each time you run `sam deploy`.
* **Allow SAM CLI IAM role creation**: Some of the resources AWS SAM deploys for you may need to setup AWS IAM roles for you, this determines how those permissions will be supplied. By default I suggest you accept this as otherwise you'll need to pass `--capabilities CAPABILITY_IAM` to `sam deploy` each time you want to deploy.
* **Save arguments to samconfig.toml**: Determines whether AWS SAM will save your answers to the previous questions. I recommend you accept this as otherwise you'll need to provide this parameters each time you want to deploy.