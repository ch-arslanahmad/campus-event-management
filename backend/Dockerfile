# Stage 1: Build the Spring boot Application (build)
FROM maven:3.9-eclipse-temurin-21 AS build

# Set the working directory inside the container
WORKDIR /app

# copy into the container
COPY backend/mvnw ./mvnw
COPY backend/.mvn ./.mvn
COPY backend/pom.xml ./pom.xml

# make it executable and download dependencies
RUN chmod +x mvnw
RUN ./mvnw -B dependency:go-offline

# copy the source code into the container build image
COPY backend/src ./src
RUN ./mvnw -B -DskipTests package


## Stage 2: Create smaller runtime image without maven

FROM eclipse-temurin:21-jre AS runtime

# set the working directory
WORKDIR /app

# copy the packaged jar
COPY --from=build /app/target/*.jar app.jar

# document the port the application listens on
EXPOSE 8080

# start the spring boot application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]
