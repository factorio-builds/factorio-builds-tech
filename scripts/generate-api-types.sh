#!/usr/bin/env bash

# this script is temporary until the swagger-gen works in docker

export ASPNETCORE_ENVIRONMENT=Development

pushd ./backend
dotnet build && dotnet tool run swagger tofile ./src/FactorioTech.Api/bin/Debug/net5.0/FactorioTech.Api.dll v1 \
  > ../openapi.json
popd

pushd ./frontend
npx openapi-typescript ../openapi.json --prettier-config .prettierrc --output types/generated-api.ts
popd

rm openapi.json
