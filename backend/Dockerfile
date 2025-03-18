FROM node:18-alpine

WORKDIR /dictionary-name

COPY ./ ./

RUN npm config rm proxy
RUN npm config rm https-proxy
RUN npm ci

RUN npm run build

CMD ["npm", "run", "start:prod"]