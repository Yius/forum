var last = null;
function go(){
    clearInterval(last);
    last = setInterval(`alert(${document.getElementById('line').value})`,3000)
}