window.addEventListener('load', function () {
    var btnAjouter = document.querySelector("#ajouter")
    var conteneur = document.querySelector("#conteneur")
    btnAjouter.addEventListener("click",()=>{
        let div = document.createElement("div")
        div.className = 'notif'
        conteneur.append(div)
        div.after(btnAjouter);
        div.innerHTML  = 
        `
            <input class="pseudoInput" name="pseudo"></input>
            <label for="">Type de l'alerte :</label>
            <select class="typeSelect" name="type">
                <option value="lancement">lancement</option>
            </select>
            <button id="validerAjout">valider</button>
        `
    })
    window.addEventListener("click",(event)=>{
        let target = event.target
        let notifs =  document.querySelectorAll(".notif")
        let div = notifs[notifs.length-1]
        let divError = document.querySelector("#error")
        if(target.id === "validerAjout"){
            let streamer = document.querySelector("input[name=pseudo]").value
            let type = document.querySelector("select[name=type]").value
            axios.post('/notification/store',
                {
                    data:{
                        streamer :streamer,
                        type :type
                    }
                }
            )
            .then(res => {
                let data = JSON.parse(res.config.data)
                div.innerHTML  = 
                `
                    <h2 class="pseudo">`+data.data.streamer+`</h2>
                    <p class="type">Type de l'alerte :`+data.data.type+`</p>
                    <p class="etat">on</p>
        
                    <button class="modifier">modifier</button>
                    <button class="supprimer">supprimer</button>
                `
             
            })
            .catch(error => {
                divError.style.display = "block"
                divError.innerHTML  = 
                `
                    <p> Il y a déjà une alerte pour ce streamer </p>
                `
            });
        }else if(target.id === "annulerAjout"){
            let notifs =  document.querySelectorAll(".notif")
            let divSupp = notifs[notifs.length-1];
            divSupp.remove()     
        }else if(target.className === "modifier"){
            let parent = target.parentNode
            let streamer = target.parentNode.childNodes[1].innerHTML
            let type = target.parentNode.childNodes[3].innerHTML
            let etat = target.parentNode.childNodes[5].innerHTML
            let id = target.parentNode.childNodes[1].getAttribute("id")

            const typeSplit = type.split(':');
            type = typeSplit[1];

            parent.innerHTML  = 
            `
                <input class="pseudoInput" name="pseudo" value="`+streamer+`" id="`+id+`"></input>
                <label for="">Type de l'alerte :</label>
                <select class="typeSelect" name="type">
                    <option value="lancement">lancement</option>
                </select>
                <select class="etatSelect" name="etat">
                    <option value="1">on</option>
                    <option value="0">off</option>
                </select>
                <button id="validerModif">valider</button>
            `

        }else if(target.className === "supprimer"){
            let streamer = target.parentNode.childNodes[1].innerHTML
            let body = document.querySelector("body")

            axios.post('/notification/delete',
                {
                    streamer :streamer
                }
            )
            .then(res => {
                target.parentNode.remove()
             })
            .catch(error => {
                console.log(error)
            });
            
        }else if(target.id === "validerModif"){
            let streamer = document.querySelector("input[name=pseudo]").value
            let type = document.querySelector("select[name=type]").value
            let etat = document.querySelector("select[name=etat]").value
            let id = document.querySelector("input[name=pseudo]").getAttribute("id")

            axios.post('/notification/update',
                {
                    data:{
                        streamer :streamer,
                        type :type,
                        etat:etat,
                        id : id
                    }
                }
            )
            .then(res => {
                console.log(res.error)
                let data = JSON.parse(res.config.data)
                let etat = data.data.etat == 1 ? "on" : "off"
                div.innerHTML  = 
                `
                    <h2 class="pseudo">`+data.data.streamer+`</h2>
                    <p class="type">Type de l'alerte :`+data.data.type+`</p>
                    <p class="etat">`+etat+`</p>
        
                    <button class="modifier">modifier</button>
                    <button class="supprimer">supprimer</button>
                `
            })
            .catch(error => {
                divError.style.display = "block"
                divError.innerHTML  = 
                `
                    <p> Il y a déjà une alerte pour ce streamer </p>
                `
            });
        
        }
 
    });
});