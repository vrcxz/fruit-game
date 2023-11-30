<?php

if(isset($_SERVER['REQUEST_METHOD']) &&
   $_SERVER['REQUEST_METHOD'] == 'POST'){
 $name = $_POST['name'];
 $score = $_POST['score'];
    
 $database = new PDO('sqlite:scores.db');
 $query = $database->prepare("INSERT INTO scores(name,score) VALUES('{$name}',{$score});");
 $query->execute();
 header('Location: scores_page.html');

}
else{
 echo 'SERVER REQUEST METHOD is unavailable.';
}

exit;
?>