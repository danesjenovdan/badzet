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
            $recipe->Konto = $row[1];
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
					budget
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
				RETURNING id
			";

    $done = false;
    $result = pg_query($conn, $sql);
    if (pg_affected_rows($result) > 0) {
        $done = true;
    }

    return $done;
}