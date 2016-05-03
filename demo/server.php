<?php
  error_reporting(E_ALL);

  $type = $_SERVER['CONTENT_TYPE'];
  $override = $_SERVER['HTTP_X_HTTP_METHOD'];
  $method = $_SERVER['REQUEST_METHOD'];

  $response = [
    'foo' => 'bar',
    'request' => [
      'method' => $method,
      'type' => $type,
      // If http server doesn't allow PUT, DELETE methods.
      'isOverriden' => isset($override),
      'overrideMethod' => $override
    ]
  ];

  // For adding an extra delay in seconds.
  if ($_REQUEST['timeout']) {
    sleep((int)$_REQUEST['timeout']);
  }

  header('Content-Type: ' . $type . '; charset=utf-8');
  echo json_encode($response);
  exit;
