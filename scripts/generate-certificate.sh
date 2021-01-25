#!/usr/bin/env bash

password=$(openssl rand -base64 32)
openssl req -x509 -newkey rsa:4096 -passout pass:$password -keyout key.pem -out cert.pem -days 36500 -subj '/CN=factorio.tech'
openssl pkcs12 -export -aes-256-cbc -in cert.pem -inkey key.pem -passin pass:$password -passout pass: -out certificate.pfx
rm key.pem cert.pem
