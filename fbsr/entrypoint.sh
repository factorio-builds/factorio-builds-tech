#!/usr/bin/env bash
set -euo pipefail

# FBSR launcher: configures the renderer on first start, then runs `bot-run`.
#
# Required env (only on the FIRST start of a fresh ${FBSR_DATA} volume):
#   FACTORIO_INSTALL    — path to a Factorio install root (must contain bin/, data/)
#   MODPORTAL_USERNAME  — Factorio mod portal account (downloads space-age, quality, …)
#   MODPORTAL_PASSWORD  — mod portal password
#
# Optional:
#   FBSR_WEBAPI_PORT    — defaults to 8080
#   FBSR_PROFILE        — defaults to vanilla
#   FBSR_FORCE_REBUILD  — if "1", regenerates assets on this start

FBSR_HOME="${FBSR_HOME:-/fbsr}"
FBSR_DATA="${FBSR_DATA:-/data}"
WEBAPI_PORT="${FBSR_WEBAPI_PORT:-8080}"
PROFILE="${FBSR_PROFILE:-vanilla}"

cd "${FBSR_DATA}"

fbsr() {
    # Always run from $FBSR_DATA so config.json + profiles/ resolve there.
    # -q to silence Maven's transitive download chatter; the FBSR app itself
    # logs via slf4j to stdout.
    mvn -q -B -f "${FBSR_HOME}/pom.xml" -o exec:java -Dexec.args="$*"
}

write_initial_config() {
    cat > "${FBSR_DATA}/config.json" <<EOF
{
    "discord": { "enabled": false },
    "webapi": {
        "enabled": true,
        "bind": "0.0.0.0",
        "port": ${WEBAPI_PORT},
        "local_storage": "${FBSR_DATA}/output"
    },
    "fbsr": {
        "profiles": "${FBSR_DATA}/profiles",
        "build":    "${FBSR_DATA}/build",
        "assets":   "${FBSR_DATA}/assets"
    },
    "factorio": {
        "install": "${FACTORIO_INSTALL:-}",
        "executable": ""
    },
    "modportal": {
        "username": "${MODPORTAL_USERNAME:-}",
        "password": "${MODPORTAL_PASSWORD:-}"
    }
}
EOF
}

needs_build() {
    [[ "${FBSR_FORCE_REBUILD:-0}" == "1" ]] && return 0
    [[ ! -d "${FBSR_DATA}/profiles/${PROFILE}" ]] && return 0
    [[ ! -f "${FBSR_DATA}/assets/${PROFILE}.zip" ]] && return 0
    return 1
}

if [[ ! -f "${FBSR_DATA}/config.json" ]]; then
    echo ">>> fbsr: first run on this volume — writing config.json"
    : "${FACTORIO_INSTALL:?FACTORIO_INSTALL must be set on first run (path to factorio install root)}"
    : "${MODPORTAL_USERNAME:?MODPORTAL_USERNAME must be set on first run}"
    : "${MODPORTAL_PASSWORD:?MODPORTAL_PASSWORD must be set on first run}"
    write_initial_config
fi

if needs_build; then
    echo ">>> fbsr: building profile '${PROFILE}' (one-time; needs lots of heap)"
    if [[ ! -d "${FBSR_DATA}/profiles/${PROFILE}" ]]; then
        fbsr profile-default-vanilla
    fi
    # Asset build can be heap-hungry. Override JAVA_TOOL_OPTIONS for this step.
    JAVA_TOOL_OPTIONS="-Xmx${FBSR_BUILD_HEAP:-12g}" fbsr build "${PROFILE}"
fi

echo ">>> fbsr: starting bot (Web API on :${WEBAPI_PORT})"
exec mvn -q -B -f "${FBSR_HOME}/pom.xml" -o exec:java -Dexec.args="bot-run ${PROFILE}"
