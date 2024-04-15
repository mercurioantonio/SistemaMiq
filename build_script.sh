#!/bin/bash
echo "1 - App : Build script FrontEnd $1"
./build_script_fe.sh $1

echo "2 - App : Build script BackEnd"
./build_script_be.sh

