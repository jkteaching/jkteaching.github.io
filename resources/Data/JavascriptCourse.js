const courseData = {
    courseName: "JavaScript Basics",
    sections: [
        {
            sectionName: "JavaScript Introduction",
            lessons:[
                {
                    title: "What is JavaScript",
                    lecture: [
                        "<h3>What is JavaScript</h3>",
                        "<p>JavaScript is used to give extra functionality to your web page. There is a lot of effects that you can make happen with CSS3, but there are still many limitations. JavaScript is a Client-side language, which means it is runs on the user's computer.</p>","<p>JavaScript is a scripting language which means it doesn't need to be compiled. Compiling just means the code must be run through an engine to build the code into something else to be interpreted.</p>",
                        "<p>JavaScript is an Event-Driven language. The program's execution is determined by external events, rather than following a predetermined flow.</p>",
                        "<h3>How does JavaScript work</h3>",
                        "<p>JavaScript is a client-side code which means the code executes on the user's computer. The first thought that comes to mind for people when they think about it running on a client's computer rather than on a server is that there is no uniformaty with could make it difficult when testing. There are some benefits to this though. First benefit is usability. The code can modify a page without having to post back to the server, which means a much faster time to update. Second Benefit is efficiency. The code can make small, quick changes to page without waiting for server so less data usage. The Third and final benefit is event-driven. The code can respond to user actions like clicks and key presses. All of the benefits pair vary well to have a fast and efficent mode.</p>",
                        "<h3>Shape of JavaScript</h3>",
                        "<p>JavaScript has a few very distingushing features that really makes up what JavaScript is. JavaScript is Interpreted, not compiled. Compiled code means that you write the code in some language and then it get broken down into another code that the computer can than read. JavaScript being an Interperted means that the Code does not get built instead it is able to just run.</p>",
                        "<p>JavaScript has more relaxed syntax and which does add to the difficulty sometimes, but other times it allows you to do things that no other code would be capiable of performing. JavaScript has fewer and \"looser\" data types, which means they can change and any point if you want. Variables don't need to be declared, although they should. Finally, errors are often silent (few exceptions) which can make it difficult to know there is an issue.</p>",
                        "<p>Key construct is the function rather than the class. Class have been added to JavaScript but it is very common to see \"first-class\" functions used in many situations, which meaning functions are treated like variables</p>"
                    ],
                    exercises: [
                        {
                            type: "lab",
                            overview: [
                                "<p>In this Exercise, we are going to attempt our first JavaScript code. We are first going to explain the JavaScript function that we will be running <code>window.alert()</code>.</p>",
                                "<p>The function <code>window.alert()</code> is used when you want to display a popup on the client screen with a message. This popup will lock the users screen till they interact with the <strong>OK</strong> button. This function can be very useful in situation where we really need the user to pay attetion the message we are send. It is typically used when you want to inform the users if they continue with their action then something bad might happen, like loss of data.</p>"],
                            instructions: [
                                { 
                                    text: "On line 1, type <code>window.alert(\"Hello World\");</code>",
                                    answerLinkIndex: 0
                                },
                                { 
                                    text: "Click the <strong>Run</strong> button.",
                                    answerLinkIndex: 0
                                }
                            ],
                            wrapCodeInScriptTag: true,
                            dataType: "JS",
                            data: ["{input}"],
                            iframeData: [],
                            answers: ['window.alert("Hello World");'],
                            answerInjectScript: `let alertWrapper = window.alert; window.alert = (message) => { console.log("It was a hit: " + message); alertWrapper(message); }`
                        },
                        {
                            type: "lab",
                            overview: [
                                "<p>In this Exercise, we are going to attempt our first JavaScript code. We are first going to explain the JavaScript function that we will be running <code>window.alert()</code>.</p>",
                                "<p>The function <code>window.alert()</code> is used when you want to display a popup on the client screen with a message. This popup will lock the users screen till they interact with the <strong>OK</strong> button. This function can be very useful in situation where we really need the user to pay attetion the message we are send. It is typically used when you want to inform the users if they continue with their action then something bad might happen, like loss of data.</p>"],
                            instructions: [
                                { 
                                    text: "On line 1, type <code>window.alert(\"Hello World\");</code>",
                                    answerLinkIndex: 0
                                },
                                { 
                                    text: "Click the <strong>Run</strong> button.",
                                    answerLinkIndex: 0
                                }
                            ],
                            wrapCodeInScriptTag: true,
                            dataType: "JS",
                            data: ["{input}"],
                            iframeData: [],
                            answers: ['window.alert("Hello World");'],
                            answerInjectScript: `let alertWrapper = window.alert; window.alert = (message) => { console.log("It was a hit: " + message); alertWrapper(message); }`
                        }
                    ]
                },
                {
                    title: "What is the DOM?",
                    lecture: [
                        "<h3>What is the DOM?</h3>",
                        "<p></p>",
                    ],
                    exercises: [
                        {
                            type: "lab",
                            overview: [
                                "<p>In this Exercise, we are going to attempt </p>"
                            ],
                            instructions: [
                                { 
                                    text: "On line 1, type <code>window.alert(\"Hello World\");</code>",
                                    answerLinkIndex: 0
                                },
                                { 
                                    text: "Click the <strong>Run</strong> button.",
                                    answerLinkIndex: 0
                                }
                            ],
                            wrapCodeInScriptTag: true,
                            dataType: "JS",
                            data: ["{input}"],
                            iframeData: ["<button>click me</button>"],
                            answers: ['window.alert("Hello World");']
                        }
                    ]
                },
                {
                    title: "JavaScript is Event-Driven",
                    lecture: [
                        "<h3>JavaScript is Event-Driven</h3>",
                        "<p>Content</p>",
                    ],
                    exercises: [
                        {
                            type: "lab",
                            overview: [
                                "<p>In this Exercise, we are going to attempt </p>"
                            ],
                            instructions: [
                                { 
                                    text: "We need to use the <code>getElementById</code> to get the button that has an id of <code>eventbutton</code>",
                                    answerLinkIndex: 0
                                },
                                { 
                                    text: "In the first input on line 1, type <code>getElementById</code>",
                                    answerLinkIndex: 0
                                },
                                { 
                                    text: "In the second input on line 1, type <code>eventbutton</code>",
                                    answerLinkIndex: 1
                                },
                                { 
                                    text: "Now it is time to add our event listener to create an event for our button",
                                    answerLinkIndex: 2
                                },
                                { 
                                    text: 'On line 2, add the event listen by typing <code>addEventListener("click"</code>',
                                    answerLinkIndex: 2
                                }
                            ],
                            wrapCodeInScriptTag: true,
                            dataType: "JS",
                            data: ['const btn = document.{input}("{input}");',
                                'btn.{input},function(){',
                                '&#x0090;window.alert("You Clicked the Button.");',
                                "});"
                            ],
                            iframeData: ['<button id="eventbutton">click me</button>'],
                            answers: ['getElementById', 'eventbutton','addEventListener("click"']
                        }
                    ]
                }
               ] 
        },
        {
            sectionName: "Objects in JavaScript",
            lessons:[ 
                {
                    title: "Base Types JavaScript",
                    lecture: [
                        "<h3>What are types</h3>",
                        "<p></p>",
                        "<h3><code>Booleans</code></h3>",
                        "<p></p>",
                        "<h3><code>Numbers</code></h3>",
                        "<p></p>",
                        "<h3><code>Strings</code></h3>",
                        "<p></p>"
                    ],
                    exercises: [
                        {
                            type: "lab",
                            overview: [
                                "<p>In this Exercise, we are going to attempt our first JavaScript code. We are first going to explain the JavaScript function that we will be running <code>window.alert()</code>.</p>",
                                "<p>The function <code>window.alert()</code> is used when you want to display a popup on the client screen with a message. This popup will lock the users screen till they interact with the <strong>OK</strong> button. This function can be very useful in situation where we really need the user to pay attetion the message we are send. It is typically used when you want to inform the users if they continue with their action then something bad might happen, like loss of data.</p>"],
                            instructions: [
                                { 
                                    text: "On line 1, type <code>window.alert(\"Hello World\");</code>",
                                    answerLinkIndex: 0
                                },
                                { 
                                    text: "Click the <strong>Run</strong> button.",
                                    answerLinkIndex: 0
                                }
                            ],
                            wrapCodeInScriptTag: true,
                            dataType: "JS",
                            data: ["{input}"],
                            iframeData: [],
                            answers: ['window.alert("Hello World");'],
                            answerInjectScript: `let alertWrapper = window.alert; window.alert = (message) => { console.log("It was a hit: " + message); alertWrapper(message); }`
                        }
                    ]
                }
            ]
        }
    ]
    
}