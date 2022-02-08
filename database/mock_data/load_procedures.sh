#!/bin/bash
for filename in procedures/*.sql
do
    mysql --user=dev --password=devpass pradb -e "source $filename"
done