FROM node:latest

ENV WORKDIR /usr/src/app
ENV PORT ${PORT}

RUN mkdir ${WORKDIR}

ADD package.json /tmp/package.json
RUN cd /tmp && npm install

RUN mkdir -p ${WORKDIR} && cp -a /tmp/node_modules ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
RUN ls -al

COPY ./config/entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
