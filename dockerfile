FROM node:12

# create app directory
WORKDIR /usr/src/app

#install app dependencies
COPY package*.json ./

# run dependencies
RUN npm install

# bundle app code
COPY . .

EXPOSE 8080

CMD [ "node", "handlers.js" ]

# 1. build docker container
#$docker build -t [user/tag] . 

#check it's in images
#$docker images

#to see running containers
#docker ps 

#docker run -p 49160:8080 --name BlockchainAssignment -d ankitsingh2577/x20104707