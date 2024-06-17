var timeDisplay = document.getElementById("time")
var auto_close = 0

function refreshTime() {
  var dateString = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
  var formattedString = dateString.replace(", ", " - ")
  timeDisplay.innerHTML = formattedString
  //auto_close++

  if(auto_close > 10){
    windowResize(false)
    auto_close = 0
  }
}

setInterval(refreshTime, 1000)