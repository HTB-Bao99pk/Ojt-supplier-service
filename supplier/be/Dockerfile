# Stage 1: Build file jar
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy toan bo source code vao trong docker
COPY . .
# Chay lenh build (bo qua test de build nhanh hơn)
RUN mvn clean package -DskipTests

# Stage 2: Chay file jar
FROM openjdk:21-jdk-slim
WORKDIR /app
# Copy file jar da build tu Stage 1 sang Stage 2
COPY --from=build /app/target/*.jar app.jar
# Mo port
EXPOSE 8080
# lenh khoi chay ung dung
ENTRYPOINT ["java","-jar","app.jar"]