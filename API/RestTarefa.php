<?php
require_once('Connection.php');
require_once('Tarefa.php');

$body = file_get_contents('php://input');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            if((!isset($_GET['mes']) || $_GET['mes'] == NULL)
            ||(!isset($_GET['ano']) || $_GET['ano'] == NULL)){
                echo json_encode(array("error" => true, "message" => "(mes, ano) is broken"));
                http_response_code(400);
                return;
            }
    
            $mes = $_GET['mes'];
            $ano = $_GET['ano'];
            
            $connection = new Connection();
            $response = $connection->Select("SELECT * FROM `teste`.`tarefa` WHERE `mes` LIKE '".$mes."' AND `ano` = ".$ano);
            if ($response["error"] == true) {                
                echo json_encode($response);
                return;
            }
            
            $lista = array("Error"=>$response['error'],"data"=>array());
            for ($i = 0; $i < count($response["data"]); $i++) {

                $response1 = $connection->Select("SELECT * FROM `teste`.`check_list` WHERE `tarefa_id` = " . $response["data"][$i]->id); 
                $response_data = array();
                
                if ($response1["error"] == true) {
                    if([$response1["message"] == "No data"]){
                        $response1 = array();
                    }else{
                        echo json_encode($response1);
                        return;
                    }
                }else{
                    $response_data = $response1["data"];
                }

                $tarefa = new Tarefa(
                    $response["data"][$i]->id,
                    $response["data"][$i]->nome,
                    $response["data"][$i]->descricao,
                    $response["data"][$i]->mes,
                    $response["data"][$i]->ano,
                    $response["data"][$i]->notas,
                    $response_data
                );
                array_push($lista["data"], $tarefa);
            }

            // if ($response["error"] == true) {                
            //     echo json_encode($response);
            //     return;
            // }

            echo json_encode($lista);
        } catch (Exception $e) {
            return $e;
        }
        break;
    case 'POST':
        try {
            $jsonBody = json_decode($body, true);

            if((!isset($jsonBody['nome']) || $jsonBody['nome'] == NULL)
                || (!isset($jsonBody['mes']) || $jsonBody["mes"] == NULL)
                || (!isset($jsonBody['ano']) || $jsonBody["ano"] == NULL)
                || (!isset($jsonBody['descricao']))
                || (!isset($jsonBody['notas']))){
                echo json_encode(array("error" => true, "message" => "(nome, mes, ano, descricao, notas) is broken"));
                http_response_code(400);
                return;
            }

            $connection = new Connection();
            $response = $connection->Select(
                "INSERT INTO `teste`.`tarefa` (`nome`, `mes`, `ano`) VALUES ('".$jsonBody['nome']."', '".$jsonBody['mes']."', '".$jsonBody['ano']."');"
            );

            if ($response["error"] == true) {                
                echo json_encode($response);
                return;
            }
            echo json_encode(array("error" => false, "message" => "OK"));

        } catch (Exception $e) {
            return $e;
        }
        break;
    case 'PUT':
        try {
            $jsonBody = json_decode($body, true);

            if((!isset($jsonBody['id']) || $jsonBody['id'] == NULL)){
                echo json_encode(array("error" => true, "message" => "(id) is broken"));
                http_response_code(400);
                return;
            }

            if(isset($jsonBody['altera_mes']) && $jsonBody['altera_mes'] != NULL){
                $connection = new Connection();
                $response = $connection->Select(
                    "UPDATE `teste`.`tarefa`
                    SET `mes` = '".$jsonBody['mes']."'
                    WHERE (`id` = '".$jsonBody['id']."');"
                );
    
                if ($response["error"] == true) {                
                    echo json_encode($response);
                    return;
                }
                echo json_encode(array("error" => false, "message" => "OK"));
                return;
            }

            // var_dump($jsonBody);
            // return;
            if((!isset($jsonBody['nome']) || $jsonBody["nome"] == NULL)
                || (!isset($jsonBody['mes']) || $jsonBody["mes"] == NULL)
                || (!isset($jsonBody['ano']) || $jsonBody["ano"] == NULL)
                || (!isset($jsonBody['descricao']))
                || (!isset($jsonBody['notas']))){
                echo json_encode(array("error" => true, "message" => "(nome, mes, ano, descricao, notas) is broken"));
                http_response_code(400);
                return;
            }

            $connection = new Connection();
            $response = $connection->Select(
                "UPDATE `teste`.`tarefa`
                SET `nome` = '".$jsonBody['nome']."', `descricao` = '".$jsonBody['descricao']."', `notas` = '".$jsonBody['notas']."', `mes` = '".$jsonBody['mes']."', `ano` = '".$jsonBody['ano']."'
                WHERE (`id` = '".$jsonBody['id']."');"
            );

            if ($response["error"] == true) {                
                echo json_encode($response);
                return;
            }
            echo json_encode(array("error" => false, "message" => "OK"));

        } catch (Exception $e) {
            return $e;
        }
        break;
    case 'DELETE':
        try {
            $jsonBody = json_decode($body, true);

            // var_dump($jsonBody);
            // return;
            if((!isset($jsonBody['id']) || $jsonBody['id'] == NULL)){
                echo json_encode(array("error" => true, "message" => "(id) is broken"));
                http_response_code(400);
                return;
            }

            $connection = new Connection();
            $response = $connection->Select(
                "DELETE FROM `teste`.`tarefa` WHERE (`id` = '".$jsonBody['id']."');"
            );

            if ($response["error"] == true) {                
                echo json_encode($response);
                return;
            }
            echo json_encode(array("error" => false, "message" => "OK"));

        } catch (Exception $e) {
            return $e;
        }
        break;
    default:
        // Retornar erro 405 - Método não permitido
        http_response_code(405);
        break;
}
?>