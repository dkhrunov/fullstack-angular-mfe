-- --
-- -- PostgreSQL database dump
-- --

-- -- Dumped from database version 13.2
-- -- Dumped by pg_dump version 13.2

-- -- Started on 2023-01-24 02:00:21 MSK

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
-- -- TOC entry 3255 (class 0 OID 33811)
-- -- Dependencies: 201
-- -- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
-- --

-- COPY public.token (id, "refreshToken", ip, "expiresIn", "userAgent", "userId") FROM stdin;
-- 61	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImVtYWlsIjoiZGVuLnVydUBtYWlsLnJ1IiwiaWF0IjoxNjY3MDc3ODkzLCJleHAiOjE2NjgyODc0OTN9.epyIbK8ztIIZwRi9thnGi4YlI0z45X_rKOxunBJ5DAE	::1	1668287493	PostmanRuntime/7.29.2	18
-- 65	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTksImVtYWlsIjoibWFqaWtlNzMyNEBvY3RvdmllLmNvbSIsImlhdCI6MTY3MjA5NDM1NCwiZXhwIjoxNjczMzAzOTU0fQ.705dj8Cxiik3KJigbeHJddbaF63WFp53sK8RN5Jez-k	::1	1673303954	PostmanRuntime/7.30.0	59
-- 66	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImVtYWlsIjoiZGVuLnVydUBtYWlsLnJ1IiwiaWF0IjoxNjcyMDk0MzYzLCJleHAiOjE2NzMzMDM5NjN9.eSZxw1CQ6KInDybOIUi3HlcD0bWe41y9ewsPWLEasd4	::1	1673303963	PostmanRuntime/7.30.0	18
-- 62	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImVtYWlsIjoiZGVuLnVydUBtYWlsLnJ1IiwiaWF0IjoxNjY3MDc3OTE4LCJleHAiOjE2NjgyODc1MTh9.bzZb-k8jby4CV_oD2n0zKUpadopSolBAI9WH88A6qvM	::1	1668287518	PostmanRuntime/7.29.2	18
-- 63	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImVtYWlsIjoiZGVuLnVydUBtYWlsLnJ1IiwiaWF0IjoxNjcxNDM3NjI0LCJleHAiOjE2NzI2NDcyMjR9.Vy72VphIPqT3IzXMafsrKJegow0AcZXYiGO5kFo9uVQ	::1	1672647224	PostmanRuntime/7.29.2	18
-- 64	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImVtYWlsIjoiZGVuLnVydUBtYWlsLnJ1IiwiaWF0IjoxNjcxOTgyOTM4LCJleHAiOjE2NzMxOTI1Mzh9.OdWq1ejzal8tOl0TKOsDLyIr0pI0cMZup6i8KTzcKUc	::1	1673192538	PostmanRuntime/7.30.0	18
-- \.


-- --
-- -- TOC entry 3262 (class 0 OID 0)
-- -- Dependencies: 200
-- -- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.token_id_seq', 66, true);


-- -- Completed on 2023-01-24 02:00:21 MSK

-- --
-- -- PostgreSQL database dump complete
-- --

