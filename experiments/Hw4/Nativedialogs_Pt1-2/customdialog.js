export class customDialog{
    constructor(type){
        switch(type){
            case "alert":
                this.initAlert();
                break;
            case "confirm":
                this.initConfirm();
                break;
            case "prompt":
                this.initPrompt();
                break;
            case "safePrompt":
                this.initSafePrompt();
                break;
        }
    }

    initAlert(){
        this.dialog = document.createElement('dialog');
        this.dialog.innerHTML= `
        <form method="dialog">
            <p id="alertText">Alert Button clicked!</p>
            <button id="okaybtn0">Ok</button>
        </form>
        `
        document.body.appendChild(this.dialog);
        this.okay =document.querySelector('#okaybtn0');
        this.text = document.querySelector('#result');
        this.okay.mode = 0;       //0:normal 1:safe -1:not Applicable
        this.okay.output = document.querySelector('#result');
        this.okay.addEventListener('click', this.okHandler);
    }

    initConfirm(){
        this.dialog = document.createElement('dialog');
        this.dialog.innerHTML= `
        <form method="dialog">
            <p id="confirmText">Can you confirm this?</p>
            <button id="okaybtn1">Ok</button>
            <button id="cancelbtn1" value="cancel">Cancel</button>
        </form>
        `
        document.body.appendChild(this.dialog);
        this.cancel =document.querySelector('#cancelbtn1');
        this.okay =document.querySelector('#okaybtn1');
        this.text = document.querySelector('#result');
        this.okay.mode = 1;       //0:normal 1:safe -1:not Applicable
        this.okay.output = document.querySelector('#result');
        this.cancel.mode = 1;
        this.cancel.output = document.querySelector('#result');
        this.okay.addEventListener('click', this.okHandler);
        this.cancel.addEventListener('click', this.cnslHandler);
    }

    initPrompt(){
        this.dialog = document.createElement('dialog');
        this.dialog.innerHTML= `
        <form method="dialog">
            <p>
                <label>Please enter something:
                <input id="promptText" type="Text">
                </label>
            </p>
            <button id="okaybtn2">Ok</button>
            <button id="cancelbtn2" value="cancel">Cancel</button>
        </form>
        `
        document.body.appendChild(this.dialog);
        this.cancel =document.querySelector('#cancelbtn2');
        this.okay =document.querySelector('#okaybtn2');
        this.text = document.querySelector('#result');
        this.okay.mode = 2; 
        this.okay.output = document.querySelector('#result');
        this.okay.addEventListener('click', this.okHandler);
        this.cancel.addEventListener('click', this.cnslHandler);
    }

    initSafePrompt(){
        this.dialog = document.createElement('dialog');
        this.dialog.innerHTML= `
        <form method="dialog">
            <p>
                <label>Please enter something:
                <input id="promptText2" type="Text">
                </label>
            </p>
            <button id="okaybtn3">Ok</button>
            <button id="cancelbtn3" value="cancel">Cancel</button>
        </form>
        `
        document.body.appendChild(this.dialog);
        this.cancel =document.querySelector('#cancelbtn3');
        this.okay =document.querySelector('#okaybtn3');
        this.text = document.querySelector('#result');
        this.okay.mode = 3; 
        this.okay.output = document.querySelector('#result');
        this.okay.addEventListener('click', this.okHandler);
        this.cancel.addEventListener('click', this.cnslHandler);
    }

    display(){
        this.dialog.showModal();
    }

    okHandler(){
        let txt = "";
        if(this.mode ==2){
            txt = this.parentElement.querySelector('#promptText').value;
        } else if (this.mode ==3){
            txt = this.parentElement.querySelector('#promptText2').value;
            txt = DOMPurify.sanitize(txt);
        }
        if(this.mode==1){
            txt = true;
            this.output.innerHTML = `Confirm result: ${txt}`;
        } else if ((txt != "") && (this.mode==2)){
            this.output.innerHTML = `Prompt result: ${txt}`;
        } else if ((txt != "") && (this.mode==3)){
            this.output.innerHTML = `Cleaned Prompt result: ${txt}`;
        } else if (this.mode > 0){
            this.output.innerHTML = `User didn't enter anything`;
        } else {
            this.output.innerHTML = `Alert pressed, Press another!`;
        }
    }

    cnslHandler(){
        if (this.mode==1){
            let txt = false;
            this.output.innerHTML = `Confirm result: ${txt}`;
        }
    }
}