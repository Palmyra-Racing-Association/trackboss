DELIMITER //
CREATE PROCEDURE `sp_patch_board_member`(
IN _board_id INT,
IN _year INT,
IN _member_id INT,
IN _board_title_id INT
)
BEGIN
	SELECT year, member_id, board_title_id
    INTO @cur_year, @cur_member_id, @cur_board_title_id
    FROM board_member 
    WHERE board_id = _board_id;
    
    UPDATE board_member SET
		year = IFNULL(_year, @cur_year),
        member_id = IFNULL(_member_id, @cur_member_id),
        board_title_id = IFNULL(_board_title_id, @cur_board_title_id)
	WHERE board_id = _board_id;
END//