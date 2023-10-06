#!/bin/bash

echo "Configuring mc client..."
mc alias set minio $MINIO_HOST $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
if [ $? == 0 ]; then
  echo "Verifying which bucket flags exists... "
  mc ls minio/flags &> /dev/null
  if [ $? == 1 ]; then
    echo "Creating bucket flags..."
    mc mb minio/flags
    echo "Importing flags..."
    mc cp *.json minio/flags
  else
    echo "Bucket exists!"
  fi
fi