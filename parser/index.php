<?php

include "config.php";
include "functions.php";


$data = parseData();

foreach ($data as $item) {
    $ok = saveData($item);
    var_dump($ok);
}
