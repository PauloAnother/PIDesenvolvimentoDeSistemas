function LocalStorageSave(action, value) {
    switch (action){
        case 0:
            window.localStorage.setItem('selected_year', JSON.stringify(value))
        break

        case 1:
            window.localStorage.setItem('selected_month', JSON.stringify(value))
        break

        default: //save all
            window.localStorage.setItem('list_tarefas', JSON.stringify(value))
    }    
}