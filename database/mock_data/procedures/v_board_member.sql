DELIMITER //
CREATE VIEW `v_board_member` AS
    SELECT 
        board_id,
        bt.title as title,
        year,
        member_id
    FROM
        board_member bm
        LEFT JOIN board_member_title bt ON bm.board_title_id = bt.board_title_id
//