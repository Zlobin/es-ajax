<?php
  error_reporting(E_ALL);

  $type = $_SERVER['CONTENT_TYPE'];
  $override = $_SERVER['HTTP_X_HTTP_METHOD'];
  $method = $_SERVER['REQUEST_METHOD'];
  $uploadDir = 'uploads/';

  $response = [
    'foo' => 'bar',
    'request' => [
      'method' => $method,
      'type' => $type,
      'isFile' => isset($_FILES, $_FILES['file']),
      // If http server doesn't allow PUT, DELETE methods.
      'isOverriden' => isset($override),
      'overrideMethod' => $override
    ]
  ];

  // For adding an extra delay in seconds.
  if ($_REQUEST['timeout']) {
    sleep((int)$_REQUEST['timeout']);
  }

  // File upload.
  if (isset($_FILES, $_FILES['file'])) {
    $response['request']['fileUploaded'] = false;
    $fileName = $_FILES['file']['name'];
    $fileTmp = $_FILES['file']['tmp_name'];

    if (move_uploaded_file($file_tmp, $uploadDir . $file_name)) {
      $response['request']['fileUploaded'] = true;
    }
  }

  header('Content-Type: ' . $type . '; charset=utf-8');
  echo json_encode($response);
  exit;
