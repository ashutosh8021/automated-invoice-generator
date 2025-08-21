FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy maven files
COPY pom.xml .
COPY src ./src

# Install maven
RUN apt-get update && apt-get install -y maven

# Build application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run application
CMD ["java", "-jar", "target/invoice-generator-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]
