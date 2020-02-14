document.getElementById("download_image_button").addEventListener("click",function() {
    document.getElementById("switch_image").click();
});

document.getElementById("switch_image").addEventListener("change",function(event) {
    console.log("метод загрузки загружен");

    if(!this.files || this.files.length < 1){
        alert("Вы не выбрали файл для отправки");
        return;
    }

    var formData = new FormData();
    formData.append('filedata', this.files[0]);
    let URL = "/image/download";
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4) {
            try {
                if(ajax.status != 200) throw new SyntaxError("Статус запроса: " + ajax.status);
                var response = ajax.responseText;
                console.log(response);
                if(JSON.parse(response).status != "ok") throw new SyntaxError("Сервер вернул ответ: " + JSON.parse(response).status);
                location.reload();
            } catch (error) {
                console.log('Ошибка ' + error.name + "\n" + error.message + "\n" + error.stack);
                alert("Не удалось изменить изображение");
            }
        }
    };
    ajax.open("POST", URL);
    ajax.send(formData);
});

