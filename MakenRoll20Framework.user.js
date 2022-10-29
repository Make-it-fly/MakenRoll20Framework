// ==UserScript==
// @name         MakenRoll20Framework
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create JSON from strings in roll20 lists
// @author       Maken
// @match        https://app.roll20.net/editor/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com.br
// @grant        none
// ==/UserScript==

const style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = 'https://gitcdn.link/repo/Make-it-fly/e351f5be422c69d7f10ee4f20e428154/raw/bda61fca95835f16e2ce3af8e318c561a9474b16/MakenRoll20FrameworkStyle.css';
document.querySelector('head').appendChild(link);
