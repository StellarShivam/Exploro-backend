# 1. Choose a Base Image
FROM node:19.5

# 2. Set the Working Directory
WORKDIR /app

# 3. Copy the Application Files
COPY package.json package-lock.json ./ 

# 4. Install Dependencies
RUN npm install

COPY . . 
# 5. Set Environment Variables (optional: for default values)
ENV PORT=3002

ENV MONGO_URI=mongodb+srv://shivamanand216:nQ0WcHWITRCm3lcb@cluster0.iixh7.mongodb.net/

ENV JWT_SECRET=somesupersecretsecret

# 6. Expose the Port
EXPOSE 3002

# 7. Define the Entry Point
CMD ["npm", "start"]
