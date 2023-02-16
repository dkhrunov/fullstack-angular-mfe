#!/bin/sh 

find . -type d -name 'build' -exec rm -r {} +

mkdir -p build

protoc \
--plugin=../../../../../../node_modules/.bin/protoc-gen-ts_proto \
-I=./ \
--ts_proto_out=./build *.proto \
--ts_proto_opt=nestJs=true \
--ts_proto_opt=addGrpcMetadata=true \
--ts_proto_opt=outputJsonMethods=true \
--ts_proto_opt=outputPartialMethods=true \

touch index.ts
> index.ts

for filename in ./build/*.ts 
do
  path=$(dirname "$file")
  file="$(basename $filename .ts)"
  namespace=$(perl -pe 's/(?:\b|-)(\p{Ll})/\u$1/g' <<< $file)

  echo "export * as $namespace from './build/$file';" >> index.ts
done