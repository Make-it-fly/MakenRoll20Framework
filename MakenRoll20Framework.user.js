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

BodyObserve()

function BodyObserve() {
    // Select the node that will be observed for mutations
    const targetNode = document.body;

    // Options for the observer (which mutations to observe)
    const config = { childList: true};

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {

        for (const mutation of mutationList) {
            
            if (mutation.type === 'childList') {
            
                console.log('--------START--------')
                console.log('A child node has been added or removed.');
            
            for(let i=0; i<mutation.addedNodes.length; i++){
                
                const node = mutation.addedNodes[i]
                const isDialog = node.classList.contains('ui-dialog')
                
                if(isDialog) {
                    const HANDOUT = node.querySelector('[data-handoutid]')
                    const CHARACTER = node.querySelector('[data-characterid]')

                    console.log('HANDOUT: ', HANDOUT)
                    console.log('CHARACTER: ', CHARACTER)

                    if(CHARACTER){
                        const charIframe = CHARACTER.querySelector('iframe')

                        intermediarioBody(charIframe)

                        // const iframeBody = charIframe.contentWindoww.document.querySelector('body')

                        // iframeObserver(iframeBody)
                    }
                }
                
            }
            
                console.log('--------END--------')
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

// function iframeObserver(iframe) {
//     // Select the node that will be observed for mutations

//     console.log(iframe);

//     // const targetNode = document.getElementById('some-id');

//     // // Options for the observer (which mutations to observe)
//     // const config = { attributes: true, childList: true, subtree: true };

//     // // Callback function to execute when mutations are observed
//     // const callback = (mutationList, observer) => {

//     //     for (const mutation of mutationList) {
//     //         if (mutation.type === 'childList') {
//     //             console.log('A child node has been added or removed.');
//     //         } else if (mutation.type === 'attributes') {
//     //             console.log(`The ${mutation.attributeName} attribute was modified.`);
//     //         }
//     //     }
//     // };

//     // // Create an observer instance linked to the callback function
//     // const observer = new MutationObserver(callback);

//     // // Start observing the target node for configured mutations
//     // observer.observe(targetNode, config);

//     // // Later, you can stop observing
//     // observer.disconnect();
// }

function intermediarioBody(iframe) {
    Sheet.handleCharacterSheetData(iframe)
    iframeApplyingStyle(iframe)
}

// function intermediarioIframe(iframe){

// }



// GLOBAL TEMPLATES
const mkfComponentsRegister = [
    {
        componentName: "test",
        functionToExecute: (noteEditor)=>{
            noteEditor.innerHTML += `<h2 class="testandoMaken">eeeee</h2>`
        } 
    }
];

// GLOBAL STYLE

const mkfStyle = `

.avatar{
    float: none;
}
#bio-avatar{
    float: none;
}
.commonWindow{
    position: relative;
    padding: 15px;
    margin: 5px 5px;
    border: 3px solid black;
    display: block;
}
.commonWindow .description-container{
    display: flex;
    justify-content: space-between;
}
.commonWindow .description-container .btn-macro{
    border: 1px solid black;
    padding: 5px 10px;
    border-radius: 3px;
    transition: .2s;
    cursor: pointer;
}
.commonWindow .description-container .btn-macro:hover{
    background-color: gray;
    color: black;
}
`

// INICIALIZAR

setTimeout(()=>{
    applyingStyle()
}, 5000)


// HANDLING JOURNAL ITENS
// window.addEventListener('click', (e)=>{
//     // Opening Character Sheets
//     if (e.target.closest(".character")) {
//         const itemId = e.target.closest("[data-itemid]").getAttribute("data-itemid");
//         Sheet.handleCharacterSheetData(itemId);
//         iframeApplyingStyle(itemId)
//         return
//     }
//     //Opening Handouts
//     /* if (e.target.closest(".handout")) {
//         const itemId = e.target.closest("[data-itemid]").getAttribute("data-itemid");
//         Sheet.handleHandoutData(itemId);
//         return
//     } */
    
// })
// window.addEventListener('message', (e) => {
//     const itemId = e.data.characterId;
//     Sheet.handleCharacterSheetData(itemId);
//     iframeApplyingStyle(itemId)
// });

class Sheet {
    static handleCharacterSheetData(iframe){
        setTimeout(()=>{
            try {
                // const iframe = document.querySelector(`[name='iframe_${itemId}']`);
                const noteEditor = iframe.contentWindow.document.querySelector(".note-editor");
                iframe.contentWindow.document.querySelector('[data-tab="attributesabilities"]').click()
                let attributesTab = iframe.contentWindow.document.querySelector(".attributes").querySelector(".ui-sortable");
                iframe.contentWindow.document.querySelector('[data-tab="bioinfo"]').click()
                const notTreatedRawDataArr = noteEditor.querySelectorAll("pre");
                const treatedRawDataArr = this.treatRawData([...notTreatedRawDataArr]);
                const componentsArr = this.convertDataToComponent({treatedRawDataArr, attributesTab});
            
                this.cleanNoteEditorFromCode(noteEditor);
            
                componentsArr.forEach(component => {component.functionToExecute(noteEditor)})
            } catch (error) {
                console.log(error)
            }
        },3000)
        /* const loopingTryier = (itself) => {
        }
        loopingTryier(loopingTryier) */
    }
    static handleHandoutData(itemId){
        setTimeout(()=>{
            const handout = document.querySelector(`[data-handoutid=${itemId}]`);
            console.log(handout)
            const noteEditor = handout.querySelector(".note-editor");
            console.log(noteEditor)
            const notTreatedRawDataArr = noteEditor.querySelectorAll("pre");
            const treatedRawDataArr = this.treatRawData([...notTreatedRawDataArr]);
            const componentsArr = this.convertDataToComponent(treatedRawDataArr);
        
            this.cleanNoteEditorFromCode(noteEditor);
        
            componentsArr.forEach(component => {component.functionToExecute(noteEditor)})
        },1000)
    }
    static treatRawData(notTreatedRawDataArr){
        const treatedRawData = notTreatedRawDataArr.map((untreatedCodeBlock, i)=>{
            return untreatedCodeBlock.innerText.replace(/\n/g, "")
        })
        return treatedRawData;
    }
    static convertDataToComponent({treatedRawDataArr, attributesTab}){
        const data = treatedRawDataArr.map((rawData)=>{
            if (rawData.includes("#")) {
                const rawData_removedTag = rawData.replace("#","")
                const correctComponent = mkfComponentsRegister.find((component) => component.componentName == rawData_removedTag)
                return {
                    componentName: correctComponent.componentName,
                    functionToExecute: correctComponent.functionToExecute,
                    attributesTab: attributesTab
                }
                /* return correctComponent */
            }
            if (rawData.includes('$')) {
                const type = rawData.replace(/\n/,"").match(/{(.)*}/)[0];
                const jsonType = JSON.parse(type)
                const noHeaderData = rawData.replace("$","").replace(/{(.)*}/,"")
                const untreatedDataArr = noHeaderData.split("@")
                console.log(jsonType)
                return complexComponents({
                    jsonType: jsonType,
                    untreatedDataArr: untreatedDataArr,
                    attributesTab: attributesTab
                })
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

function iframeApplyingStyle(iframe){
    setTimeout(()=>{
        // const iframe = document.querySelector(`[name='iframe_${itemId}']`);
        const mkfStyleElement = document.createElement('style');
        mkfStyleElement.innerText = mkfStyle;
        iframe.contentWindow.document.head.appendChild(mkfStyleElement)
    },2000) 
}

function complexComponents({jsonType, untreatedDataArr, attributesTab}){
    if (jsonType.type == "default" || jsonType.type == "" || jsonType.type == undefined) {
        console.log(attributesTab)
        return {
            componentName: "default",
            functionToExecute: (noteEditor)=>{
                noteEditor.innerHTML += `
                    <div class="commonWindow">
                        <div class="description-container">
                            <h2>${jsonType.title}</h2>
                            <button class="btn-macro" untreatedDataArr="${untreatedDataArr}">Imprimir</button>
                        </div>
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
