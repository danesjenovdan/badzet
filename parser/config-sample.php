<?php
//	Env settings
ini_set ('max_execution_time', 0);
ini_set ('default_socket_timeout', 180);
ini_set ('memory_limit', '512M');
date_default_timezone_set ("Europe/Sarajevo");
setlocale (LC_ALL, 'bs_BA.UTF8');


define ('PG_HOST',	'127.0.0.1');
define ('PG_PORT',	5432);
define ('PG_USER',	'user');
define ('PG_PASS',	'pass');
define ('PG_NAME',	'databasename');



$conn = pg_connect("host=".PG_HOST." port=".PG_PORT." dbname=".PG_NAME." user=".PG_USER." password=".PG_PASS);
if (!$conn) die ('Cannot connect to DB');
