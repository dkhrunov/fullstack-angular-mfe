-- Filling of user
INSERT INTO 
  public."user" (email, password, isConfirmed)
VALUES
  ('test@test.com', '$2b$10$ZQWhMolfHjNQGMDfcjjPN.pEjJDwbyEWvdseWEzFb/qYoPHES2/Iq', TRUE),
  ('den.uru@mail.ru', '$2b$10$ZQWhMolfHjNQGMDfcjjPN.pEjJDwbyEWvdseWEzFb/qYoPHES2/Iq', TRUE),
  ('therealpanda@mail.ru', '$2b$10$ZQWhMolfHjNQGMDfcjjPN.pEjJDwbyEWvdseWEzFb/qYoPHES2/Iq', FALSE);

-- --
-- -- PostgreSQL database dump
-- --

-- -- Dumped from database version 13.2
-- -- Dumped by pg_dump version 13.2

-- -- Started on 2023-01-24 01:22:18 MSK

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- --
-- -- TOC entry 3258 (class 0 OID 33797)
-- -- Dependencies: 201
-- -- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- COPY public."user" (id, email, password, "isConfirmed") FROM stdin;
-- 18	den.uru@mail.ru	$2b$10$ZQWhMolfHjNQGMDfcjjPN.pEjJDwbyEWvdseWEzFb/qYoPHES2/Iq	t
-- 57	therealpanda98@gmail.com	$2b$10$2ywtLqS7J0x3wNt0y31Jo.893pqVOlp/bdIlkxAM/zPSugZsTtGr.	t
-- \.


-- --
-- -- TOC entry 3265 (class 0 OID 0)
-- -- Dependencies: 200
-- -- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.user_id_seq', 59, true);


-- -- Completed on 2023-01-24 01:22:19 MSK

-- --
-- -- PostgreSQL database dump complete
-- --

