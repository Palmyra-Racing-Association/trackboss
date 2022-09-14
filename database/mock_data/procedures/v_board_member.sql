DELIMITER //
CREATE VIEW `v_board_member` AS
    SELECT 
        board_id,
        bt.title as title,
        bt.board_title_id as title_id,
        year,
        m.member_id,
        m.first_name, 
        m.last_name,
        m.email
    FROM
        board_member bm
        LEFT JOIN board_member_title bt ON bm.board_title_id = bt.board_title_id
        left join member m on bm.member_id = m.member_id
//