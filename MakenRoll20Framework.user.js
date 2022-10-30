// ==UserScript==
// @name         MakenRoll20Framework
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Create JSON from strings in roll20 lists
// @author       Maken
// @match        https://app.roll20.net/editor/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com.br
// @grant        none
// ==/UserScript==

// COMPONENT TEMPLATES
class Templates {
    static test (noteEditor){
        noteEditor.innerHTML += `<h2 class="testandoMaken">eeeee</h2>`
    } 
}

// COMPONENT DB

const mkfComponentsRegister = [
    {
        componentName: "test",
        componentTemplate: Templates.test
    }
];

// GLOBAL STYLE

const mkfStyle = `
    body{
        font-family: 'Courier New', Courier, monospace;
    }
    .testandoMaken{
        color: red;
    }
    .avatar{
        float: none;
    }
    #bio-avatar{
        float: none;
    }
    .commonWindow{
        padding: 15px;
        margin: 5px 5px;
        border: 3px solid black;
        display: block
    }
`

// INICIALIZAR

setTimeout(()=>{
    applyingStyle()
}, 5000)


// HANDLING JOURNAL ITENS
window.addEventListener('click', (e)=>{
    //Opening Handouts
    if (e.target.closest(".handout")) {
        const itemId = e.target.closest("[data-itemid]").getAttribute("data-itemid");
        Sheet.handleHandoutData(itemId);
    }
    // Opening Character Sheets
    if (e.target.closest(".character")) {
        const itemId = e.target.closest("[data-itemid]").getAttribute("data-itemid");
        Sheet.handleCharacterSheetData(itemId);
        iframeApplyingStyle(itemId)
    }
})
window.addEventListener('message', (e) => {
    const itemId = e.data.characterId;
    Sheet.handleCharacterSheetData(itemId);
    iframeApplyingStyle(itemId)
});

class Sheet {
    static handleCharacterSheetData(itemId){
        setTimeout(()=>{
            const iframe = document.querySelector(`[name='iframe_${itemId}']`);
            const noteEditor = iframe.contentWindow.document.querySelector(".note-editor")
            const notTreatedRawDataArr = noteEditor.querySelectorAll("pre");
            const treatedRawDataArr = this.treatRawData([...notTreatedRawDataArr]);
            const componentsArr = this.convertDataToComponent(treatedRawDataArr);
        
            this.cleanNoteEditorFromCode(noteEditor);
        
            componentsArr.forEach(component => {component.componentTemplate(noteEditor)})
        },1000)
        /* const loopingTryier = (itself) => {
        }
        loopingTryier(loopingTryier) */
    }
    static handleHandoutData(itemId){
        const loopingTryier = (itself) => {
            setTimeout(()=>{
                const handout = document.querySelector(`[data-handoutid=${itemId}]`)
                try {
                    const noteEditor = handout.querySelector(".note-editor")
                    const notTreatedRawDataArr = noteEditor.querySelectorAll("pre");
                    const treatedRawDataArr = this.treatRawData([...notTreatedRawDataArr]);
                    const componentsArr = this.convertDataToComponent(treatedRawDataArr);
                
                    this.cleanNoteEditorFromCode(noteEditor);
                
                    componentsArr.forEach(component => {component.componentTemplate(noteEditor)})
                } catch (error) {
                    itself(itself)
                }
            },1000)
        }
        loopingTryier(loopingTryier)
    }
    static treatRawData(notTreatedRawDataArr){
        const treatedRawData = notTreatedRawDataArr.map((untreatedCodeBlock, i)=>{
            return untreatedCodeBlock.innerText.replace(/\n/g, "")
        })
        return treatedRawData;
    }
    static convertDataToComponent(treatedRawDataArr){
        const data = treatedRawDataArr.map((rawData)=>{
            if (rawData.includes("#")) {
                const rawData_removedTag = rawData.replace("#","")
                const correctComponent = mkfComponentsRegister.find((component) => component.componentName == rawData_removedTag)
                return correctComponent
            }
            if (rawData.includes('$')) {
                const type = rawData.replace(/\n/,"").match(/{(.)*}/)[0];
                const jsonType = JSON.parse(type)
                const noHeaderData = rawData.replace("$","").replace(/{(.)*}/,"")
                const untreatedDataArr = noHeaderData.split("@")
                console.log(jsonType)
                if (jsonType.type == "default" || jsonType.type == "") {
                    return {
                        componentName: "default",
                        componentTemplate: (noteEditor)=>{
                            noteEditor.innerHTML += `
                                <div class="commonWindow">
                                    <h2>${jsonType.title}</h2>
                                    ${untreatedDataArr.map(data=>{
                                        if (data.includes(':')) {
                                            const [firstPart, secondPart] = data.split(':');
                                            return `<p><b>${firstPart}:</b> ${secondPart}</p>`
                                        } else {
                                            return `<p>${data}</p>`
                                        }
                                    }).join('')}
                                </div>
                            `
                        }
                    }
                }
            }
            /* if (rawData.match(/\$(.)*;/)[0]) {
                const type = rawData.match(/\$(.)*;/)[0];
                const 
                console.log(type)
            } */
        })
        return data
    }
    static cleanNoteEditorFromCode(noteEditor){
        const toRemove = noteEditor.querySelectorAll("pre");
        [...toRemove].forEach(pre => pre.remove())
    }
}


// APPLYING STYLE

function applyingStyle(){
    const mkfStyleElement = document.createElement('style');
    mkfStyleElement.innerText = mkfStyle;
    document.head.appendChild(mkfStyleElement)
}

function iframeApplyingStyle(itemId){
    setTimeout(()=>{
        const iframe = document.querySelector(`[name='iframe_${itemId}']`);
        const mkfStyleElement = document.createElement('style');
        mkfStyleElement.innerText = mkfStyle;
        iframe.contentWindow.document.head.appendChild(mkfStyleElement)
    },2000) 
}

/* function applyingStyle(){
    const mkfStyleElement = document.createElement('link');
    mkfStyleElement.rel = 'stylesheet';
    mkfStyleElement.type = 'text/css';
    mkfStyleElement.href = 'https://gitcdn.link/cdn/Make-it-fly/MakenRoll20Framework/main/style.css';
    document.querySelector('head').appendChild(mkfStyleElement);
} */

// ATT BUTTON

/* function creatingAttButton(){
    const attButton = document.createElement('button');
    attButton.classList.add('btn-maken-teste');
    attButton.innerText = "Atualizar";

    document.querySelector('#playerzone').appendChild(attButton);
    console.log(attButton)
} */