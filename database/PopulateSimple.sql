INSERT INTO member_types(type, base_dues_amt) VALUES ('admin',100);
INSERT INTO member_types(type, base_dues_amt) VALUES ("membership_admin",100);
INSERT INTO member_types(type, base_dues_amt) VALUES ("member",0);
INSERT INTO member_types(type, base_dues_amt) VALUES ("paid laborer",0);

insert into point_threshold(year,amount) VALUES (2020, 100);
insert into point_threshold(year,amount) VALUES (2021, 100);

insert into board_member_title(title) VALUES ('President');
insert into board_member_title(title) VALUES ('Secretray');
insert into board_member_title(title) VALUES ('Treasurer');

insert into riding_area_status(area_name,status) VALUES ('Woods Track', 1);
insert into riding_area_status(area_name,status) VALUES ('Main Track', 1);
insert into riding_area_status(area_name,status) VALUES ('Kids Track', 0);

insert into event_type(type,active) VALUES ('Meeting',1);
insert into event_type(type,active) VALUES ('Open Track',1);
insert into event_type(type,active) VALUES ('Race',1);
insert into event_type(type,active) VALUES ('Pizza Party',1);
