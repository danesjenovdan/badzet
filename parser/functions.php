<?php


function parseData()
{
   $files = array();
    $files[] = "data/bosna-i-hercegovina-2005.csv";
    $files[] = "data/bosna-i-hercegovina-2006.csv";
    $files[] = "data/bosna-i-hercegovina-2007.csv";
    $files[] = "data/bosna-i-hercegovina-2008.csv";
    $files[] = "data/bosna-i-hercegovina-2009.csv";
    $files[] = "data/bosna-i-hercegovina-2010.csv";
    $files[] = "data/bosna-i-hercegovina-2011.csv";
    $files[] = "data/bosna-i-hercegovina-2012.csv";
    $files[] = "data/bosna-i-hercegovina-2013.csv";
    $files[] = "data/bosna-i-hercegovina-2014.csv";

    $recipes = array();

    $year = 2005;
    foreach ($files as $file) {

        $handle = fopen($file, "r");

        $all_konto = array();
        $all_klasa = array();
        $all_klasifikacija = array();
        $all_naziv = array();

        for ($i = 2; $row = fgetcsv($handle, "2000", ";"); ++$i) {

            $recipe = new stdClass();

            $recipe->NazivKorisnika = $row[0];
            $recipe->Konto = ($row[1]=='-') ? 0 : $row[1];
            $recipe->Klasa = ($row[2] == "Prihodi") ? 'income' : 'expense';
            $recipe->Klasifikacija = $row[3];
            $recipe->Naziv = $row[4];
            $recipe->Leto = $year;

            $iznos = $row[5];

            $num = (str_replace(".", "", $iznos));
            $num = floatval(str_replace(",", ".", $num));

            $recipe->Iznos = $num;

            $all_konto[] = $row[1];
            $all_klasa[] = $row[2];
            $all_klasifikacija[] = $row[3];
            $all_naziv[] = $row[4];

            $recipes[] = $recipe;

            var_dump($recipe);
        }


        $year++;
    }
    fclose($handle);


    var_dump(array_unique($all_konto));
    var_dump(array_unique($all_klasa));
    var_dump(array_unique($all_klasifikacija));
    var_dump(array_unique($all_naziv));

    return $recipes;
}

function postData($data){

    $url = 'http://badzet.knedl.si/api/set-data/';

    $nk = $data->NazivKorisnika;
    $ko = $data->Konto;
    $kl = $data->Klasa;
    $kla = $data->Klasifikacija;
    $naziv = $data->Naziv;
    $leto = $data->Leto;
    $money = $data->Iznos;

    $data = array(
        "subject" => $nk,
        "konto"=> $ko,
        "revenue_expenses"=> $kl,
        "classification"=> $kla,
        "name"=> $naziv,
        "year"=> $leto,
        "money"=> $money,
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data, JSON_UNESCAPED_UNICODE));

    $result = curl_exec($ch);
    curl_close($ch);

}

function saveData($data)
{
    global $conn;

    $nk = $data->NazivKorisnika;
    $ko = $data->Konto;
    $kl = $data->Klasa;
    $kla = $data->Klasifikacija;
    $naziv = $data->Naziv;
    $leto = $data->Leto;
    $money = $data->Iznos;

    $sql = "
				INSERT INTO
					badzet_budget
				(
				  subject, 
				  konto, 
				  revenue_expenses, 
				  classification, 
				  name, 
				  year, 
				  money, 
				)
				VALUES
				(
				  '" . pg_escape_string($conn, $nk) . "', 
				  '" . pg_escape_string($conn, $ko) . "', 
				  '" . pg_escape_string($conn, $kl) . "', 
				  '" . pg_escape_string($conn, $kla) . "', 
				  '" . pg_escape_string($conn, $naziv) . "', 
				  '" . pg_escape_string($conn, $leto) . "',
				  '" . pg_escape_string($conn, $money) . "'
				  )
			";

    $done = false;
    $result = pg_query($conn, $sql);
    if (pg_affected_rows($result) > 0) {
        $done = true;
    }

    return $done;
}