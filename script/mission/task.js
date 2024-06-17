const table_body = document.getElementById('table_body')
var task_list = JSON.parse(window.localStorage.getItem('list_tarefas'))
var selected_position = -1

function showTasks() {
    if (selected_month == '') return

    table_body.innerHTML = ''

    fetch("http://192.168.15.33:80/API/RestTarefa.php?mes="+ selected_month +"&ano=" + selected_year, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }    
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        if(json["error"] == true){
            alert(json["message"])
            return
        }
        
        task_list = json["data"]
        task_list.forEach(item => {
            
            const pos = task_list.indexOf(item)            

            if(item.mes != selected_month || item.ano != selected_year) return

            var line = document.createElement("tr")
            var td_id = document.createElement("td")
            var td_sm = document.createElement("td")
            var td_desc = document.createElement("td")
            var td_progress = document.createElement("td")

            var s_description = item["descricao"]
            if(s_description.length > 30){
                s_description = s_description.substring(0,28)+'...'
            }

            var t_id = document.createTextNode(item["id"])
            var t_sm = document.createTextNode(item["nome"])
            var t_description = document.createTextNode(s_description)
            var t_progress = document.createTextNode(calculateTaskProgress(`${pos}`)+"%")

            td_id.appendChild(t_id)
            td_sm.appendChild(t_sm)
            td_desc.appendChild(t_description)
            td_progress.appendChild(t_progress)

            line.appendChild(td_id)
            line.appendChild(td_sm)
            line.appendChild(td_desc)
            line.appendChild(td_progress)

            line.setAttribute('onclick', `selectedTask(${pos})`)

            table_body.appendChild(line)   

            item=undefined
        })
    })

}

function selectedTask(position){
    clear()
    var item = task_list[position]

    if (item == undefined) return
    selected_position = position

    sm.value = item.nome
    description.value = item.descricao
    textarea_notes.value = item.notas
    
    id.innerText = item.id
    showChecklist()

    calculateProgress()
}

function addTask() {
    // if (sm.value == "" || description.value == ""){
    //     alert("Insira o nome da Tarefa")
    //     return
    // }   

    if(selected_year == '' || selected_year == null || selected_year == undefined){
        alert("Selecione o ano")
        return
    }

    if(selected_month == '' || selected_month == null || selected_month == undefined){
        alert("Selecione o mês")
        return
    }

    json_array = {}
    json_array["year"] = selected_year
    json_array["month"] = selected_month
    json_array["sm"] = sm.value
    json_array["description"] = description.value
    json_array["textarea_notes"] = textarea_notes.value

    json_array["checklist_list"] = new Array()

    if(task_list == null){
        task_list = new Array()
    }
    task_list.push(json_array)

    fetch("http://192.168.15.33:80/API/RestTarefa.php", {
        method: "POST",
        body: JSON.stringify({
            nome: sm.value,
            mes: selected_month,
            ano: selected_year,
            descricao: description.value,
            notas: textarea_notes.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }    
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        if(json["error"] == true){
            alert(json["message"])
        }
        
        clear()
        showTasks()
    })

}

function updateTask(){
    if (sm.value == "" /*|| description.value == ""*/){
        alert("Insira o nome da tarefa")
        return
    }  

    if(selected_year == ''){
        alert("Selecione o ano")
        return
    }

    if(selected_month == ''){
        alert("Selecione o mês")
        return
    }

    if (selected_position == -1) {
        return
    }

    if (!confirm('Deseja realmente alterar?')) {        
        return
    }

    fetch("http://192.168.15.33:80/API/RestTarefa.php", {
        method: "PUT",
        body: JSON.stringify({
            id: id.innerText,
            nome: sm.value,
            mes: selected_month,
            ano: selected_year,
            descricao: description.value,
            notas: textarea_notes.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }    
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        if(json["error"] == true){
            alert(json["message"])
        }
        
        showTasks()
        //LocalStorageSave(null, task_list)
        calculateProgress()
    })

}

function deleteTask() {
    if (selected_position == -1 || selected_position > task_list.length-1) {
        return
    }

    if (!confirm('Deseja realmente remover a tarefa (ID: '+id.innerText+')?')) {        
        return
    }

    fetch("http://192.168.15.33:80/API/RestTarefa.php", {
        method: "DELETE",
        body: JSON.stringify({
            id: id.innerText
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }    
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        if(json["error"] == true){
            alert(json["message"])
        }
        clear()
        showTasks()
        calculateProgress()
    })
}

function upTask() {
    if (selected_position < 0 || selected_position == undefined) {
        return
    }

    var json_months = getNextAndPreviousMonth(selected_month)
    if(json_months.previous == undefined) return

    if(json_months.previous == "PVY"){
        var previous_year = Number(task_list[selected_position].year)-1
        if (!confirm('Deseja realmente mover a tarefa (ID: '+selected_position+') para o ano anterior ('+ previous_year +')?')) {        
            return
        }
        task_list[selected_position].year = previous_year
        task_list[selected_position].month = 'DEZ'
    }else{
        if (!confirm('Deseja realmente mover a tarefa (ID: '+selected_position+') para o mes anterior ('+ json_months.previous +')?')) {        
            return
        }
        fetch("http://192.168.15.33:80/API/RestTarefa.php", {
            method: "PUT",
            body: JSON.stringify({
                id: id.innerText,
                mes: json_months.previous,
                altera_mes: true
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }    
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            if(json["error"] == true){
                alert(json["message"])
            }
            
            task_list[selected_position].month = json_months.previous
            clear()
            calculateProgress()
            showTasks()
        })
    }
}

function downTask() {
    if (selected_position < 0 || selected_position == undefined) {
        return
    }

    var json_months = getNextAndPreviousMonth(selected_month)
    if(json_months.next == undefined) return

    if(json_months.next == "NXY"){
        var next_year = Number(task_list[selected_position].year)+1
        if (!confirm('Deseja realmente mover a tarefa (ID: '+selected_position+') para o proximo ano ('+ next_year +')?')) {        
            return
        }
        task_list[selected_position].year = next_year
        task_list[selected_position].month = 'JAN'
    }else{
        if (!confirm('Deseja realmente mover a tarefa (ID: '+task_list[selected_position].id+') para o proximo mes ('+ json_months.next +')?')) {        
            return
        }

        fetch("http://192.168.15.33:80/API/RestTarefa.php", {
            method: "PUT",
            body: JSON.stringify({
                id: id.innerText,
                mes: json_months.next,
                altera_mes: true
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }    
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            if(json["error"] == true){
                alert(json["message"])
            }
            
            task_list[selected_position].month = json_months.next
            clear()
            calculateProgress()
            //LocalStorageSave(null, task_list)
            showTasks()
        })
    }

}

function taskClear(){
    selected_position = -1
}