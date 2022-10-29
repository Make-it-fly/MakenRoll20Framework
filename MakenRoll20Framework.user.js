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


// GLOBAL TEMPLATES
const mkfComponentsRegister = [
    {
        componentName: "test",
        functionToExecute: (noteEditor)=>{
            noteEditor.innerHTML += `<h2>eeeee</h2>`
        } 
    }
];

// GLOBAL STYLE

const mkfStyle = `
    
`

// INICIALIZAR

setTimeout(()=>{
    applyingStyle()
}, 5000)


// HANDLING JOURNAL ITENS

window.addEventListener('click', (e)=>{
    //Opening Handouts
    if (e.target.closest("[data-itemid]") && e.target.closest("[data-itemid]").classList.contains('handout')) {
        const itemId = e.target.closest("[data-itemid]").getAttribute("data-itemid");
        Sheet.handleHandoutData(itemId);
    }

    // Opening Character Sheets
    if (e.target.closest("[data-itemid]") && e.target.closest("[data-itemid]").classList.contains('character')) {
        const itemId = e.target.closest("[data-itemid]").getAttribute("data-itemid");
        console.log(itemId)
        Sheet.handleCharacterSheetData(itemId);
    }
    // Saving changes on Character Sheets
    /* if (e.target.closest(".ui-dialog") && e.target.closest(".ui-dialog").querySelector(".charactereditor")) {
        const itemId = e.target.closest(".ui-dialog").querySelector("[data-characterid]").getAttribute("data-itemid");
        console.log(itemId)
        Sheet.handleCharacterSheetData(itemId);
    } */
})

class Sheet {
    static handleCharacterSheetData(itemId){
        setTimeout(()=>{
            const characterSheet = document.querySelector(`[data-characterid=${itemId}]`)
            console.log(characterSheet)
            const iframe = characterSheet.querySelector(`iframe`);
            console.log(iframe)
            const noteEditor = iframe.contentWindow.document.querySelector(".note-editor")
            const notTreatedRawDataArr = noteEditor.querySelectorAll("pre");
            const treatedRawDataArr = this.treatRawData([...notTreatedRawDataArr]);
            const componentsArr = this.convertDataToComponent(treatedRawDataArr);
        
            this.cleanNoteEditorFromCode(noteEditor);
        
            componentsArr.forEach(component => {component.functionToExecute(noteEditor)})
        },2000)
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
                
                    componentsArr.forEach(component => {component.functionToExecute(noteEditor)})
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
            if (rawData.includes("@")) {
                
            }
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


