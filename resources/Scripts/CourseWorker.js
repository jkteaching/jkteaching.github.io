class CourseWorker {
    constructor(course){
        this.course;
        this.lessonNumber = 1;
        this.lessons;
        this.lesson;
        this.exercise;
        this.pageEvents = [];
    
        if(course) this.loadCourse(course);
    }

    loadCourse(course){
        this.course = course;

        this.#setTitleInfo();
        this.#setLessonsFromSections(course.sections);
        this.setupLesson();
    }

    #setLessonsFromSections(sections){
        this.lessons = [];
        sections.forEach(section => {
            this.lessons.push(...section.lessons);
        });
    }

    setupLesson(lessonNumber){
        this.#setLesson(lessonNumber);
        this.#setLecture();
        this.#setExercise();
        this.#setupPageEvents();
    }

    getNextLesson(){
        if(this.lessonNumber < this.lessons.length){
            const params = new URLSearchParams(window.location.search);
            params.set('page', ++this.lessonNumber);
            window.location.search = params;
            //this.setupLesson(this.lessonNumber); See if there is a way to fix this later;
        }
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
        lessonNumber = parseInt(lessonNumber ?? params.get("page") ?? 1);

        this.lessonNumber = lessonNumber <= this.lessons.length ? lessonNumber: this.lessonNumber;
        this.lesson = this.lessons[this.lessonNumber - 1];
        document.querySelector("[page]").setAttribute("page", this.lessonNumber);
    }

    #setLecture(){
        this.#addLinesToElement("lecture",this.lesson.lecture);
    }

    #setExercise(){
        this.exercise = this.lesson.exercises[0];
        this.#addLinesToElement("exercise-overview",this.exercise.overview);
        this.#setInstructions(this.exercise.instructions);
        this.#setIframeData(this.exercise.iframeData);
        this.#addLinesToElement("code",this.#getCodeLines());
    }

    #getCodeLines(){
        let codeLines = [];
        this.exercise.data.forEach((line, idx) => {
            const size = this.#getCharacterSize(this.exercise.answers[idx]);
            let codeLine = "<code><li>" + line.replaceAll("{input}", '<input size="' + size + '" class="answer" type="text"/>') + "</li></code>"
            codeLines.push(codeLine);
        });
        return codeLines;
    }

    #setupPageEvents(){
        this.#resetPageEvents();
        this.#setupHeader();
        this.#setupTabEvents();
        this.#setupCodeEvents();
    }

    #setupHeader(){
        document.querySelectorAll("[flyout], .flyout-overlay").forEach(flyoutlink => {
            this.pageEvents.push(flyoutlink.addEventListener("click",(e) => {
                e.stopPropagation();
                this.#toggleFlyout(flyoutlink.getAttribute("flyout") ?? flyoutlink.parentNode.id);
            }));
        });
        this.#setupCourseList();
    }

    #toggleFlyout(flyoutId){
        document.getElementById(flyoutId).classList.toggle("hide");
        document.getElementById("page-content").classList.toggle("mild-blur");
    }

    #setupCourseList(){
        let courseData = new Array(this.course.sections.length + this.lessons.length);
        let slotCounter = 0;
        let lessonCounter = 1;
        this.course.sections.forEach(section =>{
            courseData[slotCounter++] = '<h4 class="course-section">' + section.sectionName + '</h4>'
            this.lessons.forEach(courseLesson => {
                const linkClass = this.lessonNumber == lessonCounter ? "selected": "";
                courseData[slotCounter++] = '<div class="course-lesson"><a href="?page='+ lessonCounter +'" title="' + courseLesson.title + '" class="' + linkClass + '">' + courseLesson.title + "</a></div>";
                lessonCounter++;
            });
        })
        
        this.#addLinesToElement("course-list-data",courseData);
    }

    #setupTabEvents(){
        const tabs = document.querySelectorAll("[movetotab]");
        tabs.forEach(tab => {
            this.pageEvents.push(tab.addEventListener("click",(e) => {
                e.stopPropagation();
                this.switchToTab(tab.getAttribute("movetotab"));
            }));
        });

    }

    #setupCodeEvents(){
        this.pageEvents.push(
            document.getElementById("code-run").addEventListener("click", () => this.#runCode()),
            document.getElementById("code-copy").addEventListener("click", () => this.#copyCode()),
            document.getElementById("nextlesson").addEventListener("click", () => this.getNextLesson())
        );
        // document.querySelectorAll(".code input").forEach(input =>{
        //     this.pageEvents.push(input.addEventListener("keydown", (event) => this.#changeInputSize(event)));
        // }); //TODO Determine if I want this
    }

    #runCode(){
        this.#checkAnswer();
        this.#injectAndExecuteCode();
    }

    #checkAnswer(){
        this.#clearInstructionStepsStatus();

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
        const answers = this.exercise.answers;
        const inputs = document.querySelectorAll(".code input");
        for(let i=0; i < answers.length; i++){
            try {
                if(answers[i].trim() == inputs[i].value.trim())
                    this.#setInstructionStepsComplete(i);
                else
                    return false;
            } catch {
                return false;
            }
        }
        return true;
    }

    #clearInstructionStepsStatus(){
        const steps = document.querySelectorAll('#instructions-list li.completed');
        steps.forEach(step => step.classList.remove("complete"));
    }

    #setInstructionStepsComplete(answerIdx){
        const steps = document.querySelectorAll('#instructions-list li[answer-idx="'+answerIdx+'"]');
        steps.forEach(step => step.classList.add("complete"));
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
        let code = this.exercise.data.join();
        document.querySelectorAll(".code input")
            .forEach(inputElment => code = code.replace("{input}", inputElment.value));
        return code;
    }

    #injectAndExecuteCode(){
        let code = this.#getCode();
        switch(this.exercise.dataType){
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
        document.getElementById(elementId).innerHTML = lineArray.join('')
    }

    #setInstructions(instructions){
        let instructionsHtmlArray = new Array(instructions.length);
        instructions.forEach((step, idx) => {
            instructionsHtmlArray[idx] = '<li answer-idx="' + step.answerLinkIndex + '">' + step.text + "</li>";//TODO: add icon with hide
        })
        this.#addLinesToElement("instructions-list", instructionsHtmlArray);
    }

    #setIframeData(iframeData){
        const iframeDoc = document.getElementById("results-iframe").contentDocument;
        iframeDoc.write(iframeData.join(''));
    }

    #changeInputSize(event){
        var input = event.target,
        size = parseInt(input.getAttribute('size'), 10),
        isValidKey = this.#doesKeyCountForSize(event.keyCode);

    if ( event.which === 8 && size > 0 ) input.setAttribute('size', size - 1); // backspace
    else if ( isValidKey )
        input.setAttribute('size', size + 1); // all other keystrokes
    }

    #getCharacterSize(text) {
        let count = 0;
        for(let i = 0; i < text.length; i++){
            if(this.#doesKeyCountForSize(text.charCodeAt(i)))
                ++count;
        }
        return count;
    }

    #doesKeyCountForSize(keyCode) {
        return (keyCode >= 65 && keyCode <= 90) || // A-Z
        (keyCode >= 97 && keyCode <= 122) || //a-z
        (keyCode >= 48 && keyCode <= 57) || // 0-9
        keyCode === 32; //space
    }
}