#!/usr/bin/env bash

# this script is temporary until the swagger-gen works in docker

export ASPNETCORE_ENVIRONMENT=Development
export AppConfig__DataDir="$(pwd)"

pushd ./backend

# ok, I will freely admit that this is crazy. but I can't find a better way
# remove the [FromForm] attribute in order to generate the proper types for the payload
sed -i 's/\[FromForm/\[FromBody,Swashbuckle\.AspNetCore\.Annotations\.SwaggerRequestBody/g' src/FactorioTech.Api/Controllers/*.cs

dotnet build && dotnet tool run swagger tofile ./src/FactorioTech.Api/bin/Debug/net5.0/FactorioTech.Api.dll v1 \
  > ../openapi.json

# swap the temporary replacement back to [FromForm]
sed -i 's/\[FromBody,Swashbuckle\.AspNetCore\.Annotations\.SwaggerRequestBody/\[FromForm/g' src/FactorioTech.Api/Controllers/*.cs

popd

pushd ./frontend
npx openapi-typescript@v3.2.3 ../openapi.json \
  --prettier-config .prettierrc \
  --output types/generated-api.ts
popd

rm openapi.json
