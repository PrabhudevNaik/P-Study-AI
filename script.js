// ============================
// P Study AI
// script.js - Part 1
// ============================

const uploadBtn = document.getElementById("uploadBtn");
const chatBtn = document.getElementById("chatBtn");
const summaryBtn = document.getElementById("summaryBtn");

const pdfFile = document.getElementById("pdfFile");
const notes = document.getElementById("notes");
const question = document.getElementById("question");

const output = document.getElementById("output");
const loading = document.getElementById("loading");

// Store extracted PDF text
let pdfText = "";


// ----------------------
// Loading
// ----------------------

function showLoading() {

    if (loading) {
        loading.style.display = "block";
    }

}

function hideLoading() {

    if (loading) {
        loading.style.display = "none";
    }

}


// ----------------------
// Output
// ----------------------

function showOutput(text) {
    output.innerHTML = text;
}


// ----------------------
// Upload PDF
// ----------------------

uploadBtn.addEventListener("click", async () => {

    if (pdfFile.files.length === 0) {
        alert("Please choose a PDF first.");
        return;
    }

    showLoading();

    const formData = new FormData();

    formData.append("file", pdfFile.files[0]);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        pdfText = data.text;

        notes.value = pdfText;

        showOutput(
            "✅ PDF uploaded successfully!"
        );

    }

    catch (err) {

        showOutput(
            "<span class='error'>Upload failed.</span>"
        );

    }

    hideLoading();

});


// ----------------------
// Ask AI
// ----------------------

chatBtn.addEventListener("click", async () => {

    const q = question.value.trim();

    if (q === "") {

        alert("Ask a question.");

        return;

    }

    showLoading();

    const formData = new FormData();

    formData.append(
        "message",
        pdfText + "\n\nQuestion:\n" + q
    );

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/chat",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        showOutput(data.reply);
        loadHistory();

    }

    catch (err) {

        showOutput(
            "<span class='error'>Server Error</span>"
        );

    }

    hideLoading();

});


// ----------------------
// Summary
// ----------------------

summaryBtn.addEventListener("click", async () => {

    if (pdfText === "") {

        alert("Upload PDF first.");

        return;

    }

    showLoading();

    const formData = new FormData();

    formData.append(
        "text",
        pdfText
    );

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/summary",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        showOutput(data.summary);
        loadHistory();

    }

    catch (err) {

        showOutput(
            "<span class='error'>Summary failed.</span>"
        );

    }

    hideLoading();

});

// ============================
// P Study AI
// script.js - Part 2
// ============================

const mcqBtn = document.getElementById("mcqBtn");
const explainBtn = document.getElementById("explainBtn");
const vivaBtn = document.getElementById("vivaBtn");
const flashcardBtn = document.getElementById("flashcardBtn");
const plannerBtn = document.getElementById("plannerBtn");


// ----------------------
// Generate MCQs
// ----------------------

mcqBtn.addEventListener("click", async () => {

    if(pdfText===""){
        alert("Upload a PDF first.");
        return;
    }

    showLoading();

    const formData=new FormData();

    formData.append("text",pdfText);

    try{

        const response=await fetch(
            "http://127.0.0.1:8000/mcq",
            {
                method:"POST",
                body:formData
            }
        );

        const data=await response.json();

        showOutput(data.mcqs);
        loadHistory();

    }

    catch{

        showOutput("<span class='error'>Unable to generate MCQs.</span>");

    }

    hideLoading();

});


// ----------------------
// Explain Topic
// ----------------------

explainBtn.addEventListener("click",async()=>{

    let topic=prompt("Enter topic");

    if(!topic) return;

    showLoading();

    const formData=new FormData();

    formData.append("question",topic);

    try{

        const response=await fetch(
            "http://127.0.0.1:8000/explain",
            {
                method:"POST",
                body:formData
            }
        );

        const data=await response.json();

        showOutput(data.answer);
        loadHistory();

    }

    catch{

        showOutput("<span class='error'>Explanation failed.</span>");

    }

    hideLoading();

});


// ----------------------
// Viva Questions
// ----------------------

vivaBtn.addEventListener("click",async () => {

    if (pdfText === "") {
        alert("Upload a PDF first.");
        return;
    }

    showLoading();

    const formData = new FormData();

    formData.append("text", pdfText);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/viva",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        showOutput(data.viva);
        loadHistory();

    }

    catch (err) {

        showOutput(
            "<span class='error'>Unable to generate Viva Questions.</span>"
        );

    }

    hideLoading();

});

// ----------------------
// Flashcards
// ----------------------

flashcardBtn.addEventListener("click",async () => {

    if (pdfText === "") {
        alert("Upload a PDF first.");
        return;
    }

    showLoading();

    const formData = new FormData();

    formData.append("text", pdfText);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/flashcards",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        showOutput(data.flashcards);
        loadHistory();

    }

    catch (err) {

        showOutput(
            "<span class='error'>Unable to generate Flashcards.</span>"
        );

    }

    hideLoading();

});

// ----------------------
// Study Planner
// ----------------------

plannerBtn.addEventListener("click",async () => {

    let subject = prompt(
        "Enter Subject or Topic"
    );

    if (!subject) return;

    showLoading();

    const formData = new FormData();

    formData.append(
        "topic",
        subject
    );

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/planner",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        showOutput(data.plan);
        loadHistory();

    }

    catch (err) {

        showOutput(
            "<span class='error'>Unable to generate Study Plan.</span>"
        );

    }

    hideLoading();

});


// ----------------------
// Enter Key
// ----------------------

question.addEventListener("keydown",(event)=>{

    if(event.key==="Enter" && !event.shiftKey){

        event.preventDefault();

        chatBtn.click();

    }

});


// ----------------------
// Auto Scroll
// ----------------------

const observer=new MutationObserver(()=>{

    output.scrollTop=output.scrollHeight;

});

observer.observe(output,{

    childList:true,

    subtree:true

});


// ----------------------
// Welcome Message
// ----------------------

// ============================
// Load History
// ============================

async function loadHistory(){

    try{

        const response = await fetch("http://127.0.0.1:8000/history");

        const history = await response.json();

        console.log(history);
        
        const historyList = document.getElementById("historyList");

        historyList.innerHTML = "";

        if(history.length===0){

            historyList.innerHTML="<p>No history yet.</p>";

            return;

        }

        history.forEach(item=>{

            const div=document.createElement("div");

            div.className="history-item";

            div.innerHTML = `
            <div class="history-file">
            📄${item.file}
            </div>

            <div class="history-title">
            ${item.title}
            </div>

            <div class="history-time">
            ${item.time}
            </div>
            `;

            div.onclick = function () {

                output.innerHTML = item.response;

                if(item.title==="Ask AI"){

                    question.value=item.prompt;

                }

                else{

                    notes.value=item.prompt;

                }

            };

            historyList.appendChild(div);

        });

    }

    catch(error){

        console.log(error);

    }

}


// ============================
// New Chat
// ============================

document.getElementById("newChatBtn").addEventListener("click",()=>{

    notes.value="";

    question.value="";

    pdfText="";

    output.innerHTML=`
<h3>📚 New Chat</h3>

<p>

Start a new conversation.

Upload a PDF or ask AI.

</p>
`;

});


// ============================
// Search History
// ============================

document.getElementById("historySearch").addEventListener("input",function(){

    const keyword=this.value.toLowerCase();

    const items=document.querySelectorAll(".history-item");

    items.forEach(item=>{

        if(item.innerText.toLowerCase().includes(keyword)){

            item.style.display="block";

        }

        else{

            item.style.display="none";

        }

    });

});

// ============================
// Clear History
// ============================

document.getElementById("clearHistoryBtn").addEventListener("click", async () => {

    if (!confirm("Delete all history?")) {
        return;
    }

    await fetch("http://127.0.0.1:8000/clear-history", {
        method: "POST"
    });

    loadHistory();

});

// ============================
// Page Load
// ============================

window.onload=function(){

    loadHistory();

};