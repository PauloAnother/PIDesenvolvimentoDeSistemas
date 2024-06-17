<?php
require_once('Connection.php');
require_once('Tarefa.php');

$body = file_get_contents('php://input');
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            if((!isset($_GET['tarefa_id']) || $_GET['tarefa_id'] == NULL)){
                echo json_encode(array("error" => true, "message" => "(id) is broken"));
                http_response_code(400);
                return;
            }
    
            $tarefa_id = $_GET['tarefa_id'];

            $connection = new Connection();
            $response = $connection->Select("SELECT * FROM `teste`.`check_list` WHERE `tarefa_id` = '".$tarefa_id."'");
            echo json_encode($response);
        } catch (Exception $e) {
            return $e;
        }
        break;
    case 'POST':
        try {
            $jsonBody = json_decode($body, true);

            if((!isset($jsonBody['descricao']) || $jsonBody['descricao'] == NULL)
                || (!isset($jsonBody['tarefa_id']) || $jsonBody["tarefa_id"] == NULL)){
                echo json_encode(array("error" => true, "message" => "(descricao, tarefa_id) is broken"));
                http_response_code(400);
                return;
            }

            $connection = new Connection();
            $response = $connection->Select("INSERT INTO `teste`.`check_list` (`descricao`, `tarefa_id`) VALUES ('".$jsonBody['descricao']."', '".$jsonBody['tarefa_id']."');");

            echo json_encode($jsonBody);

        } catch (Exception $e) {
            return $e;
        }
        break;
    case 'PUT':
        try {
            $jsonBody = json_decode($body, true);

            if((!isset($jsonBody['id']) || $jsonBody['id'] == NULL)                
                || (!isset($jsonBody['tarefa_id']) || $jsonBody["tarefa_id"] == NULL)){
                echo json_encode(array("error" => true, "message" => "(id, descricao, tarefa_id) is broken"));
                http_response_code(400);
                return;
            }

            if((!isset($jsonBody['descricao']) || $jsonBody['descricao'] == NULL)                
                && (!isset($jsonBody['check']) || $jsonBody["check"] == NULL)){
                echo json_encode($jsonBody);
                // echo json_encode(array("error" => true, "message" => "(descricao, check) is broken"));
                http_response_code(400);
                return;
            }

            if((isset($jsonBody['descricao']) && $jsonBody["descricao"] != NULL)){
                $connection = new Connection();
                $response = $connection->Select(
                    "UPDATE `teste`.`check_list` SET `descricao` = '".$jsonBody['descricao']."' WHERE (`id` = '".$jsonBody['id']."') and (`tarefa_id` = '".$jsonBody['tarefa_id']."');");
    
                echo json_encode($jsonBody);
            }

            if((isset($jsonBody['check']) && $jsonBody["check"] != NULL)){
                $connection = new Connection();
                $response = $connection->Select(
                    "UPDATE `teste`.`check_list` SET `check` = '".$jsonBody['check']."' WHERE (`id` = '".$jsonBody['id']."') and (`tarefa_id` = '".$jsonBody['tarefa_id']."');");
    
                echo json_encode($jsonBody);
            }            

        } catch (Exception $e) {
            return $e;
        }
        break;
    case 'DELETE':
        try {
            $jsonBody = json_decode($body, true);

            if((!isset($jsonBody['id']) || $jsonBody['id'] == NULL)
            | (!isset($jsonBody['tarefa_id']) || $jsonBody["tarefa_id"] == NULL)){
                echo json_encode(array("error" => true, "message" => "(id) is broken"));
                http_response_code(400);
                return;
            }

            $connection = new Connection();
            $response = $connection->Select(
                "DELETE FROM `teste`.`check_list` WHERE (`id` = '".$jsonBody['id']."') and (`tarefa_id` = '".$jsonBody['tarefa_id']."');");

            echo json_encode($jsonBody);

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