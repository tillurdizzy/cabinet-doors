<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
require_once ('vo/cabinetDoorVO.php');
$input = json_decode(file_get_contents("php://input"));

define( "DATABASE_SERVER", "flatroofjobs.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "flatroofjobs");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "flatroofjobs");

//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$unit = mysqli_real_escape_string($con,$input->unit);
$property = mysqli_real_escape_string($con,$input->property);

$query = sprintf("SELECT * FROM doors WHERE unit ='".$unit."' AND property ='".$property."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new cabinetDoorVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->property = $row->property;
	$oneVO->unit = $row->unit;
	$oneVO->room = $row->room;
	$oneVO->width = $row->width;
	$oneVO->height = $row->height;
	$oneVO->hinges = $row->hinges;
	$oneVO->pull = $row->pull;
	
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>