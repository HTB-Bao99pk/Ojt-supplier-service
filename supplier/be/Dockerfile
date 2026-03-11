# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
# Copy file jar da build tu Stage 1 sang Stage 2
COPY --from=build /app/target/*.jar app.jar
# Mo port
EXPOSE 8080
# lenh khoi chay ung dung
ENTRYPOINT ["java","-jar","app.jar"]