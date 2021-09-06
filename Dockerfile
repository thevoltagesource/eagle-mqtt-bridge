FROM node:16-alpine3.12

WORKDIR /app
COPY *.js* ./
RUN npm ci

CMD [ "npm", "start" ]
