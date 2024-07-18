class CourseWorker {
    constructor(course){
        this.course;
        this.lessonNumber = 1;
        this.lesson;
        this.pageEvents = [];
    
        if(course) this.loadCourse(course);
    }

    loadCourse(course){
        this.course = course;

        this.#setTitleInfo();
        this.setupLesson();
    }

    setupLesson(lessonNumber){
        this.#setLesson(lessonNumber);
        this.#setLecture();
        this.#setExercise();
        this.#setupPageEvents();
    }

    getNextLesson(){
        if(this.lessonNumber < this.course.lessons.length)
            this.setupLesson(this.lessonNumber + 1);
    }

    switchToTab(tabName){
        document.querySelector("[section]").setAttribute("section",tabName);
        document.querySelectorAll("[tabname]").forEach(tab =>
            tab.setAttribute("aria-disabled","true"));
        document.querySelector('[tabname="' + tabName + '"]').setAttribute("aria-disabled","false");
    }

    #setTitleInfo(){
        document.title = this.course.courseName;
        document.getElementById("title").innerHTML = this.course.courseName;
    }

    #setLesson(lessonNumber){
        const params = new URLSearchParams(window.location.search);
        lessonNumber = parseInt(lessonNumber ?? params["page"] ?? 1);

        this.lessonNumber = lessonNumber <= this.course.lessons.length ? lessonNumber: this.lessonNumber;
        this.lesson = this.course.lessons[this.lessonNumber - 1];
        document.querySelector("[page]").setAttribute("page", this.lessonNumber);
    }

    #setLecture(){
        this.#addLinesToElement("lecture",this.lesson.lecture);
    }

    #setExercise(){
        this.#addLinesToElement("exercise-overview",this.lesson.exercise.overview);
        this.#setInstructions(this.lesson.exercise.instructions);
        this.#addLinesToElement("code",this.#getCodeLines());
    }

    #getCodeLines(){
        let codeLines = [];
        this.lesson.exercise.data.forEach(line => {
            let codeLine = "<code><li>" + line.replaceAll("{input}", '<input class="answer" type="text"/>') + "</li></code>"
            codeLines.push(codeLine);
        });
        return codeLines;
    }

    #setupPageEvents(){
        this.#resetPageEvents();
        this.#setupTabEvents();
        this.#setupCodeEvents();
    }

    #setupTabEvents(){
        const tabs = document.querySelectorAll("[movetotab]");
        tabs.forEach(tab => {
            this.pageEvents.push(tab.addEventListener("click",(e) => {
                e.stopPropagation();
                this.switchToTab(tab.getAttribute("movetotab"));
                console.log("hit");
            }));
        });

    }

    #setupCodeEvents(){
        this.pageEvents.push(
            document.getElementById("code-run").addEventListener("click", () => this.#runCode()),
            document.getElementById("code-copy").addEventListener("click", () => this.#copyCode()),
            document.getElementById("nextlesson").addEventListener("click", () => this.getNextLesson())
        );
    }

    #runCode(){
        this.#checkAnswer();
        this.#injectAndExecuteCode();
    }

    #checkAnswer(){
        if(this.#hasCorrectAnswers()){
            this.#enableElementById("nextlesson");
            this.#showMessageForCode("You have completed this lesson you can move on to the next one.", true);
        }
        else{
            this.#disableElementById("nextlesson");
            this.#showMessageForCode("Your code does not meet the code requirements to pass.", false);
        }
    }

    #showMessageForCode(message, success){
        let msgBox = document.getElementById("exercise-message");
        msgBox.innerHTML = "";
        msgBox.className = success ? "success": "fail";
        setTimeout(() => {msgBox.innerHTML = message}, 500);
    }

    #enableElementById(elementId){
        document.getElementById(elementId).removeAttribute("disabled");
    }

    #disableElementById(elementId){
        document.getElementById(elementId).setAttribute("disabled","disabled");
    }

    #hasCorrectAnswers(){
        const answers = this.lesson.exercise.answers;
        const inputs = document.querySelectorAll(".code input");
        for(let i=0; i < answers.length; i++){
            try {
                if(answers[i].trim() != inputs[i].value.trim()) return false;
            } catch {
                return false;
            }
        }
        return true;
    }

    #copyCode(){
        try {
            navigator.clipboard.writeText(this.#getCode());
            console.log('Page URL copied to clipboard');
          } catch (err) {
            console.error('Failed to copy: ', err);
          }
    }

    #getCode(){
        let code = this.lesson.exercise.data.join();
        document.querySelectorAll(".code input")
            .forEach(inputElment => code = code.replace("{input}", inputElment.value));
        return code;
    }

    #injectAndExecuteCode(){
        let code = this.#getCode();
        switch(this.lesson.exercise.dataType){
            case "HTML":
                this.#injectHTML(code);
            case "JS":
                this.#injectJS(code);
        }
    }

    #injectHTML(code){
        const iframe = document.getElementById("results-iframe");
        iframe.contentDocument.write(code);
    }

    #injectJS(code){
        const iframe = document.getElementById("results-iframe");
        iframe.contentWindow.eval(code);
    }


    #resetPageEvents(){
        this.pageEvents.forEach(event => {
            removeEventListener(event);
        });
        this.pageEvents = [];
    }

    #addLinesToElement(elementId,lineArray){
        let html = ""; 
        lineArray.forEach(line => {
            html += line;
        });
        document.getElementById(elementId).innerHTML = html;//TODO: change to string output from array to make it faster;
    }

    #setInstructions(instructions){
        let instructionsHtmlArray = new Array(instructions.length);
        instructions.forEach((step, idx) => {
            instructionsHtmlArray[idx] = '<li answerIdx="' + step.answerLinkIndex + '">' + step.text + "</li>";//TODO: add icon with hide
        })
        this.#addLinesToElement("instructions", instructionsHtmlArray);
    }
}