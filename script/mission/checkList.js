const table_checklist_body = document.getElementById('table_checklist_body')
var selected_checklist_position = -1

function showChecklist() {

    var task = task_list[selected_position]

    table_checklist_body.innerHTML = ''
    if (task.check_list == null) {
        task.check_list = new Array()
        return
    }

    task.check_list.forEach(item => {
        const pos = task.check_list.indexOf(item)

        var line = document.createElement("tr")
        var td_id = document.createElement("td")
        var td_description = document.createElement("td")
        var td_check = document.createElement("td")
        var td_delete = document.createElement("td")
        var td_up = document.createElement("td")
        var td_down = document.createElement("td")
        
        var s_description = item["descricao"]
        if(s_description.length > 60){
            s_description = s_description.substring(0,58)+'...'
        }

        var t_id = document.createTextNode(item["id"])
        var t_description = document.createTextNode(s_description)

        var check = false
        var el_checklist_check = document.createElement("INPUT")
        el_checklist_check.setAttribute("type", "checkbox")
        el_checklist_check.setAttribute('onclick', `checkChecklist(${pos})`)

        if(item["check"] == 1){
            check = true
        }
        el_checklist_check.checked = check   

        var el_checklist_delete = document.createElement("img")
        el_checklist_delete.setAttribute("type", "img")
        el_checklist_delete.setAttribute("src", "src/delete_icon.svg")
        el_checklist_delete.setAttribute('onclick', `deleteChecklist(${pos})`)
        el_checklist_delete.setAttribute('class', 'button_very_small')

        var el_checklist_up = document.createElement("img")
        el_checklist_up.setAttribute("type", "img")
        el_checklist_up.setAttribute("src", "src/arrow-list-up.svg")
        el_checklist_up.setAttribute('onclick', `upChecklist(${pos})`)
        el_checklist_up.setAttribute('class', 'button_very_small')

        var el_checklist_down = document.createElement("img")
        el_checklist_down.setAttribute("type", "img")
        el_checklist_down.setAttribute("src", "src/arrow-list-down.svg")
        el_checklist_down.setAttribute('onclick', `downChecklist(${pos})`)
        el_checklist_down.setAttribute('class', 'button_very_small')

        td_id.appendChild(t_id)
        td_description.appendChild(t_description)
        td_check.appendChild(el_checklist_check)
        td_delete.appendChild(el_checklist_delete)
        td_up.appendChild(el_checklist_up)
        td_down.appendChild(el_checklist_down)

        //line.appendChild(td_id)
        line.appendChild(td_check)  
        line.appendChild(td_description)    
        line.appendChild(td_up) 
        line.appendChild(td_down) 
        line.appendChild(td_delete) 

        line.setAttribute('onclick', `selectedChecklist(${pos})`)

        table_checklist_body.appendChild(line)
    })
}

function selectedChecklist(position){
    var task = task_list[selected_position]
    var item = task.check_list[position]

    if (item == undefined) return
    selected_checklist_position = position
    checklist_description.value = item.descricao  
}

function addChecklist() {
    if (checklist_description.value == ""){
        alert("Insira a descrição do item")
        return
    }  

    if (id.innerText < 0 || id.innerText == "" || id.innerText == undefined){
        alert("Selecione uma Tarefa")
        return
    } 

    fetch("http://192.168.15.33:80/API/RestChecklist.php", {
        method: "POST",
        body: JSON.stringify({
            tarefa_id: id.innerText,
            descricao: checklist_description.value
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
        
        var task = task_list[selected_position]
        if (task.check_list == null) {
            task.check_list = new Array()
        }
        
        json_array = {}
        json_array["descricao"] = checklist_description.value
        json_array["check"] = false
    
        task.check_list.push(json_array)

        showChecklist()
        showTasks()
        calculateProgress()
        checklist_description.value = ''
    })

    // showChecklist()
    // calculateProgress()
    //LocalStorageSave(null, task_list)
}

function updateChecklist() {
    if (checklist_description.value == ""){
        alert("Insira a descrição do item")
        return
    }     

    if (selected_checklist_position == -1) {
        return
    }

    if (!confirm('Deseja realmente alterar?')) {        
        return
    }

    var task = task_list[selected_position]
    var item = task.check_list[selected_checklist_position]

    fetch("http://192.168.15.33:80/API/RestChecklist.php", {
        method: "PUT",
        body: JSON.stringify({
            id: item.id,
            tarefa_id: id.innerText,
            descricao: checklist_description.value
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
            return
        }

        var task = task_list[selected_position]
        if (task.check_list == null) {
            task.check_list = new Array()
        }
        
        json_array = {}
        json_array["descricao"] = checklist_description.value
        json_array["check"] = task_list[selected_position].check_list[selected_checklist_position].check
    
        task_list[selected_position].check_list[selected_checklist_position] = json_array
    
        checklist_description.value = ''
    
        showChecklist()
        calculateProgress()
        //LocalStorageSave(null, task_list)
    })


}

function deleteChecklist() {
    var task = task_list[selected_position]
    if (selected_checklist_position == -1 || selected_checklist_position > task.check_list.length-1) {
        return
    }

    if (!confirm('Deseja realmente remover o item (ID: '+selected_checklist_position+')?')) {        
        return
    }

    task.check_list.splice(selected_checklist_position, 1)
    showChecklist()

    selected_checklist_position = -1

    lib.value = ''
    calculateProgress()
    LocalStorageSave(null, task_list)
}

function deleteChecklist(inner_position) {
    var task = task_list[selected_position]
    if (inner_position == -1 || inner_position > task.check_list.length-1) {
        return
    }

    if (!confirm('Deseja realmente remover o item (ID: '+inner_position+')?')) {        
        return
    }

    fetch("http://192.168.15.33:80/API/RestChecklist.php", {
        method: "DELETE",
        body: JSON.stringify({
            tarefa_id: id.innerText,
            id: task.id
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

        task.check_list.splice(inner_position, 1)
        showChecklist()
    
        lib.value = ''
        calculateProgress()
        LocalStorageSave(null, task_list)
    })
}

function checkChecklist(position){
    var task = task_list[selected_position]
    var item = task.check_list[position]

    var checked = item.check  
    if(checked == 1){
        checked = '0'
    }else{
        checked = '1'
    }

    fetch("http://192.168.15.33:80/API/RestChecklist.php", {
        method: "PUT",
        body: JSON.stringify({
            id: item.id,
            tarefa_id: id.innerText,
            check: checked
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
        item.check = checked
        task.check_list[position] = item
        calculateProgress()
    })

    // calculateProgress()
    // LocalStorageSave(null, task_list)
}

function upChecklist(inner_position) {
    if (inner_position == 0) {
        return
    }
    
    json_array = {}
    json_array["descricao"] = task_list[selected_position].check_list[inner_position-1].id
    json_array["descricao"] = task_list[selected_position].check_list[inner_position-1].descricao
    json_array["check"] = task_list[selected_position].check_list[inner_position-1].check

    task_list[selected_position].check_list[inner_position-1] = task_list[selected_position].check_list[inner_position]
    task_list[selected_position].check_list[inner_position] = json_array

    showChecklist()
    calculateProgress()
    LocalStorageSave(null, task_list)
}

function downChecklist(inner_position) {
    if (inner_position >= task_list[selected_position].check_list.length-1) {
        return
    }
    
    json_array = {}
    json_array["id"] = task_list[selected_position].check_list[inner_position+1].id
    json_array["descricao"] = task_list[selected_position].check_list[inner_position+1].descricao
    json_array["check"] = task_list[selected_position].check_list[inner_position+1].check

    task_list[selected_position].check_list[inner_position+1] = task_list[selected_position].check_list[inner_position]
    task_list[selected_position].check_list[inner_position] = json_array

    showChecklist()
    calculateProgress()
    LocalStorageSave(null, task_list)
}

function clearChecklist(){
    table_checklist_body.innerHTML = ''    
    selected_checklist_position = -1
}
