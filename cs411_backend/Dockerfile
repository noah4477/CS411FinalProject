FROM node:13.10.1-alpine

RUN mkdir -p /srv/app/backend
WORKDIR /srv/app/backend

COPY package-lock.json /srv/app/backend
COPY package.json /srv/app/backend

RUN npm install

COPY . /srv/app/backend/

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start