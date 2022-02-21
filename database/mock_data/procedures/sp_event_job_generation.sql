DELIMITER //
CREATE PROCEDURE sp_event_job_generation(
IN _event_date DATE, 
IN _event_type_id INT, 
IN _event_name VARCHAR(255), 
IN _event_description VARCHAR(255)
)
BEGIN
    
    DECLARE finished INTEGER DEFAULT 0;
    DECLARE cur_job_type INTEGER DEFAULT 0;
    DECLARE cur_count INTEGER DEFAULT 0;
	DECLARE sqlDOW INT;
    
    DECLARE cursorEJ CURSOR FOR
		select job_type_id, count from event_job 
		where event_type_id = _event_type_id;
	
    DECLARE CONTINUE HANDLER
    FOR NOT FOUND SET finished = 1;
    
    ## Insert our new event and grab its ID
	INSERT INTO event(date, event_type_id, event_name, event_description) VALUES (_event_date, _event_type_id, _event_name, _event_description);
    SELECT LAST_INSERT_ID() INTO @Event_Id;
    
    ## Open the cursor to start our job generation
    OPEN cursorEJ;
    getEventJob: LOOP
		FETCH cursorEJ INTO cur_job_type, cur_count;
		IF finished = 1 THEN 
			leave getEventJob;
		END IF;
        
        SET @K = 1; # This counter is to handle count from event_job
		lab1: REPEAT
        
        SELECT job_day_number INTO @JobDayNumber FROM job_type WHERE job_type_id = cur_job_type; #Get the JobDayNumber(this was taken from Alan DB)
        
        SET sqlDOW = (@JobDayNumber + 1) % 7; #Convert to something SQL likes
        SET @JobDate = STR_TO_DATE(CONCAT(YEAR(_event_date),' ',WEEK(_event_date),' ',sqlDOW), '%X %V %w');

		INSERT INTO job(event_id, job_type_id, job_date,verified, paid) VALUES (@Event_Id, cur_job_type, NULLIF(@JobDate,null), 0, 0);
        Set @k = @k +1;
		UNTIL @K > cur_count END REPEAT lab1;
        
    END LOOP getEventJob;
    CLOSE cursorEJ;
    
END//
