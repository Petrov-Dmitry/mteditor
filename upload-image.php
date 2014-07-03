<?php
$fileInfo = $_POST;

if ($_FILES['file']['name']) {
    $uploaddir = '/mte/';
    $uploadfile = $_SERVER['DOCUMENT_ROOT'].$uploaddir.basename($_FILES['file']['name']);

    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
        $fileInfo['url'] = $uploaddir.basename($_FILES['file']['name']);
    } else {
        echo "Возможная атака с помощью файловой загрузки!<br>\n";
        exit;
    }
}

print_r(json_encode($fileInfo));
