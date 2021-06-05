FROM node:16-alpine

WORKDIR /app
COPY *.js* ./
RUN npm ci

CMD [ "npm", "start" ]
