export class blogPost{
    constructor(title, message, mock=false, recreateid = 0, time = null){
        this.init(title, message, mock, recreateid, time)
    }
    
    init(title, message, mock, recreateid, date){
        if(mock){
            //create object not visual element
            this.title = title;
            this.message = message;
            this.id = getDate(1);
            this.time = getDate(0);
            addItem(this);
        }else {
            this.post = document.createElement('div');
            this.post.className= 'flexContainer';
            if(recreateid!=0){
                this.id=recreateid;
            }else{
                this.id = getDate(1); //unique time string for id
            }
            this.post.id = `postdiv-${this.id}`;
            this.post.innerHTML = `
            <section class="blogPost flexContainer" id="post-${this.id}">
                <div class="blogContent">
                    <hr>
                    <h2 id="postHeading${this.id}">${title}</h2>
                    <p id="postTime${this.id}">ERROR</p>
                    <p id="postMessage${this.id}">${message}</p>
                    <hr>
                </div>
                <div class="editMenu">
                    <button id="deletepost${this.id}"><i class="fa fa-solid fa-trash"> Delete</i></button>
                    <button id="editpost${this.id}"><i class="fa fa-solid fa-pencil"> Edit</i></button>
                </div>
                <hr>
            </section>
            `;

            if(!document.querySelector(`#postHeading${this.id}`)){
                document.querySelector("main").appendChild(this.post);
            }

            this.title = document.querySelector(`#postHeading${this.id}`);
            this.message = document.querySelector(`#postMessage${this.id}`);
            this.time = document.querySelector(`#postTime${this.id}`);
            if(date){
                this.time.innerHTML=date;
            }else{
                this.time.innerHTML = getDate(0);
            }
            this.deletebtn = document.querySelector(`#deletepost${this.id}`);
            this.editbtn = document.querySelector(`#editpost${this.id}`);

            //dialogs for editing and deleting
            if(!document.querySelector(`#deletetDia${this.id}`) && !document.querySelector(`#editDia${this.id+1}`)){
                this.deleteDialog = new postDialog("delete",this.id,this);
                this.editDialog = new postDialog("edit",(this.id+1),this);
                //listen to delete/edit buttons presssed and launch dialog
                this.deletebtn.addEventListener('click', (e) => {
                    this.deleteDialog.display();
                });
                this.editbtn.addEventListener('click', (e) => {
                    this.editDialog.display();
                });
            }
        }
    }

    edit(title, message){
        if((title != this.title.innerHTML) || (message != this.message.innerHTML)){
            this.time.innerHTML = getDate(0)+" (edited)"; //Editing time
        }
        this.title.innerHTML = title;
        this.message.innerHTML = message;
        editItem(this);
    }

    delete(){
        //delete from list
        console.log("deleting")
        deleteItem(this.id);
        this.title= null;
        this.time= null;
        this.message = null;
        this.html = null;
        this.deletebtn = null;
        this.editbtn = null;
        this.deleteDialog.remove();
        this.editDialog.remove();
        this.post.remove();
    }

    toString(){
        return "ID:"+this.id+",title:"+this.title.innerHTML+",time:"+this.time.innerHTML+",message:"+this.message.innerHTML;
    }
    
}


function getDate(id){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if(dd<10) {
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    if(id){ //non-human readable form for id
        today = mm+dd+yyyy+today.getHours()+today.getMinutes()+today.getSeconds()+today.getMilliseconds(); //formatting
    } else {
        today = mm+'/'+dd+'/'+yyyy+' '+time; //formatting
    }
    return today;
}


export class postDialog{
    constructor(type,id,context){
        switch(type){
            case "delete":
                this.initDelete(id,context);
                break;
            case "edit":
                this.initEdit(id,context);
                break;
        }
    }

    initDelete(id,context){
        this.dialog = document.createElement('dialog');
        this.dialog.id =`deletetDia${id}`;
        this.dialog.className = "dialogBox";
        this.dialog.innerHTML= `
        <form method="dialog">
            <p id="confirmText${id}">Are you sure you want to delete this post?</p>
            <div class="editMenu">
            <button id="okaybtn${id}">Delete</button>
            <button id="cancelbtn${id}" value="cancel">Cancel</button>
            </div>
        </form>
        `
        document.body.appendChild(this.dialog);
        this.context=context;
        this.cancel =document.querySelector(`#cancelbtn${id}`);
        this.okay =document.querySelector(`#okaybtn${id}`);
        this.okay.mode = 1;      
        this.cancel.mode = 1;
        this.okay.context = context;
        this.okay.addEventListener('click', this.okHandler);
        this.cancel.addEventListener('click', this.cnslHandler);
    }

    initEdit(id,context){
        this.dialog = document.createElement('dialog');
        this.dialog.id =`editDia${id}`;
        this.dialog.className = "dialogBox";
        this.dialog.innerHTML= `
        <form method="dialog">
            <h2>Edit Post</h2>
            <p>
                <label for="titleText${id}">Title:
                    <br>
                    <input name="titleText${id}" id="title${id}" type="Text" value="${context.title.innerHTML}">
                </label>
                <br>
                <label for="messageText${id}1">New message:
                    <br/>
                    <textarea name="message${id}1" id="message${id}" cols="50" rows="10" class="visitorfield">${context.message.innerHTML}</textarea>
                </label>
            </p>
            <div class="editMenu">
            <button id="okaybtn${id}">Ok</button>
            <button id="cancelbtn${id}" value="cancel">Cancel</button>
            </div>
        </form>
        `
        document.body.appendChild(this.dialog);
        this.context=context;
        this.cancel =document.querySelector(`#cancelbtn${id}`);
        this.okay =document.querySelector(`#okaybtn${id}`);
        this.okay.mode = 2; 
        this.okay.internalid = id;
        this.okay.context = context;
        this.okay.addEventListener('click', this.okHandler);
        this.cancel.addEventListener('click', this.cnslHandler);
    }

    display(){
        this.dialog.showModal();
    }

    remove(){
        this.okay = null;
        this.cancel= null;
        this.dialog.remove()
    }

    okHandler(){
        let title = "";
        let txt = "";
        if(this.mode ==2){
            title = this.parentElement.parentElement.querySelector(`#title${this.internalid}`).value;
            title = DOMPurify.sanitize(title);
            txt = this.parentElement.parentElement.querySelector(`#message${this.internalid}`).value;
            txt = DOMPurify.sanitize(txt);
        }
        if(this.mode==1){
            txt = true;
            this.context.delete();
        } else if (((txt != "") || (title != "")) && (this.mode==2)){
            this.context.edit(title,txt);
        }
    }

    cnslHandler(){
        if (this.mode==1){
            let txt = false;
        }
    }
}

export class addPostDialog{
    constructor(){
        this.dialog = document.createElement('dialog');
        this.dialog.className = "dialogBox";
        this.dialog.innerHTML= `
        <form method="dialog">
            <h2>New Post</h2>
            <p>
                <label for="titleTxt">Title:
                    <br>
                    <input name="titleTxt" id="title" type="Text">
                </label>
                <br>
                <label for="message">Enter your message:
                    <br/>
                    <textarea name="message" id="message" cols="50" rows="10" class="visitorfield"></textarea>
                </label>
            </p>
            <div class="editMenu">
            <button id="okaybtn">Ok</button>
            <button id="cancelbtn" value="cancel">Cancel</button>
            </div>
        </form>
        `
        document.body.appendChild(this.dialog);
        this.titleTxt =document.querySelector(`#title`);
        this.messageTxt =document.querySelector(`#message`);
        this.okay =document.querySelector(`#okaybtn`);  
        this.okay.addEventListener('click', this.okHandler);
    }
    
    display(){
        this.titleTxt.value = null;
        this.messageTxt.value = null;
        this.dialog.showModal();
    }

    remove(){
        this.okay = null;
        this.dialog.remove();
    }

    okHandler(){
        let title = "";
        let txt = "";
        title = document.querySelector(`#title`).value;
        title = DOMPurify.sanitize(title);
        txt = document.querySelector(`#message`).value;
        txt = DOMPurify.sanitize(txt);
        if(title != ""){
            new blogPost(title,txt,true);
        }
        else return;
    }
}

let items = JSON.parse(localStorage.getItem("blogPostList")) || [];
function addItem(item){
    if(item === "") return;
    items.push({
        title: item.title,
        recreateid: item.id,
        message: item.message,
        time: item.time,
      });
    
    // console.log(items);
    localStorage.setItem("blogPostList", JSON.stringify(items));

    // call function to list all items
    listItems();
}

function editItem(item){
    for (let i = 0; i < items.length; i++) {
        if(items[i].recreateid == item.id){
            items[i].title = item.title.innerHTML;
            items[i].message = item.message.innerHTML;
            items[i].time = item.time.innerHTML;
        }
    }
    localStorage.setItem("blogPostList", JSON.stringify(items));
}

function deleteItem(itemid) {
    for (let i = 0; i < items.length; i++) {
        if(items[i].recreateid == itemid){
            items.splice(i, 1);
            // console.log(items)
        }
    }
    localStorage.setItem("blogPostList", JSON.stringify(items));
}

function listItems() {
    for (let i = 0; i < items.length; i++) {
        new blogPost(items[i].title,items[i].message, false, items[i].recreateid, items[i].time);
        //console.log(items[i])
    }
}

(function () {
    listItems();
})();