FROM node:latest

ENV WORKDIR /usr/src/app
ENV PORT ${PORT}

RUN mkdir ${WORKDIR}

ADD package.json /tmp/package.json
RUN cd /tmp && npm install

RUN mkdir -p ${WORKDIR} && cp -a /tmp/node_modules ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
EXPOSE ${PORT}
ENTRYPOINT [ "npm", "start" ]
