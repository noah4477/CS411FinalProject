FROM node:13.10.1-alpine

RUN mkdir -p /srv/app/frontend
WORKDIR /srv/app/frontend

COPY package.json /srv/app/frontend

RUN npm install

COPY . /srv/app/frontend/
# npm/webpack build here

CMD ["npm", "start"]