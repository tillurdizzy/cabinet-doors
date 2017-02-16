<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$input = json_decode(file_get_contents("php://input"));

define( "DATABASE_SERVER", "flatroofjobs.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "flatroofjobs");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "flatroofjobs");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$PRIMARY_ID = mysqli_real_escape_string($con,$input->PRIMARY_ID);
$unit = mysqli_real_escape_string($con,$input->unit);
$property = mysqli_real_escape_string($con,$input->property);
$room = mysqli_real_escape_string($con,$input->room);
$width = mysqli_real_escape_string($con,$input->width);
$height = mysqli_real_escape_string($con,$input->height);
$hinges = mysqli_real_escape_string($con,$input->hinges);
$pull = mysqli_real_escape_string($con,$input->pull);

$query = "UPDATE doors SET 
unit='".$unit."',
property='".$property."',
room='".$room."',
width='".$width."',
height='".$height."',
hinges='".$hinges."',
pull='".$pull."'
WHERE PRIMARY_ID='".$PRIMARY_ID."'";

$qry_res = mysqli_query($con,$query);

if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'id' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'query' => $query,'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>