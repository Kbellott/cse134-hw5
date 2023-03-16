class ButtonCount extends HTMLElement{
    constructor(){
        super();
        this.clickcnt = 0;
        this.shadow =this.attachShadow({mode: "open"});

        this.addEventListener('click', e => {
            if(this.disabled){
                return;
            }
            this.onClick();
        });
        
        this.display();
    }

    //onClick to increase count
    onClick(){
        this.clickcnt += 1;
        this.display()
    }

    //display to render button
    display(){
        this.shadow.innerHTML = `
        <button>Times clicked: ${this.clickcnt}</button>
        `;
    }

}
customElements.define("button-count", ButtonCount);