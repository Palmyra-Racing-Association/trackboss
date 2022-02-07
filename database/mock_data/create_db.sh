#!/bin/bash
mysql --user=dev --password=devpass -e "source InitSchema.sql"
./load_procedures.sh