#FROM maven:3.6.3-jdk-11-slim as build
#WORKDIR /app
#
#COPY deps deps
#RUN mvn install --file deps/Discord-Core-Bot-Apple/DiscordCoreBotApple/pom.xml \
# && mvn install --file deps/Java-Factorio-Data-Wrapper/FactorioDataWrapper/pom.xml \
# && mvn install --file deps/Factorio-FBSR/FactorioBlueprintStringRenderer/pom.xml
#
#COPY src src
#COPY pom.xml .
#COPY config.docker.json config.json
#
#RUN mvn package


FROM openjdk:11-jdk-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    fontconfig \
 && rm -rf /var/lib/apt/lists/*

#COPY --from=build /app/target/*.jar /app.jar
COPY target/*.jar /app.jar
COPY config.docker.json config.json

EXPOSE 8080
ENTRYPOINT [ "java", "-classpath", "config.json", "-jar", "/app.jar" ]
