# Use a base image with JDK 21
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the executable JAR file into the container
COPY target/music_app_project-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app runs on (9188)
EXPOSE 9188

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
