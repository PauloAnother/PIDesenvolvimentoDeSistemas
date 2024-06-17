<?php
class Connection{
    
    public function __construct(){}
     
    private function __clone(){}
     
    public function __destruct() {
        $this->disconnect();
        foreach ($this as $key => $value) {
            unset($this->$key);
        }
    }
     
    private static $dbtype   = "mysql";
    private static $host     = "localhost";
    private static $port     = "3306";
    private static $user     = "root";
    private static $password = "Administrator01!";
    private static $db       = "teste";
     
    private function getDBType()  {return self::$dbtype;}
    private function getHost()    {return self::$host;}
    private function getPort()    {return self::$port;}
    private function getUser()    {return self::$user;}
    private function getPassword(){return self::$password;}
    private function getDB()      {return self::$db;}
     
    private function connect(){
        try{
            $this->connection = new PDO(
                $this->getDBType().":host=".
                $this->getHost().";port=".
                $this->getPort().";dbname=".
                $this->getDB(), 
                $this->getUser(), 
                $this->getPassword()
            );
        }catch (PDOException $p){
            die("Erro no metodo Connection.connect(): " . $p->getMessage());
        }
         
        return ($this->connection);
    }
     
    private function disconnect(){
        $this->connection = null;
    }
     
    //Método select que retorna um array de objetos
    public function Select($sql,$params=null){
        $query=$this->connect()->prepare($sql);
        $response = null;
           
        if(!$query->execute($params)){
            $error = $query->errorInfo();
            return array("error" => true, "message" => "Select failure (".$error[2].")");
        }
        
        $response = $query->fetchAll(PDO::FETCH_OBJ);

        if($query->rowCount() > 0) {
            return array("error" => false, "data"=> $response);
        }else{
            return array("error" => true, "message" => "No data");
        }
        $this->__destruct();
    }
     
    //Método insert que retorna o último id inserido
    public function Insert($sql,$params=null){
        $connection=$this->connect();
        $query=$connection->prepare($sql);

        try {
            $response = $query->execute($params);

            if(!$response) {
                $error = $query->errorInfo();
                if($error[1] == 1062) {
                    return array("error" => true, "message" => "Value alredy exists");
                } else {
                    return array("error" => true, "message" => "Insert failure (".$error[2].")");
                }
            }
            // var_dump($connection->lastInsertId());
          
            return array("error" => false, "message" => "Add data success");
            //$response = $connection->lastInsertId() or die(print_r($query->errorInfo(), true));

    
            
        } catch (PDOException $e) {
            $query->errorInfo();
            echo "error";
            return;
        }
        // $this->__destruct();
        return $response;
    }
     
    //Método update que retorna o número de linhas afetadas
    public function Update($sql,$params=null){
        $query=$this->connect()->prepare($sql);
      
        if($query->execute($params)) {
           
            if($query->rowCount() >= 1) {
                return array("error" => false, "message" => "Update data success");
            }
            return array("error" => true, "message" => "No data to Update");
        } else {
            $error = $query->errorInfo();
            return array("error" => true, "message" => "Update failure (".$error[2].")");
        }
    }
        // $this->__destruct();
    
     
    //Método delete que retorna o número de linhas afetadas;
    public function Delete($sql,$params=null){
        $query=$this->connect()->prepare($sql);
        //$query->execute($params);
        $response = $query->rowCount();

        // $query->execute($params);
        // $query->debugDumpParams();
        // die;

        if($query->execute($params)) {
          
            if($query->rowCount() >= 1){
                return array("error" => false, "message" => "Delete success");
            } 
            return array("error" => true, "message" => "No data to delete");
        } else {
            $error = $query->errorInfo();
            return array("error" => true, "message" => "Error on delete data(".$error[2].")");
        }
        
        $this->__destruct();
        return $response;
    }
}
?>