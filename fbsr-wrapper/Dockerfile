FROM maven:3.6.3-jdk-11-slim as build
WORKDIR /app

COPY deps deps

# patch call to setupWorkingDirectory because it doesn't work in Docker
RUN sed -i '/setupWorkingDirectory();/d' \
    deps/Java-Factorio-Data-Wrapper/FactorioDataWrapper/src/com/demod/factorio/FactorioData.java

RUN mvn install --file deps/Discord-Core-Bot-Apple/DiscordCoreBotApple/pom.xml \
 && mvn install --file deps/Java-Factorio-Data-Wrapper/FactorioDataWrapper/pom.xml \
 && mvn install --file deps/Factorio-FBSR/FactorioBlueprintStringRenderer/pom.xml

COPY src src
COPY pom.xml .

# add resources because they must be part of the main jar
COPY deps/Factorio-FBSR/FactorioBlueprintStringRenderer/res/*.png src/main/resources/

RUN mvn package


FROM openjdk:16-jdk-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    fontconfig \
 && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/*.jar /app.jar

VOLUME /mnt/config

COPY config.docker.json /mnt/config/config.json
RUN ln -s /mnt/config/config.json /config.json

EXPOSE 8080
ENTRYPOINT [ "java", "-classpath", "config.json", "-jar", "/app.jar" ]
