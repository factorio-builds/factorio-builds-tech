#!/usr/bin/env bash

current_dir=$(pwd)

## patch stuff

cp ${current_dir}/deps/Factorio-FBSR/FactorioBlueprintStringRenderer/res/*.png ${current_dir}/src/main/resources/

## build dependencies

cd ${current_dir}/deps/Discord-Core-Bot-Apple/DiscordCoreBotApple
mvn install

cd ${current_dir}/deps/Java-Factorio-Data-Wrapper/FactorioDataWrapper
mvn install

cd ${current_dir}/deps/Factorio-FBSR/FactorioBlueprintStringRenderer
mvn install

## build package

cd $current_dir
mvn package
