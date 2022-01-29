#!/bin/bash
sudo mysql -u root mysql -e "create user 'dev'@'localhost' identified by 'devpass';"
sudo mysql -u root mysql -e "grant all on *.* to 'dev'@'localhost';ALTER USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY 'devpass'"