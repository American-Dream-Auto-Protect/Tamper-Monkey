// ==UserScript==
// @name         Replace SIP with TEL on Load
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically change SIP to TEL for data-softphoneurl attributes on page load
// @author       AM
// @match        https://s2.vanillasoft.net/web/default.asp
// @grant        none
// @updateURL    https://raw.githubusercontent.com/American-Dream-Auto-Protect/Tamper-Monkey/main/VanillaSoft/Replace%20SIP%20with%20TEL%20on%20Load.js
// @downloadURL  https://raw.githubusercontent.com/American-Dream-Auto-Protect/Tamper-Monkey/main/VanillaSoft/Replace%20SIP%20with%20TEL%20on%20Load.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey script Replace SIP started");

    function convertButtonToAnchor(button) {
        const dialNumber = button.getAttribute('data-dial');
        if (dialNumber) {
            const anchor = document.createElement('a');
            anchor.href = `tel:${dialNumber}`;
            anchor.title = button.title;
            anchor.className = 'enabled';
            anchor.innerHTML = button.innerHTML;
            //console.log("Replacing button with anchor:", button, "with", anchor);
            button.parentNode.replaceChild(anchor, button);
            showNotification(`Converted button to anchor: ${dialNumber}`);
        }
    }

    function setupButtonListeners(doc) {
        const buttons = doc.querySelectorAll('button[data-dial]');
        // console.log('Buttons Found:', buttons);
        buttons.forEach(button => {
            convertButtonToAnchor(button);
        });
    }

    function checkIframe() {
        const iframe = document.querySelector('#bodyIframe');
        if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
                // console.log("Checking buttons inside iframe");
                setupButtonListeners(iframeDoc);
            }
        } else {
            //console.log("No iframe found on the page");
        }
    }

    function initialize() {
        //console.log("Initializing script");

        // Set interval to continuously check for new buttons in the main document
        setInterval(() => {
            //console.log("Checking for new buttons in main document");
            setupButtonListeners(document);
        }, 1000);  // Adjust the interval as needed

        // Set interval to continuously check for new buttons in the iframe
        setInterval(() => {
            //console.log("Checking for new buttons in iframe");
            checkIframe();
        }, 1000);  // Adjust the interval as needed
    }

    function showNotification(message) {
        let notification = document.querySelector('#customNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'customNotification';
            notification.style.position = 'fixed';
            notification.style.bottom = '10px';
            notification.style.right = '10px';
            notification.style.padding = '10px';
            notification.style.backgroundColor = '#444';
            notification.style.color = '#fff';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '10000';
            document.body.appendChild(notification);
        }
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);  // Show the notification for 3 seconds
    }

    // Initial check in case buttons are already present
    //console.log("Initial check for buttons in main document and iframe");
    setupButtonListeners(document);
    checkIframe();

    // Start the continuous checking immediately
    initialize();
})();
