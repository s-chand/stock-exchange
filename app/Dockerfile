FROM node:latest

ENV WORKDIR /usr/src/app
ENV PORT ${PORT}

RUN mkdir ${WORKDIR}}

WORKDIR ${WORKDIR}
COPY package.json /
RUN npm install

COPY . .
EXPOSE ${PORT}
ENTRYPOINT [ "npm", "start" ]
