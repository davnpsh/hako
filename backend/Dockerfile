# Clean image from Node
FROM node:22-bookworm

# Install Docker
COPY ./scripts/install-docker.sh /tmp/
RUN chmod +x /tmp/install-docker.sh
RUN /tmp/install-docker.sh

WORKDIR /app/backend

COPY . /app/backend/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
