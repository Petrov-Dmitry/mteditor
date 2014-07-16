<?php
header('Content-Type: application/json');

$fileInfo = $_POST ? $_POST : array();

if ($_FILES['file']['name']) {
    $uploaddir = '/mte/';
    $uploadfile = $_SERVER['DOCUMENT_ROOT'].$uploaddir.basename($_FILES['file']['name']);

    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
        $fileInfo['url'] = $uploaddir.basename($_FILES['file']['name']);
        $fileInfo['state'] = true;
    } else {
        $fileInfo['state'] = false;
    }
}

echo(json_encode($fileInfo));
