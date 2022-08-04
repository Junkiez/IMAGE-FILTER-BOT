Telegram.WebApp.ready();

function download() {
    var d = document.getElementById("dialog")
    d.showModal()
    let canvas1 = document.getElementById('avatar');
    var image1 = document.createElement("img");
    if(image1.complete){
    base64image = canvas1.toDataURL()


    var oReq = new XMLHttpRequest();
    let form = new FormData();
    let redis_key = Math.round(+new Date()/1000)
    form.append("key", redis_key)
    form.append("dat", base64image)
    oReq.onload = () => {
        const data = JSON.stringify({ key: redis_key });
        Telegram.WebApp.sendData(data);
        Telegram.WebApp.close();
    };
    oReq.open("POST", window.location.origin+"/api", false);
    oReq.send(form);
        d.close()
} else {
    image1.onload = () => {
        base64image = canvas1.toDataURL()
    
        var oReq = new XMLHttpRequest();
        let form = new FormData();
        let redis_key = Math.round(+new Date()/1000)
        form.append("key", redis_key)
        form.append("dat", base64image)
        oReq.onload = () => {
            const data = JSON.stringify({ key: redis_key });
            Telegram.WebApp.sendData(data);
            Telegram.WebApp.close();
        };
        oReq.open("POST", window.location.origin+"/api", false);
        oReq.send(form);
        d.close()
    }
}
    // or download if use it like web app
    /*
    var link = document.createElement('a');
    link.download = 'filteredPhoto.png';
    link.href = document.getElementById('avatar').toDataURL()
    link.click();
    */
}

const chooseFile = document.getElementById("choose-file");

function getImgData() {
    const files = chooseFile.files[0];
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            draw(this.result, set[document.getElementById('functions').value])
        })
        }
    }

chooseFile.addEventListener("change", function () {
    getImgData();
});

const list = document.getElementById('functions')
for (let i in set) {
    list.innerHTML += `<option value="${i}">${i}</option>`
}

Telegram.WebApp.expand();
