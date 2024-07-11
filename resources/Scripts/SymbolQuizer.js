const arithmeticSymbols = ["+", "-", "*", "/", "%", "**", "++", "--"];
const assignmentSymbols = ["=", "+=", "-=","*=","/=","%=", "**="];
const comparisonSymbols = ["==", "!=", "===", ">", "<", ">=", "<="];
const comparisonSymbolsText = ["Equals", "Does Not Equal", "Equals (with Type)", "Greater Than", "Less Than", "Greater Than or Equal", "Less Than or Equal"];
const logicalSymbols = ["&&", "||", "!"];
const logicalSymbolsText = ["AND", "OR", "NOT"];
const bitwiseSymbols = ["&", "^", "|", "~", "<<", ">>", ">>>"];
const bitwiseSymbolsText = ["AND", "XOR", "OR", "NOT", "Left Shift", "Signed Right Shift", "Unsigned Right Shift"];
const bitwiseSymbolsDescription = ["Set each bit to 1 if both bits are 1", "Sets each bit to 1 if only one of two bits is 1", "Set each bit to 1 if one of two bits is 1",
  "Invert all the bits", "Push zeros in from the right and let the leftmost bits fall off",
  "Push copies of the leftmost bit in from the left, and let the rightmost bits fall off",
  "Push zeros in from the left, and let the rightmost bits fall off"];
let quizzer;

class ProblemGeneratorProps{
  constructor(){
    this.useHints = true; 
    this.useArithmeticSymbols = true;
    this.useAssignmentSymbols = false;
    this.useComparisonSymbols = false;
    this.useLogicalSymbols = false;
    this.useBitwiseSymbols = false;
    this.amountOfQuestions;
  }
}

class ProblemGenerator {
	constructor(props){
		this.questions = [];
    this.currentQuestionIndex = -1;
    this.useHints = props.useHints;
    
    this.useArithmeticSymbols = props.useArithmeticSymbols;
    this.useAssignmentSymbols = props.useAssignmentSymbols;
    this.useComparisonSymbols = props.useComparisonSymbols;
    this.useLogicalSymbols = props.useLogicalSymbols;
    this.useBitwiseSymbols = props.useBitwiseSymbols;
    
    this.availableArithmeticSymbols = arithmeticSymbols.slice();
    this.availableAssignmentSymbols = assignmentSymbols.slice();
    this.availableComparisonSymbols = comparisonSymbols.slice();
    this.availableLogicalSymbols = logicalSymbols.slice();
    this.availableBitwiseSymbols = bitwiseSymbols.slice();
    
    this.generateQuestions(props.amountOfQuestions);
  }
  
  getNextQuestion(){
    if(this.currentQuestionIndex >= 0) {
  	  this.questions[this.currentQuestionIndex].setAnswer(this.#getSymbolInputValue());
    }
  
  	++this.currentQuestionIndex;
  	if(this.currentQuestionIndex >= this.questions.length){
      this.currentQuestionIndex = this.questions.length;
    	this.#showResults();
    }
    else{
    	this.#showQuestion(this.questions[this.currentQuestionIndex]);
    }
  }

  getPreviousQuestion(){
    if(this.currentQuestionIndex < this.questions.length)
  	  this.questions[this.currentQuestionIndex].setAnswer(this.#getSymbolInputValue());
  
  	--this.currentQuestionIndex;
  	if(this.currentQuestionIndex < 0){
      this.currentQuestionIndex == 0;
    	this.showConfiguration();
    }
    else{
    	this.#showQuestion(this.questions[this.currentQuestionIndex]);
    }
  }
  
  #showResults(){
    let results = "<h2>Quiz Results</h2>";
    results += '<div class="result"><span class="bold">Answer Ratio: </span>~~~ / ' + this.questions.length + '</div>';
    results += '<div class="result"><span class="bold">Score: </span>~~~%</div>';
    results += "<h2>Question Breakdown</h2>";

    let correctCount = 0;
    for(let i = 0; i < this.questions.length; i++){
      let question = this.questions[i];
      correctCount += question.isCorrect() ? 1: 0;
      results += this.#getQuestionResultHTML(question, i + 1);
    }
    results = results
      .replace("~~~", correctCount)
      .replace("~~~", Math.round((correctCount / this.questions.length)*100));

  	document.getElementById("content").innerHTML = this.#decodeHTML(results);
    document.getElementById("prev").disabled = true;
    document.getElementById("next").disabled = true;
  }

  #getQuestionResultHTML(question, questionNumber){
    let result = '<div class="'+ (question.isCorrect() ? "correct": "incorrect") +'">';
    result += '<h3>Question '+questionNumber +'</h3>';
    result += '<dl>';
    result += '<dt>Your Answer</dt>';
    result += '<dd>' + question.yourAnswer + '</dd>';
    result += '<dt>Correct Answer</dt>';
    result += '<dd>' + question.correctAnswer + '</dd>';
    result += '</dl></div>';
    return result;
  }
  
  showConfiguration(){
  	location.reload();
  }
  
  #showQuestion(question){
  	document.getElementById("content").innerHTML = this.#decodeHTML(question.questionHTML);

    this.#setAnsweredQuestion(question);
  } 
  
  #decodeHTML(htmlString) {
    return htmlString.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
	}

  #setAnsweredQuestion(question){
    const inputElements = document.getElementsByClassName("symbol");

    for(let i = 0; i < inputElements.length; i++){
      if(typeof(question.yourSymbols) !== "undefined" &&  question.yourSymbols.length > 0)
        inputElements[i].value =  question.yourSymbols[i];
      
      inputElements[i].addEventListener("keypress", (event) => { 
        if (event.key === "Enter") this.getNextQuestion();
      });
    }

    inputElements[0].focus();
  }

  #getSymbolInputValue(){
    const inputs = document.getElementsByClassName("symbol");
    const values = [];
    for(let i = 0; i < inputs.length; i++)
      values.push(inputs[i].value);
    return values;
  }
  
  generateQuestions(amountOfQuestion){
  	this.questions = [];
  	let questionCount = amountOfQuestion ?? 0;

  	if(questionCount <= 0){
    	questionCount += this.useArithmeticSymbols ? arithmeticSymbols.length: 0;
    	questionCount += this.useAssignmentSymbols ? assignmentSymbols.length: 0;
    	questionCount += this.useComparisonSymbols ? comparisonSymbols.length: 0;
    	questionCount += this.useLogicalSymbols ? comparisonSymbols.length: 0;
    	questionCount += this.useBitwiseSymbols ? comparisonSymbols.length: 0;
    }

    let questionTypes = [];
    if(this.useArithmeticSymbols) questionTypes.push(ArithmeticQuestion.name);
    if(this.useAssignmentSymbols) questionTypes.push(AssignmentQuestion.name);
    if(this.useComparisonSymbols) questionTypes.push(ComparisonQuestion.name);
    if(this.useLogicalSymbols) questionTypes.push(LogicalQuestion.name);
    if(this.useBitwiseSymbols) questionTypes.push(BitwiseQuestion.name);
    
    do{
    	const randomQuestionTypeName = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      let question;
      
      if(randomQuestionTypeName === ArithmeticQuestion.name){
      	question = new ArithmeticQuestion(this.useHints);
      	const symbolIndex = question.generateQuestion(this.availableArithmeticSymbols);
        
        const symbol = this.availableArithmeticSymbols[symbolIndex];
        this.availableArithmeticSymbols = this.availableArithmeticSymbols.filter(item => item != symbol);
        if(this.availableArithmeticSymbols.length === 0){
          questionTypes = questionTypes.filter(item => item != ArithmeticQuestion.name);
        }
      }
      else if(randomQuestionTypeName === AssignmentQuestion.name){
      	question = new AssignmentQuestion(this.useHints);
      	let symbolIndex = question.generateQuestion(this.availableAssignmentSymbols);

        const symbol = this.availableAssignmentSymbols[symbolIndex];
        this.availableAssignmentSymbols = this.availableAssignmentSymbols.filter(item => item != symbol);
        if(this.availableAssignmentSymbols.length === 0){
          questionTypes = questionTypes.filter(item => item != AssignmentQuestion.name);
        }
      }
      else if(randomQuestionTypeName === ComparisonQuestion.name){
      	question = new ComparisonQuestion(this.useHints);
      	let symbolIndex = question.generateQuestion(this.availableComparisonSymbols);

        const symbol = this.availableComparisonSymbols[symbolIndex];
        this.availableComparisonSymbols = this.availableComparisonSymbols.filter(item => item != symbol);
        if(this.availableComparisonSymbols.length === 0){
          questionTypes = questionTypes.filter(item => item != ComparisonQuestion.name);
        }
      }
      else if(randomQuestionTypeName === LogicalQuestion.name){
      	question = new LogicalQuestion(this.useHints);
      	let symbolIndex = question.generateQuestion(this.availableLogicalSymbols);

        const symbol = this.availableLogicalSymbols[symbolIndex];
        this.availableLogicalSymbols = this.availableLogicalSymbols.filter(item => item != symbol);
        if(this.availableLogicalSymbols.length === 0){
          questionTypes = questionTypes.filter(item => item != LogicalQuestion.name);
        }
      }
      else if(randomQuestionTypeName === BitwiseQuestion.name){
      	question = new BitwiseQuestion(this.useHints);
      	let symbolIndex = question.generateQuestion(this.availableBitwiseSymbols);

        const symbol = this.availableBitwiseSymbols[symbolIndex];
        this.availableBitwiseSymbols = this.availableBitwiseSymbols.filter(item => item != symbol);
        if(this.availableBitwiseSymbols.length === 0){
          questionTypes = questionTypes.filter(item => item != BitwiseQuestion.name);
        }
      }
      
      if(typeof(question) !== "undefined"){
      	this.questions.push(question);
      	--questionCount;
      }
      
      if(questionTypes.length === 0){
      	questionCount = 0;
      }
      
    }
    while(questionCount > 0);
  }
}

class Question {
	constructor(hints) {
		this.yourSymbols = [];
		this.yourAnswer = "";
  	this.correctAnswer = "";
    this.questionHTML = "";
    this.questionTemplate = "~~~";
    this.showHints = hints ?? true;
  }
  
  isCorrect() {
  	return this.yourAnswer == this.correctAnswer;
  }

  setQuestionHeader(header, possibleSymbols){
    this.questionHTML = "<h2>" + header + "</h2>";
    this.questionHTML += this.showHints ? "<dl><dt>Possible Answers</dt><dd>"
      + possibleSymbols.toString().replaceAll(",", "&nbsp;&nbsp;&nbsp;&nbsp;") + "</dd><h3>Question</h3>" : "";
  }
  
  setAnswer(yourSymbols){
    this.yourSymbols = yourSymbols;
    this.yourAnswer = this.questionTemplate;
    this.yourSymbols.forEach((symbol) => {
      this.yourAnswer = this.yourAnswer.replace("~~~", symbol);
    });

    const answer = eval(this.yourAnswer.replaceAll("<br>",""));
    this.yourAnswer += " = " + answer;
  }
  
  getRandomSymbol(availableSymbolIndexes){
  	const randomIndex = Math.floor(Math.random() * availableSymbolIndexes.length);
    let ret = { symbol: availableSymbolIndexes[randomIndex], index:randomIndex };
    return ret;
  }
  
  generateQuestion(availableSymbolIndexes){
  	this.questionHTML = "Invaild Question";
    return -1;
  }
}

class ArithmeticQuestion extends Question {
	generateQuestion(availableSymbolIndexes){
    const answer = this.getRandomSymbol(availableSymbolIndexes);

    this.setQuestionHeader("Arthemtic Question", arithmeticSymbols);
    
    const number1 = Math.floor(Math.random() * 21) + 3;
    const number2 = Math.floor(Math.random() * 11) + 3;

    if(answer.symbol == "++" || answer.symbol == "--")
    	this.#generateShortcutQuestion(answer, number1, number2);
    else
      this.#generateArithemicQuestion(answer, number1, number2);

    return answer.index;
  }

  #generateShortcutQuestion(answer, number1, number2){
    const placeBefore = Math.floor(Math.random() * 2);
    this.questionTemplate = "let var1 = " + number1 +";<br>~~~var1~~~ + " + number2;
    let question = this.questionTemplate;

    if(placeBefore)
      question = question.replace("~~~", answer.symbol).replace("~~~","");
    else
      question = question.replace("~~~","").replace("~~~", answer.symbol);

    let answerNum = eval(question.replace("<br>", ""));
    
    this.correctAnswer = question + " = " + answerNum;
    this.questionHTML += "<p>" +
      this.questionTemplate
        .replace("~~~", '<input class="symbol rightAlign" type="text"/>')
        .replace("~~~", '<input class="symbol leftAlign" type="text"/>')
      + " = " + answerNum + " // var1's value: " + eval(number1 + answer.symbol[0] + "1") + "</p>";
  }

  #generateArithemicQuestion(answer, number1, number2) {
    this.questionTemplate = number1 + " ~~~ " + number2;
    let question = this.questionTemplate.replace("~~~", answer.symbol);
    let answerNum = eval(question);
    
    this.correctAnswer = question + " = " + answerNum;
    
    this.questionHTML += "<p>" + this.questionTemplate.replace("~~~", '<input class="symbol" type="text"/>') + " = " + answerNum + "</p>";
  }
}

class AssignmentQuestion extends Question {
  generateQuestion(availableSymbolIndexes){
    const answer = this.getRandomSymbol(availableSymbolIndexes);

    this.setQuestionHeader("Assignment Question", assignmentSymbols);
    
    const number1 = Math.floor(Math.random() * 21) + 3;
    const number2 = Math.floor(Math.random() * 11) + 3;

    this.questionTemplate = "let var1 = " + number1 +";<br>var1 ~~~ " + number2;

    let question = this.questionTemplate.replace("~~~", answer.symbol);
    let answerNum = eval(question.replace("<br>", ""));
    this.correctAnswer = question + " = " + answerNum;
    
    this.questionHTML += "<p>" +
      this.questionTemplate.replace("~~~", '<input class="symbol" type="text"/>') 
      + " // var1's value: " + answerNum + "</p>";

    return answer.index;
  }
}

class ComparisonQuestion extends Question {
  generateQuestion(availableSymbolIndexes){
    const answer = this.getRandomSymbol(availableSymbolIndexes);

    this.setQuestionHeader("Comparison Question", comparisonSymbols);
    
    const number1 = Math.floor(Math.random() * 4) + 3;
    const number2 = Math.floor(Math.random() * 4) + 3;

    const symbolIdx = comparisonSymbols.indexOf(answer.symbol);
    this.questionTemplate = "/* Make Comparsion for var1 " + comparisonSymbolsText[symbolIdx] + " var2 */<br>" +
      "let var1 = " + number1 +
      ";<br>let var2 = " + number2 + ";<br>var1 ~~~ var2 ";

    let question = this.questionTemplate.replaceAll("~~~", answer.symbol);
    let answerNum = eval(question.replaceAll("<br>", ""));
    this.correctAnswer = question + " = " + answerNum;
    
    this.questionHTML += "<p>" + this.questionTemplate.replace("~~~", '<input class="symbol" type="text"/>') + " = " + answerNum + "</p>";

    return answer.index;
  }
}

class LogicalQuestion extends Question {
  generateQuestion(availableSymbolIndexes){
    const answer = this.getRandomSymbol(availableSymbolIndexes);

    this.setQuestionHeader("Logical Question", logicalSymbols);
    
    const number1 = Math.floor(Math.random() * 11) + 1;
    const number2 = Math.floor(Math.random() * 11) + 1;

    if(answer.symbol == "!" )
    	this.#generateLogicalNOTQuestion(answer, number1);
    else
      this.#generateLogcialQustion(answer, number1, number2);

    return answer.index;
  }

  #generateLogicalNOTQuestion(answer, number1){
    const symbolIdx = logicalSymbols.indexOf(answer.symbol);
    this.questionTemplate = "/* Make Comparsion where var1 is " + logicalSymbolsText[symbolIdx] + " less than 5 */<br>" +
      "let var1 = " + number1 + ";<br>~~~(var1 < 5)";

    let question = this.questionTemplate.replaceAll("~~~", answer.symbol);
    let answerNum = eval(question.replaceAll("<br>", ""));
    this.correctAnswer = question + " = " + answerNum;
    
    this.questionHTML += "<p>" + this.questionTemplate.replace("~~~", '<input class="symbol right" type="text"/>') + " = " + answerNum + "</p>";
  }

  #generateLogcialQustion(answer, number1, number2){
    const symbolIdx = logicalSymbols.indexOf(answer.symbol);
    this.questionTemplate = "/* Make Comparsion where var1 is less than 5 " + logicalSymbolsText[symbolIdx] + " var2 is greater than 5 */<br>" +
      "let var1 = " + number1 + ";<br>let var2 = " + number2 + ";<br>var1 < 5 ~~~ var2 > 5";

    let question = this.questionTemplate.replaceAll("~~~", answer.symbol);
    let answerNum = eval(question.replaceAll("<br>", ""));
    this.correctAnswer = question + " = " + answerNum;
    
    this.questionHTML += "<p>" + this.questionTemplate.replace("~~~", '<input class="symbol" type="text"/>') + " = " + answerNum + "</p>";
  }
}

class BitwiseQuestion extends Question {
  generateQuestion(availableSymbolIndexes){
    const answer = this.getRandomSymbol(availableSymbolIndexes);

    this.setQuestionHeader("Bitwise Question", bitwiseSymbols);
    
    const number1 = Math.floor(Math.random() * 11) + 1;
    const number2 = Math.floor(Math.random() * 11) + 1;

    if(answer.symbol == "~" )
    	this.#generateBitwiseNOTQuestion(answer, number1);
    else
      this.#generateBitwiseQustion(answer, number1, number2);

    return answer.index;
  }
  #generateBitwiseNOTQuestion(answer, number1){
    const symbolIdx = bitwiseSymbols.indexOf(answer.symbol);
    this.questionTemplate = "/* Bitwise Operation: " + bitwiseSymbolsText[symbolIdx] + " var1 */<br>/* " + bitwiseSymbolsDescription[symbolIdx] + " */<br>" +
      "let var1 = " + number1 + ";<br> ~~~var1";

    let question = this.questionTemplate.replaceAll("~~~", answer.symbol);
    let answerNum = eval(question.replaceAll("<br>", ""));
    this.correctAnswer = question + " = " + answerNum;
    
    this.questionHTML += "<p>" + this.questionTemplate.replace("~~~", '<input class="symbol right" type="text"/>') + " = " + answerNum + "</p>";

  }

  #generateBitwiseQustion(answer, number1, number2){
    const symbolIdx = bitwiseSymbols.indexOf(answer.symbol);
    this.questionTemplate = "/* Bitwise Operation: var1 " + bitwiseSymbolsText[symbolIdx] + " var2 */<br>/* " + bitwiseSymbolsDescription[symbolIdx] + " */<br>" +
      "let var1 = " + number1 +
      ";<br>let var2 = " + number2 + ";<br>var1 ~~~ var2 ";

    let question = this.questionTemplate.replaceAll("~~~", answer.symbol);
    let answerNum = eval(question.replaceAll("<br>", ""));
    this.correctAnswer = question + " = " + answerNum;
    
    this.questionHTML += "<p>" + this.questionTemplate.replace("~~~", '<input class="symbol" type="text"/>') + " = " + answerNum + "</p>";

  }
}

function configProblemGenerator(){
  props = new ProblemGeneratorProps();
  props.useArithmeticSymbols = document.getElementById("useArithmeticSymbols").checked;
  props.useAssignmentSymbols = document.getElementById("useAssignmentSymbols").checked;
  props.useComparisonSymbols = document.getElementById("useComparisonSymbols").checked;
  props.useLogicalSymbols = document.getElementById("useLogicalSymbols").checked;
  props.useBitwiseSymbols = document.getElementById("useBitwiseSymbols").checked;
  props.useHints = document.getElementById("useHints").checked;
  var questionCount = document.getElementById("questionCount").value;
  if(typeof(questionCount) !== "undefined" && questionCount !== "")
    props.amountOfQuestions = parseInt(questionCount);

	quizzer = new ProblemGenerator(props);

  const prev = document.getElementById("prev");
  prev.disabled = false;
  prev.addEventListener("click",() => quizzer.getPreviousQuestion());
  
  const next = document.getElementById("next");
  next.disabled = false;
  next.addEventListener("click",() => quizzer.getNextQuestion());

  quizzer.getNextQuestion();
};