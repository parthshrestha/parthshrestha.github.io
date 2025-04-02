# Use official Node LTS base image
FROM node:22

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install 

# Copy the rest of the application
COPY . .

#expose port (ECS will use this to map traffic)
EXPOSE 8080 

# Environment variable for the server port
ENV  PORT=8080 


# Start the app
CMD ["npm", "start"]
