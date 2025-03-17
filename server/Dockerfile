FROM maven:3.9.6-eclipse-temurin-21-alpine as BUILD

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:21-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p /app/uploads && chmod 777 /app/uploads

EXPOSE 8080

ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/voz-cidada
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=admin

ENTRYPOINT ["java", "-jar", "/app/app.jar"]