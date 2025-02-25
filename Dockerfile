# Start your image with a node base image
FROM node:18.12.1

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./


# Copy local directories to the current local directory of our docker image (/app)
COPY ./ ./

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN apt-get update && \
    apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y && \
    rm -fr node_modules && \
    npm install typescript -g && \
    npm install nodemon -g && \
    npm install dotenv -g && \
    npm install && \
    npm run prebuild && \
    npm run build 
    

EXPOSE 4343

# Start the app using serve command
CMD npm run server