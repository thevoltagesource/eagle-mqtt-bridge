FROM node:16-alpine3.12

WORKDIR /app
COPY *.js* ./
RUN npm ci

# Run node directly so it receives SIGTERM from docker stop
CMD [ "node", "bridge.js" ]
