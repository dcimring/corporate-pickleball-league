-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Divisions Table
create table divisions (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  play_time text
);

-- Create Teams Table (includes stats)
create table teams (
  id uuid default uuid_generate_v4() primary key,
  division_id uuid references divisions(id),
  name text not null,
  wins int default 0,
  losses int default 0,
  points_for int default 0,
  points_against int default 0,
  -- Extra stats from teamStats
  longest_win_streak int default 0
);

-- Insert Data
WITH
div_0 as (insert into divisions (name, play_time) values ('Cayman Premier League', 'Wednesday 7:30pm') returning id),
div_1 as (insert into divisions (name, play_time) values ('Division A', 'Wednesday 6:30pm') returning id),
div_2 as (insert into divisions (name, play_time) values ('Division B1 / B2', 'Thursday 7:30pm & 8:30pm') returning id),
div_3 as (insert into divisions (name, play_time) values ('Division B3', 'Tuesday 7:30pm & 8:30pm') returning id),
div_4 as (insert into divisions (name, play_time) values ('Division C1', 'Monday 7:30pm & 8:30pm') returning id),
div_5 as (insert into divisions (name, play_time) values ('Division C2', 'Monday 7:30pm & 8:30pm') returning id),
div_6 as (insert into divisions (name, play_time) values ('Division B4', 'Tuesday 7:30pm & 8:30pm') returning id),
div_7 as (insert into divisions (name, play_time) values ('Division C3', 'Monday 7:30pm & 8:30pm') returning id)
insert into teams (division_id, name, wins, losses, points_for, points_against, longest_win_streak)
values
  ((select id from div_1), 'Dilluminati', 8, 1, 96, 45, 6),
  ((select id from div_1), 'Locale Staycationers', 1, 8, 30, 95, 1),
  ((select id from div_1), 'Anglin-Lewis & Associates', 3, 6, 55, 85, 2),
  ((select id from div_1), 'Quality', 6, 3, 88, 60, 4),
  ((select id from div_1), 'The UpSetters', 5, 4, 75, 70, 3),
  ((select id from div_1), 'Century 21', 4, 5, 60, 75, 2),
  ((select id from div_2), 'Conch Picklers', 9, 1, 105, 40, 9),
  ((select id from div_2), 'AON', 7, 3, 90, 65, 4),
  ((select id from div_2), 'The Bird', 8, 2, 98, 55, 5),
  ((select id from div_2), 'McAlpine', 6, 4, 85, 75, 3),
  ((select id from div_2), 'MUFG 1', 5, 5, 70, 70, 2),
  ((select id from div_2), 'North End Re', 4, 6, 60, 85, 2),
  ((select id from div_2), 'GT 1', 4, 6, 65, 80, 2),
  ((select id from div_2), 'McCormick 1', 3, 7, 55, 90, 1),
  ((select id from div_2), 'Conyers 1', 2, 8, 40, 100, 1),
  ((select id from div_2), 'CUC 1', 2, 8, 45, 95, 1),
  ((select id from div_3), 'McGrath Tonner', 9, 1, 102, 45, 7),
  ((select id from div_3), 'Baker Tilly Cayman', 6, 4, 88, 70, 3),
  ((select id from div_3), 'Autonomous', 10, 0, 110, 35, 10),
  ((select id from div_3), 'Dentons', 7, 3, 95, 60, 4),
  ((select id from div_3), 'MHA Cayman', 4, 6, 65, 92, 2),
  ((select id from div_3), 'Kensington Management Group', 1, 9, 40, 105, 1),
  ((select id from div_3), 'Hash Directors', 4, 6, 70, 90, 2),
  ((select id from div_3), 'Dart 1', 5, 5, 78, 82, 3),
  ((select id from div_3), 'KPMG 1', 5, 5, 80, 80, 3),
  ((select id from div_3), 'Greenlight Re 1', 3, 7, 60, 95, 2),
  ((select id from div_3), 'Bogle Insurance Brokers Ltd.', 2, 8, 50, 100, 1),
  ((select id from div_3), 'TechCayman', 3, 7, 55, 98, 1),
  ((select id from div_4), 'Conyers 2', 11, 0, 121, 50, 11),
  ((select id from div_4), 'MUFG 3', 6, 5, 90, 85, 3),
  ((select id from div_4), 'Dart 2', 8, 3, 105, 70, 4),
  ((select id from div_4), 'KPMG 2', 7, 4, 98, 80, 3),
  ((select id from div_4), 'Walkers', 9, 2, 110, 60, 5),
  ((select id from div_4), 'CINICO', 5, 6, 80, 95, 2),
  ((select id from div_4), 'Stuarts Humphries', 6, 5, 88, 90, 3),
  ((select id from div_4), 'Kirk IT', 2, 9, 60, 110, 1),
  ((select id from div_4), 'Waystone', 4, 7, 70, 102, 2),
  ((select id from div_4), 'Mourant', 4, 7, 75, 100, 2),
  ((select id from div_4), 'Royal Bank of Canada Insurance Co', 3, 8, 65, 105, 1),
  ((select id from div_4), 'Healthy Futures', 1, 10, 50, 115, 0),
  ((select id from div_5), 'Phoenix Ltd', 10, 1, 115, 55, 8),
  ((select id from div_5), 'CUC 2', 7, 4, 95, 75, 3),
  ((select id from div_5), 'Greenlight Re 2', 8, 3, 100, 70, 4),
  ((select id from div_5), 'CSC', 9, 2, 108, 60, 5),
  ((select id from div_5), 'Calderwood', 6, 5, 90, 85, 3),
  ((select id from div_5), 'Expertise Group Cayman', 6, 5, 88, 88, 3),
  ((select id from div_5), 'IRIS 365 Slammers', 4, 7, 78, 98, 2),
  ((select id from div_5), 'MBTS', 4, 7, 75, 100, 2),
  ((select id from div_5), 'Paget-Brown Financial Services', 3, 8, 70, 105, 1),
  ((select id from div_5), 'Digicel', 2, 9, 65, 110, 1),
  ((select id from div_5), 'Metabase58 Cayman Limited', 5, 6, 82, 92, 2),
  ((select id from div_5), 'The Security Centre Ltd.', 2, 9, 60, 112, 1),
  ((select id from div_6), 'MUFG 2', 11, 1, 125, 60, 7),
  ((select id from div_6), 'GT 2', 8, 4, 105, 80, 4),
  ((select id from div_6), 'McCormick 2', 6, 6, 92, 95, 3),
  ((select id from div_6), 'RBC Dominion Securities', 10, 2, 118, 65, 5),
  ((select id from div_6), 'Pickle Tickle LTD', 9, 3, 110, 75, 4),
  ((select id from div_6), 'CIRCA', 7, 5, 98, 90, 3),
  ((select id from div_6), 'Harneys', 6, 6, 90, 98, 3),
  ((select id from div_6), 'BDO', 5, 7, 82, 102, 2),
  ((select id from div_6), 'Strategic Risk Solutions', 5, 7, 85, 100, 2),
  ((select id from div_6), 'Rubis Cayman Islands Limited', 2, 10, 65, 120, 1),
  ((select id from div_6), 'IMS Ltd', 2, 0, 60, 122, 1),
  ((select id from div_6), 'Campbells LLP', 4, 8, 75, 108, 2),
  ((select id from div_6), 'CITCO 1', 3, 9, 70, 115, 1),
  ((select id from div_7), 'KPMG 3', 5, 0, 55, 20, 5),
  ((select id from div_7), 'CITCO 2', 3, 0, 45, 35, 2),
  ((select id from div_7), 'Rawlinson & Hunter', 2, 3, 38, 42, 1),
  ((select id from div_7), 'Tower Research Capital', 4, 1, 50, 30, 3),
  ((select id from div_7), 'Samson Law', 1, 4, 30, 48, 1),
  ((select id from div_7), 'Kimpton Seafire / Hotel Indigo', 0, 5, 25, 55, 0)
;