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
    cursor: pointer;
}
.commonWindow .description-container-closed{
    max-width: 60px;
}
`
// SIMPLE COMPONENTS DB
const mkfComponentsRegister = [
    {
        componentName: "test",
        functionToExecute: ({noteEditor})=>{
            noteEditor.innerHTML += `<h2 class="testandoMaken">TESTE FUNFANDO!</h2>`
        } 
    },{
        componentName: "oraculos-relacionamento",
        functionToExecute: props=>Components_Basic.oraculosRelacionamento(props)
    }
];

//COMPLEX COMPONENTS DB
function complexComponents({jsonType, untreatedDataArr}){
    /* console.log(attributesTab) */
    if (jsonType.type == "default" || jsonType.type == "" || jsonType.type == undefined) {
        return Components_Complex.default({jsonType, untreatedDataArr})
    }
}

// COMPONENT CLASSES

class Components_Complex {
    /* static template(props){
        return {
            componentName: "template",
            functionToExecute: (props)=>{}
        }
    } */
    static default({jsonType, untreatedDataArr}){
        function closeContentContainer(content){
            content.classList.toggle("hidden")
        }
        return {
            componentName: "default",
            functionToExecute: ({noteEditor, attInstance})=>{
                console.log(attInstance)
                noteEditor.innerHTML += `
                    <div class="commonWindow">
                        <div class="description-container">
                            <h2>${jsonType.title}</h2>
                            <button class="testbtn">TESTE</button>
                        </div>
                        <div class="content-container hidden">
                            ${untreatedDataArr.map(data=>{
                                if (data.includes(':')) {
                                    const [firstPart, secondPart] = data.split(':');
                                    return `<p><b>${firstPart}:</b> ${secondPart}</p>`
                                } else {
                                    return `<p>${data}</p>`
                                }
                            }).join('')}
                        </div>
                    </div>
                `
                noteEditor.querySelector(".description-container").addEventListener('click',()=>{
                    const contentContainer = noteEditor.querySelector('.content-container')
                    closeContentContainer(contentContainer)
                })
                noteEditor.querySelector(".testbtn").addEventListener("click", ()=>{
                    attInstance.setAttribute("TESTANDO", ["teste", 12])
                })
            }
        }
    }
}
class Components_Basic {
    static oraculosRelacionamento({noteEditor}){
        /* AttributesTab.setAttribute(attributesTab) */
        noteEditor.innerHTML += `<h2 class="testandoMaken">ORÁCULOS VEM AQUI</h2>`
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
        const mkfStyleElement = document.createElement('style');
        mkfStyleElement.innerText = mkfStyle;
        iframe.contentWindow.document.head.appendChild(mkfStyleElement)
    },1000) 
}

// OBSERVER FUNCTIONS

function BodyObserve() {
    // Select the node that will be observed for mutations
    const targetNode = document.body;
    // Options for the observer (which mutations to observe)
    const config = { childList: true};
    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {

        for (const mutation of mutationList) {
            
            if (mutation.type === 'childList') {
            
            for(let i=0; i<mutation.addedNodes.length; i++){
                
                const node = mutation.addedNodes[i]
                const isDialog = node.classList.contains('ui-dialog')
                
                if(isDialog) {
                    const HANDOUT = node.querySelector('[data-handoutid]')
                    const CHARACTER = node.querySelector('[data-characterid]')

                    if(CHARACTER){
                        const charIframe = CHARACTER.querySelector('iframe')
                        intermediarioBodyCharacter(charIframe)
                    }
                    if(HANDOUT){
                        intermediarioBodyHandout(HANDOUT)
                    }
                }      
            }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}
function intermediarioBodyHandout(handout) {
    try {
        Sheet.openHandout(handout)
    } catch (error) {
        console.log(error)
    }
}
function intermediarioBodyCharacter(iframe) {
    Sheet.openCharacterSheet(iframe)
    iframeApplyingStyle(iframe)
}
// SHEET HANDLER CLASS
class Sheet {
    static openCharacterSheet(iframe){
        setTimeout(()=>{
            try {
                // const iframe = document.querySelector(`[name='iframe_${itemId}']`);
                const noteEditor = iframe.contentWindow.document.querySelector(".note-editor");
                iframe.contentWindow.document.querySelector('[data-tab="attributesabilities"]').click()

                const attributesTab = iframe.contentWindow.document.querySelector(".attributes").closest('.span6')
                const attInstance = new AttributesTab(attributesTab, iframe)

                iframe.contentWindow.document.querySelector('[data-tab="bioinfo"]').click()
                const notTreatedRawDataArr = noteEditor.querySelectorAll("pre");
                const treatedRawDataArr = this.treatRawData([...notTreatedRawDataArr]);
                const componentsArr = this.convertDataArrToComponentsArr({treatedRawDataArr, noteEditor});
            
                this.cleanNoteEditorFromCode(noteEditor);
            
                componentsArr.forEach(component => {component.functionToExecute({noteEditor, attInstance})})
            } catch (error) {
                console.log(error)
            }
        },1500)
        /* const loopingTryier = (itself) => {
        }
        loopingTryier(loopingTryier) */
    }
    static openHandout(handout){
        setTimeout(()=>{
            const noteEditor = handout.querySelector(".note-editor");
            if (noteEditor.closest(".handoutviewer")) {
                const notTreatedRawDataArr = noteEditor.querySelectorAll("pre");
                const treatedRawDataArr = this.treatRawData([...notTreatedRawDataArr]);
                const componentsArr = this.convertDataArrToComponentsArr({treatedRawDataArr});
            
                this.cleanNoteEditorFromCode(noteEditor);
            
                componentsArr.forEach(component => {component.functionToExecute({noteEditor})})
            }
        },1000)
    }
    static treatRawData(notTreatedRawDataArr){
        const treatedRawData = notTreatedRawDataArr.map((untreatedCodeBlock, i)=>{
            return untreatedCodeBlock.innerText.replace(/\n/g, "")
        })
        return treatedRawData;
    }
    static convertDataArrToComponentsArr({treatedRawDataArr, noteEditor}){
        const data = treatedRawDataArr.map((rawData)=>{
            if (rawData.includes("#")) {
                const rawData_removedTag = rawData.replace("#","")
                const correctComponent = mkfComponentsRegister.find((component) => component.componentName == rawData_removedTag)
                return {
                    componentName: correctComponent.componentName,
                    functionToExecute: correctComponent.functionToExecute,
                }
            }
            if (rawData.includes('$')) {
                const type = rawData.replace(/\n/,"").match(/{(.)*}/)[0];
                const jsonType = JSON.parse(type)
                const noHeaderData = rawData.replace("$","").replace(/{(.)*}/,"")
                const untreatedDataArr = noHeaderData.split("@")
                return complexComponents({
                    jsonType,
                    untreatedDataArr,
                    noteEditor
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

class AttributesTab {
    constructor(attInstance, iframe){
        this.iframe = iframe;
        this.attInstance = attInstance;
        this.btnAddAtribute = attInstance.querySelector(".addattrib");
        this.attributesTab = attInstance.querySelector(".attributes").querySelector(".ui-sortable")
    }
    setAttribute(name, minAndMaxArr){
        this.iframe.contentWindow.document.querySelector('[data-tab="attributesabilities"]').click()
        this.btnAddAtribute.click();
        const allInputs = this.attributesTab.querySelectorAll('[type="text"]');
        const correctInput = [...allInputs].find((input)=>!input.getAttribute("name"));
        const current = correctInput.closest(".attrib").querySelector(".current").querySelector("input");
        const max = correctInput.closest(".attrib").querySelector(".max").querySelector("input");
        correctInput.value = name;
        current.value = minAndMaxArr[0];
        max.value = minAndMaxArr[1];
        correctInput.focus();
        correctInput.blur();
        this.iframe.contentWindow.document.querySelector('[data-tab="bioinfo"]').click()
    }
    getAttribute(name){
        
    }
    patchAttribute(name,[min,max]){
        
    }
}

// INICIALIZAR

setTimeout(()=>{
    applyingStyle()
    BodyObserve()
}, 5000)