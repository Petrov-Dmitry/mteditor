<?php

$uploaddir = '/mte/';
$uploadfile = $_SERVER['DOCUMENT_ROOT'].$uploaddir.basename($_FILES['file']['name']);

if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
    $fileInfo = $_POST;
    $fileInfo['url'] = $uploaddir.basename($_FILES['file']['name']);
    print_r(json_encode($fileInfo));
} else {
    echo "Возможная атака с помощью файловой загрузки!<br>\n";
}
