INSERT INTO member_types(type, base_dues_amt) VALUES ('admin',100);
INSERT INTO member_types(type, base_dues_amt) VALUES ("membership_admin",100);
INSERT INTO member_types(type, base_dues_amt) VALUES ("member",0);
INSERT INTO member_types(type, base_dues_amt) VALUES ("paid laborer",0);


insert into point_threshold(year,amount) VALUES (2020, 100);
insert into point_threshold(year,amount) VALUES (2021, 100);


insert into board_member_title(title) VALUES ('President');
insert into board_member_title(title) VALUES ('Vice President');
insert into board_member_title(title) VALUES ('Treasurer');
insert into board_member_title(title) VALUES ('Secretray');
insert into board_member_title(title) VALUES ('Equipment Manager');
insert into board_member_title(title) VALUES ('Board Member');
insert into board_member_title(title) VALUES ('Distant Rider Rep.');
insert into board_member_title(title) VALUES ('Director of Data and Automation');
insert into board_member_title(title) VALUES ('Public Relations');


insert into board_member(year, member_id, board_title_id) VALUES (2022, 1, 1);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 2, 2);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 3, 3);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 4, 4);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 5, 5);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 6, 6);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 7, 6);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 8, 6);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 9, 6);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 10, 6);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 12, 7);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 13, 8);
insert into board_member(year, member_id, board_title_id) VALUES (2022, 14, 9);




insert into riding_area_status(area_name,status) VALUES ('Woods Track', 1);
insert into riding_area_status(area_name,status) VALUES ('Main Track', 1);
insert into riding_area_status(area_name,status) VALUES ('Kids Track', 0);


insert into event_type(type,active) VALUES ('Race',1);
insert into event_type(type,active) VALUES ('Race Week',1);
insert into event_type(type,active) VALUES ('XO Race',1);
insert into event_type(type,active) VALUES ('Yearly Job',1);
insert into event_type(type,active) VALUES ('Meeting',1);
insert into event_type(type,active) VALUES ('Harescramble',1);
insert into event_type(type,active) VALUES ('Work Day',1);
insert into event_type(type,active) VALUES ('Camp and Ride',1);
insert into event_type(type,active) VALUES ('Ride Day',1);
