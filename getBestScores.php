<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *.github.io");
	include('../php/DB_connect.php');
	
	$req = $bdd->query('SELECT id, p_name, score FROM statistics_1p ORDER BY wave, score ASC');
	$data_1p = $req->fetch();
	
	$req = $bdd->query('SELECT id, p_p1name, p_p2name, score_1p, score_2p FROM statistics_2p ORDER BY (score_1p + score_2p) DESC');
	$data_2p = $req->fetch();
	
	$json = array(
		'p1' => array(
			'id' => $data_1p['id'],
			'name' => (isset($data_1p['p_name']) ? $data_1p['p_name'] : ''),
			'score' => (isset($data_1p['score']) ? $data_1p['score'] : 0)
		),
		'p2' => array(
			'id' => $data_2p['id'],
			'name_1p' => (isset($data_2p['p_p1name']) ? $data_2p['p_p1name'] : ''),
			'name_2p' => (isset($data_2p['p_p2name']) ? $data_2p['p_p2name'] : ''),
			'score_1p' => (isset($data_2p['score_1p']) ? $data_2p['score_1p'] : 0),
			'score_2p' => (isset($data_2p['score_2p']) ? $data_2p['score_2p'] : 0)
		)
	);
	
	echo json_encode($json);
?>