
# Use the official FROM node:18-alpine3.15 image as a parent image
FROM node:18-alpine3.15

RUN mkdir app

# Set the working directory in the container
WORKDIR /app

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app
RUN npm install

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Run the app
CMD ["npm","run","dev","--","--host"]
