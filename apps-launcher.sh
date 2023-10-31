#!/usr/bin/env bash

gnome-terminal --title="api" --tab --command="npm run api" & sleep 10 -s
gnome-terminal --title="admin" --tab --command="npm run admin" & sleep 5 -s
gnome-terminal --title="transporter" --tab --command="npm run transporter" & sleep 5 -s
gnome-terminal --title="driver-web" --tab --command="npm run driver-web" & sleep 5 -s
gnome-terminal --title="driver-serve" --tab --command="npm run driver-serve" & sleep 5 -s
gnome-terminal --title="driver-device" --tab --command="npm run driver-device" & sleep 5 -s
