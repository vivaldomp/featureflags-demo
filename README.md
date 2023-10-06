# Feature Flags Demo with Microservices, React.js, Nginx, and Minio

Welcome to our Feature Flags Demo! This demonstration showcases how to create and use feature flags in a web application using a microservice built in Golang, a React.js demo app served by Nginx, and feature flag storage managed by Minio. Feature flags, also known as feature toggles or feature switches, allow developers to enable or disable certain features of an application without changing the codebase.

**This demo is designed to only use a user's email in the context evaluated by the golang microservice.**

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Running the Demo](#running-the-demo)
- [Usage](#usage)
- [Retrieving and Modifiyng Flags](#retrieving-and-modifiyng-flags)
- [License](#license)

## Prerequisites
- Golang installed on your system ([Download and Intall](https://go.dev/doc/install))
- Docker installed on your system ([Get Docker](https://www.docker.com/get-started))
- Docker Compose installed on your system ([Install Docker Compose](https://docs.docker.com/compose/install/))

## Getting Started
1. Clone this repository:
   ```bash
   git clone https://github.com/vivaldomp/featureflag-demo
   cd featureflags-demo
   ```

2. Set up your environment variables (only for host execution):
   - Create a `.env` file based on `.env.example` and provide necessary values.

## Architecture
Our demo application consists of the following components:
- **Golang Microservice**: Responsible for managing feature flags and their states.
- **React.js Demo App**: A sample frontend application that consumes feature flags.
- **Nginx**: Serves the React.js demo app.
- **Minio**: An object storage service used for storing feature flag configurations.

## Running the Demo
To run the entire stack, use Docker Compose. From the project root, run:

```bash
docker-compose up -d --build
```

This will start the Golang microservice, Nginx serving the React.js app, and Minio container.

## Usage
- Access the React.js demo app at `http://localhost:8080` in your web browser.
- Experiment with feature flags in the demo app. Toggle feature flags in the Golang microservice and observe the changes in the React.js app behavior.

The flags are evaluated when one of the following emails is entered: `user1@acme.com` and `user2@acme.com`. They were applied to reacts components located in the path `public/assets/components.js`. Follow the comments.



## Evaluating and Modifiyng Flags

To evaluate a user's flags, do a GET Rest operation to the `http://localhost:3000/flags` endpoint and pass the query parameter with one of the emails above (topic usage). Example:

```bash
curl -X GET http://localhost:3000/flags?email=user1@acme.com

{"TOGGLE_HEADER_BACKGROUND_COLOR":"bg-blue-500","TOGGLE_VIEW_GROW_RATE":true}
```

To modify the feature flags collection, do a POST Rest operation to the `http://localhost:3000/flags` endpoint and pass the new feature flags and their rules in the request body. Example:

1. Create a file named `newflags.json`. We will modify the backgroud color to `bg-pink-400` for user 2:

```json
{
  "TOGGLE_VIEW_GROW_RATE": {
    "value": false,
    "condition": {
      "email": "user1@acme.com",
      "replace": true
    }
  },
  "TOGGLE_HEADER_BACKGROUND_COLOR": {
    "value": "bg-blue-500",
    "condition": {
      "email": "user2@acme.com",
      "replace": "bg-pink-400"
    }
  }
}
```

2. Do the POST Rest operation:

```bash
curl -X POST -H "Content-Type: application/json" -d @newflags.json http://localhost:3000/flags
```

3. Retrieve user flags for user 2:

```bash
curl -X GET http://localhost:3000/flags?email=user2@acme.com

{"TOGGLE_HEADER_BACKGROUND_COLOR":"bg-pink-400","TOGGLE_VIEW_GROW_RATE":false}
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to explore the demo, modify the code, and use it as a reference for implementing feature flags in your own projects! If you have any questions or issues, please don't hesitate to reach out. Happy coding!