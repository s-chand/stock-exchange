FROM node:latest

ENV WORKDIR /usr/src/app
ENV LOGS_DIR /tmp/logs
ENV PORT ${PORT}

RUN mkdir -p ${WORKDIR} ${LOGS_DIR}

ADD package.json /tmp/package.json
RUN cd /tmp && npm install


RUN cp -a /tmp/node_modules ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
RUN ls -al

COPY ./config/entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
