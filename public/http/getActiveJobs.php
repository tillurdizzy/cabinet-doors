<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/jobVO.php');

define( "DATABASE_SERVER", "flatroofjobs.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "flatroofjobs");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "flatroofjobs");

//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM door_jobs WHERE status > 0");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new jobVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->property = $row->property;
	$oneVO->address = $row->address;
	$oneVO->status = $row->status;
	
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>