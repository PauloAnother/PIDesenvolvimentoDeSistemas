<?php
class Tarefa{

    function __construct($id, $name, $description, $mes, $ano, $notas, $check_list){
        $this->id = (int)$id;
        $this->nome = $name;
        $this->descricao = $description;
        $this->mes = $mes;
        $this->ano = (int)$ano;
        $this->check_list = (array)$check_list;
        $this->notas = $notas;
    }
}
?>