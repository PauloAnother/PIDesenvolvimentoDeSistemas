const listElement = document.querySelector('ul')
const inputElement = document.querySelector('input')

var id = document.getElementById('id')
var sm = document.getElementById('sm')
var description = document.getElementById('description')
var object_name = document.getElementById('object_name')
var label_window = document.getElementById('label_window')

const div_liberations = document.getElementById('div_liberations')
const div_objects = document.getElementById('div_objects')
const div_checklist = document.getElementById('div_checklist')

const combobox_month = document.getElementById('combobox_month')

var selected_year = JSON.parse(window.localStorage.getItem('selected_year'))
var selected_month = JSON.parse(window.localStorage.getItem('selected_month'))

label_window.textContent = selected_year

//showTasks()
setComboMonthOptions()

function buttonHideChecklist(){
    if (div_checklist.style.display === "none") {
        div_checklist.style.display = 'inline'
    }else{
        div_checklist.style.display = 'none'
    }
}

function updateProgress(value) {    
    i = 1
    var elem = document.getElementById("myBar")
    var width = 0
    var v_id = setInterval(frame, 10)
    function frame() {
        if (width >= value) {
            clearInterval(v_id)
            i = 0
        } else {
            width++
            elem.style.width = width + "%"
            elem.innerHTML = width + "%"
        }
    }
}

function calculateProgress(){
    var item = task_list[selected_position]
    updateProgress(calc(item))    
}

function calculateTaskProgress(p_selected_position){
    var item = task_list[p_selected_position] 
    return Math.round(calc(item))
}

function calc(item){
    if(item == undefined) return 0
    var score_sm = 0
    var score_description = 0
    
    var score_checklist_check = 0

    if(item.nome != null && item.nome != undefined && item.nome != ''){
        score_sm = 1
    }

    if(item.descricao != null && item.descricao != undefined && item.descricao != ''){
        score_description = 1
    }

    if((item.check_list != null && item.check_list != undefined && item.check_list != '') && item.check_list.length > 0){
        item.check_list.forEach(item => {
            if(item["check"] == 1){
                score_checklist_check++
            }
        })
        score_checklist_check = (score_checklist_check * 100 / item.check_list.length)
        score_checklist_check = score_checklist_check*0.98
    }else{
        score_checklist_check = 0
    }

    var score_total = score_sm + score_description + score_checklist_check

    return score_total
}

function setComboMonthOptions(){
    var JAN = document.createElement('option')
    JAN.text = 'JAN'
    JAN.value = 'JAN'
    combobox_month.add(JAN)

    var FEV = document.createElement('option')
    FEV.text = 'FEV'
    FEV.value = 'FEV'
    combobox_month.add(FEV)

    var MAR = document.createElement('option')
    MAR.text = 'MAR'
    MAR.value = 'MAR'
    combobox_month.add(MAR)

    var ABR = document.createElement('option')
    ABR.text = 'ABR'
    ABR.value = 'ABR'
    combobox_month.add(ABR)

    var MAI = document.createElement('option')
    MAI.text = 'MAI'
    MAI.value = 'MAI'
    combobox_month.add(MAI)

    var JUN = document.createElement('option')
    JUN.text = 'JUN'
    JUN.value = 'JUN'
    combobox_month.add(JUN)

    var JUL = document.createElement('option')
    JUL.text = 'JUL'
    JUL.value = 'JUL'
    combobox_month.add(JUL)

    var AGO = document.createElement('option')
    AGO.text = 'AGO'
    AGO.value = 'AGO'
    combobox_month.add(AGO)

    var SET = document.createElement('option')
    SET.text = 'SET'
    SET.value = 'SET'
    combobox_month.add(SET)

    var OUT = document.createElement('option')
    OUT.text = 'OUT'
    OUT.value = 'OUT'
    combobox_month.add(OUT)

    var NOV = document.createElement('option')
    NOV.text = 'NOV'
    NOV.value = 'NOV'
    combobox_month.add(NOV)

    var DEZ = document.createElement('option')
    DEZ.text = 'DEZ'
    DEZ.value = 'DEZ'
    combobox_month.add(DEZ)

    if(selected_month){        
        combobox_month.value = selected_month
        showTasks()
    }
}

function monthSelectedChange(){
    selected_month = combobox_month.options[combobox_month.selectedIndex].text
    clear()
    showTasks()
    
    LocalStorageSave(1, selected_month)
}

function getNextAndPreviousMonth(month){
    var json_months = {}
    switch (month){
        case 'JAN':
            json_months['previous'] = 'PVY'
            json_months['next'] = 'FEV'
        break

        case 'FEV':
            json_months['previous'] = 'JAN'
            json_months['next'] = 'MAR'
        break

        case 'MAR':
            json_months['previous'] = 'FEV'
            json_months['next'] = 'ABR'
        break

        case 'ABR':
            json_months['previous'] = 'MAR'
            json_months['next'] = 'MAI'
        break

        case 'MAI':
            json_months['previous'] = 'ABR'
            json_months['next'] = 'JUN'
        break

        case 'JUN':
            json_months['previous'] = 'MAI'
            json_months['next'] = 'JUL'
        break

        case 'JUL':
            json_months['previous'] = 'JUN'
            json_months['next'] = 'AGO'
        break

        case 'AGO':
            json_months['previous'] = 'JUL'
            json_months['next'] = 'SET'
        break

        case 'SET':
            json_months['previous'] = 'AGO'
            json_months['next'] = 'OUT'
        break

        case 'OUT':
            json_months['previous'] = 'SET'
            json_months['next'] = 'NOV'
        break

        case 'NOV':
            json_months['previous'] = 'OUT'
            json_months['next'] = 'DEZ'
        break

        case 'DEZ':
            json_months['previous'] = 'NOV'
            json_months['next'] = 'NXY'
        break

        default: 
            json_months['previous'] = undefined
            json_months['next'] = undefined
    }

    return json_months
}

function clear(){
    id.innerText = ''
    sm.value = ''
    description.value = ''
    checklist_description.value = ''
    textarea_notes.value = ''

    taskClear()
    clearChecklist()

    var elem = document.getElementById("myBar")
    var width = 0
    elem.style.width = width + "%"
    elem.innerHTML = width + "%"  
}

function closeTask(){
    window.location.href='desktop.html';
}

function getAllTask(){
    fetch('URL_DO_ENDPOINT')
    .then(response => response.json())
    .then(data => {
        // Manipule os dados da resposta aqui
        console.log(data);
    })
    .catch(error => {
        console.error('Erro ao buscar dados:', error);
    });
}
