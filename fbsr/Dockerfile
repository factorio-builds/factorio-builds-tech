# syntax=docker/dockerfile:1.7

# Builds upstream demodude4u/Factorio-FBSR master into an image that runs the
# Web API on port 8080. Replaces the old fbsr-wrapper Spring Boot shim — the
# upstream renderer now ships its own HTTP server with the same JSON contract,
# so a wrapper service is no longer needed.

#######################################################################
# Build stage — clone upstream + warm the local Maven repo
#######################################################################
FROM maven:3.9-eclipse-temurin-21 AS build

# Pin the three upstream repos to specific commits. Bump these deliberately,
# never blindly: an upstream change to the WebAPIService request shape would
# silently break FbsrClient.cs on the backend.
ARG FBSR_REF=master
ARG FDW_REF=master
ARG DCBA_REF=master

WORKDIR /src

RUN git clone --depth 1 --branch ${DCBA_REF} https://github.com/demodude4u/Discord-Core-Bot-Apple.git \
 && git clone --depth 1 --branch ${FDW_REF}  https://github.com/demodude4u/Java-Factorio-Data-Wrapper.git \
 && git clone --depth 1 --branch ${FBSR_REF} https://github.com/demodude4u/Factorio-FBSR.git

# Build order: DCBA → FDW → FBSR (FBSR depends on the other two as SNAPSHOTs).
RUN --mount=type=cache,target=/root/.m2 \
    mvn -q -B -DskipTests install -f Discord-Core-Bot-Apple/DiscordCoreBotApple/pom.xml \
 && mvn -q -B -DskipTests install -f Java-Factorio-Data-Wrapper/FactorioDataWrapper/pom.xml \
 && mvn -q -B -DskipTests install -f Factorio-FBSR/FactorioBlueprintStringRenderer/pom.xml

# Warm the local Maven cache for offline runtime use. `dependency:go-offline`
# alone misses some transitive plugin deps, so we also run an actual
# `exec:java help` — that exercises the exact codepath the runtime entrypoint
# takes, so any missing artifact fails the build instead of first `docker run`.
# Then copy ~/.m2 out of the buildkit cache mount so the runtime stage can
# pick it up.
RUN --mount=type=cache,target=/root/.m2 \
    echo '{}' > /src/config.json \
 && mvn -q -B -f Factorio-FBSR/FactorioBlueprintStringRenderer/pom.xml \
        dependency:go-offline \
 && mvn -q -B -f Factorio-FBSR/FactorioBlueprintStringRenderer/pom.xml \
        exec:java -Dexec.args="help" \
 && rm /src/config.json \
 && cp -r /root/.m2 /m2

#######################################################################
# Runtime stage
#######################################################################
FROM maven:3.9-eclipse-temurin-21

# fontconfig: FBSR renders text labels via java.awt → needs a fontconfig setup.
RUN apt-get update \
 && apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core \
 && rm -rf /var/lib/apt/lists/*

# /fbsr     — source tree (pom + src) we drive with `mvn exec:java`
# /data     — runtime working directory: config.json, profiles/, build/, assets/
#             Mount a named volume here so first-run asset build is reused.
ENV FBSR_HOME=/fbsr \
    FBSR_DATA=/data \
    JAVA_TOOL_OPTIONS="-Xmx4g"

COPY --from=build /src/Factorio-FBSR/FactorioBlueprintStringRenderer ${FBSR_HOME}
COPY --from=build /m2 /root/.m2

WORKDIR ${FBSR_DATA}

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
