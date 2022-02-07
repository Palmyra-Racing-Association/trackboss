#!/bin/bash
mysql --user=dev --password=devpass -e "source DropDB.sql"
mysql --user=dev --password=devpass -e "source InitSchema.sql"
for filename in procedures/*.sql
do
    mysql --user=dev --password=devpass -e "source procedures/$filename"
done
mysql --user=dev --password=devpass pradb -e "source AutoJobGeneration.sql"
mysql --user=dev --password=devpass pradb -e "source PopulateDB.sql"
mysql --user=dev --password=devpass pradb -e "source PopulateDB_Part2.sql"
