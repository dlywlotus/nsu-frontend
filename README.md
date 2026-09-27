# NSU Forums Frontend

A React frontend for the NSU Forums web application.

## Tech stack

- Routing: React Router
- Fetching, caching and mutations: Tanstack query
- Form validation and error handling: React Hook Form
- Styling: CSS Modules
- Api calls: Axios

## Local development

1. Refer to `.env.example` and create a `.env` file with those variables
2. Run `npm i`, followed by `npm run dev`

## Deployment on EC2

1. Refer to `.env.example` and create a `.env` file with those variables
2. Add the Build the image with
   `docker build -t dlywlotus/nsu-frontend:tagname .`
3. Push the image to docker hub with
   `docker push dlywlotus/nsu-frontend:tagname`
