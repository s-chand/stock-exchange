FROM node:latest

ENV WORKDIR /usr/src/app
ENV LOGS_DIR /tmp/logs
ENV PORT ${PORT}

RUN mkdir -p ${WORKDIR} ${LOGS_DIR}

ADD package.json /tmp/package.json
RUN cd /tmp && npm install

ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /opt/app/wait-for-it.sh

RUN cp -a /tmp/node_modules ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
RUN ls -al

COPY ./config/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh /opt/app/wait-for-it.sh

ENTRYPOINT [ "/entrypoint.sh" ]
