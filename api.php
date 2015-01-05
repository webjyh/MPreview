<?php
    error_reporting(2);
    $action = htmlspecialchars($_GET['action']);
    $callback = htmlspecialchars($_GET['callback']);
    if ( $action == 'doc' ) {
        $JSON = array(
            'code' => 1,
            'imgs' => array(
                './upload/MPreview_DOC_1.jpg?ver=1.0.0',
                './upload/MPreview_DOC_1.jpg?ver=2.0.0',
                './upload/MPreview_DOC_1.jpg?ver=3.0.0',
                './upload/MPreview_DOC_1.jpg?ver=4.0.0',
                './upload/MPreview_DOC_1.jpg?ver=5.0.0',
                './upload/MPreview_DOC_1.jpg?ver=6.0.0',
                './upload/MPreview_DOC_1.jpg?ver=7.0.0',
                './upload/MPreview_DOC_1.jpg?ver=8.0.0'
            )
        );
    } else {
        $JSON = array(
            'code' => 1,
            'imgs' => array(
                './upload/MPreview_PPT_1.jpg?ver=1.0.0',
                './upload/MPreview_PPT_1.jpg?ver=2.0.0',
                './upload/MPreview_PPT_1.jpg?ver=3.0.0',
                './upload/MPreview_PPT_1.jpg?ver=4.0.0',
                './upload/MPreview_PPT_1.jpg?ver=5.0.0',
                './upload/MPreview_PPT_1.jpg?ver=6.0.0',
                './upload/MPreview_PPT_1.jpg?ver=7.0.0',
                './upload/MPreview_PPT_1.jpg?ver=8.0.0',
            )
        );
    }

    header('Content-type: application/json');
    if ( !empty( $_GET['callback'] ) ){
        echo $callback.'('.json_encode($JSON).')';
    } else {
        echo json_encode($JSON);
    }
?>