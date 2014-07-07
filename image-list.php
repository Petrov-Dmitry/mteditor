<?php
/**
 * Здесь нам нужно отдать JSON с массивом картинок,
 * якобы загруженных на сервер ранее
 */
$imgList = array();
for ($i = 0; $i < 13; ++$i) {
    $imgList[$i] = array(
        'id' => $i,
        'path' => '/mte/image.png?'.$i,
        'title' => 'Image title '.$i,
        'alt' => 'Image comment '.$i,
    );
}
print_r(json_encode($imgList));
