**Install MySQL and UnZip:**
---------------------------------------------------------------------------------------------------------------------------
Install Unzip so we don't have to copy many files over
> sudo apt install zip unzip

Install MySQL
> sudo apt install mysql-server


**Start / Set-up MySQL**
---------------------------------------------------------------------------------------------------------------------------
Start the MySQL Server
> sudo /etc/init.d/mysql start	

Start security script promps ( My options were N, test123, N, N, Y, Y)
> sudo mysql_secure_installation

Note: If you choose a different password(than test123), you will have to update the .sh files


Then you'll want to make a directory on Ubuntu:
---------------------------------------------------------------------------------------------------------------------------
Place this somewhere you remember, we will have to reference it in a second
>sudo mkdir /mysql-db/ 

Navigate to your project repo IN ubuntu
>cd /mnt/c/Users/[ACTUAL PROJECT REPO PATH]/clubmanager-2.0/database

Copy the mock_data.zip from repo to ubuntu 
>sudo cp mock_data.zip /mysql-db/ <- THIS IS THE DIRECTORY FROM ABOVE


Navigate Back to your /mysql-db/ directory:
---------------------------------------------------------------------------------------------------------------------------
Unzip the mock_data.zip
>sudo unzip mock_data.zip

Change into the directory that contains all of the newly unzipped files
>cd mock_data/

---------------------------------------------------------------------------------------------------------------------------

### Now your database is setup and you have the scripts to populate with mock data

**from /mysql-db/mock_data/ you can run:**

- **bash setup_user.sh** <- You NEED to run this to set up the dbUser
- **bash reset_db.sh** 	<- This will Drop the db(if exists), then load the schema and all of the Mock Data
- bash drop_db.sh		<- This will Drop the database
- bash create_db.sh 	<- This will just generate the DB Schema
