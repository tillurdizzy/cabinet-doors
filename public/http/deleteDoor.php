<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));

define( "DATABASE_SERVER", "flatroofjobs.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "flatroofjobs");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "flatroofjobs");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$ID = mysqli_real_escape_string($con,$data->PRIMARY_ID);
$query = sprintf("DELETE FROM doors WHERE PRIMARY_ID = '".$ID."'");
$result = mysqli_query($con,$query);
echo json_encode($result);
?>