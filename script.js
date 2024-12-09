import { activeEvents, triggerPassiveEvent, passiveEvents } from './events.js';

// Initial game state
export let gameState = {
    stress: 0,
    brainPower: 30,
    gpa: 3.0,
    social: 10,
    gradeLevel: 9,
    isInClub: false,
    isInRelationship: false,
    studentGov: false,
    leadershipExperience: 0,
    extracurriculars: 0,
    semester: 1,
    choiceTime: 1,
    clubPresident: false,
    previousStress: 0,
    gameOver: false,
    triggeredPassiveEvents: [],
    arguedWithTeacher: false,
    endingTitle: "",
};

// Start or reset the semester
function startSemester() {
    console.log(`Starting Grade ${gameState.gradeLevel}, Semester ${gameState.semester}`);

    if (gameState.gradeLevel > 12) {
        endGame();
        logEvent("Congratulations! You've completed high school!");
        return;
    }

    if (gameState.semester === 1 && gameState.choiceTime === 1) {
        gameState.studentGov = false;
        logEvent(`Welcome to Grade ${gameState.gradeLevel}, Semester ${gameState.semester}!`);
    }

    displayEventChoices();
    updateSidebar();
}

// Display event choices as buttons
function displayEventChoices() {
    const choiceButtonsDiv = document.getElementById("choice-buttons");
    choiceButtonsDiv.innerHTML = "";

    const choiceOptions = getChoiceTimeOptions(gameState.choiceTime);

    // Log available events for debugging
    console.log("Available events:", choiceOptions.map(event => event.name));

    const filteredOptions = choiceOptions.filter(event => 
        !["Service Club", "General Club", "Competitional Club", "Academic Club"].includes(event.name)
    );

    filteredOptions.forEach(event => {
        if (!event || !event.name) return;
        const button = document.createElement("button");
        button.textContent = `${event.name}: ${event.description}`;

        // Add class based on event type
        if (["Very hard work", "Normal effort", "Slacking"].includes(event.name)) {
            button.classList.add("hardwork");
        } else if (event.name.includes("Application")) {
            button.classList.add("application");
        } else if (["All Night Revision", "Normal Revision", "Give Up"].includes(event.name)) {
            button.classList.add("revision");
        } else if (event.name.includes("Club") || event.name.includes("clubs")) {
            button.classList.add("club");
        } else if (event.name === "Student Government" || event.name === "Run for student government") {
            button.classList.add("student-gov");
        } else {
            button.classList.add("filler");
        }

        button.addEventListener("click", () => {
            handleEventChoice(event);
        });
        choiceButtonsDiv.appendChild(button);
    });
}

function showPassiveEventButton() {
    const choiceButtonsDiv = document.getElementById("choice-buttons");

    // Check if the passive event button already exists
    if (!document.getElementById("passive-event-button")) {
        const passiveEventButton = document.createElement("button");
        passiveEventButton.id = "passive-event-button";
        passiveEventButton.textContent = "Trigger Passive Event";
        passiveEventButton.addEventListener("click", handlePassiveEvent);
        choiceButtonsDiv.appendChild(passiveEventButton);
    }
}


// Determine available choices
function getChoiceTimeOptions(choiceTime) {
    const filteredEvents = filterEvents(activeEvents, choiceTime);

    // Prioritize application events
    const prioritizedEvents = filteredEvents.sort((a, b) => {
        if (a.name.includes("Application") && !b.name.includes("Application")) {
            return -1; // a comes before b
        }
        if (!a.name.includes("Application") && b.name.includes("Application")) {
            return 1; // b comes before a
        }
        return 0; // no change in order
    });

    return prioritizedEvents.slice(0, 4);
}


// Filter events based on conditions
function filterEvents(eventsList, choiceTime) {
    return eventsList.filter(event => {
        const meetsChoiceTime = Array.isArray(event.choiceTime) 
            ? event.choiceTime.includes(choiceTime) 
            : event.choiceTime === choiceTime;
        return meetsChoiceTime && checkEventRequirements(event);
    });
}

export function displayClubChoices() {
    const choiceButtonsDiv = document.getElementById("choice-buttons");
    choiceButtonsDiv.innerHTML = ""; // Clear previous choices

    const clubEvents = activeEvents.filter(event => 
        ["Service Club", "General Club", "Competitional Club", "Academic Club"].includes(event.name)
    );

    clubEvents.forEach(club => {
        const button = document.createElement("button");
        button.textContent = `${club.name}: ${club.description}`;
        button.classList.add("club"); // Apply the CSS class
        button.addEventListener("click", () => {
            const result = club.consequence(gameState);
            logEvent(result);
            proceedToNextChoice(); // Ensure this function updates the UI and game state
        });
        choiceButtonsDiv.appendChild(button);
    });
}

// Check event requirements
function checkEventRequirements(event) {
    const grade = gameState.gradeLevel;
    const semester = gameState.semester;

    if (event.name === "Stay as Club President" && !gameState.clubPresident) return false;
    if (event.name === "Run for Club President" && gameState.clubPresident) return false;
    if (event.name === "Join clubs" && gameState.isInClub) return false;
    if (event.name === "Date someone" && gameState.isInRelationship) return false;
    if (event.requiresClubMembership && !gameState.isInClub) return false;
    if (event.requiresRelationship && !gameState.isInRelationship) return false;
    if (event.semesterOnly && event.semesterOnly !== semester) return false;
    if (event.gradeLevelOnly && ![].concat(event.gradeLevelOnly).includes(grade)) return false;

    console.log(event.name);
    return true;
}

function minValues(){
    gameState.stress = Math.max(0, gameState.stress);
    gameState.brainPower = Math.max(30, gameState.brainPower);
    gameState.social = Math.max(10, gameState.social);
    gameState.gpa = Math.max(0, gameState.gpa);
}

// Handle event choice and progress
function handleEventChoice(event) {
    if (gameState.gameOver) return;

    if (event.name === "Join clubs") {
        displayClubChoices();
        return;
    }

    if (event.name === "Start a New Club"){
        displayClubChoices();
        gameState.leadershipExperience++;
        return;
    }

    // Apply the event's consequences
    const result = event.consequence(gameState);
    if (result) logEvent(result);

    // Apply default actions if applicable
    applyDefaultActions(event.name, gameState.choiceTime);

    minValues();

    // Check stress limit after applying consequences
    checkStressLimit();

    // If the game is over, stop further processing
    if (gameState.gameOver) return;

    const choiceButtonsDiv = document.getElementById("choice-buttons");
    choiceButtonsDiv.innerHTML = "";  // Clear active choices

    // Show passive event button only after event 1 and 3
    if (gameState.choiceTime === 1 || gameState.choiceTime === 3) {
        showPassiveEventButton();
    } else {
        proceedToNextChoice(); // Automatically proceed if not showing passive event
    }

    updateSidebar();
}

// Apply a default action
function applyDefaultActions(eventName, choiceTime) {
    const defaultActions = {
        1: { name: "Normal effort", stressImpact: 7, brainPowerImpact: 3 },
        2: { name: "Stay as Club President", stressImpact: 4, leadershipImpact: 1 },
        4: { name: "Normal Revision", stressImpact: 6, brainPowerImpact: 3 }
    };

    const defaultAction = defaultActions[choiceTime];

    if (defaultAction && !["Very hard work", "Normal effort", "Slacking", "Stay as Club President", "All Night Revision", "Normal Revision", "Give Up"].includes(eventName)) {
        // Apply the impacts directly to the game state
        gameState.stress += defaultAction.stressImpact || 0;
        gameState.brainPower += defaultAction.brainPowerImpact || 0;
        if(gameState.clubPresident)
            gameState.leadershipExperience += defaultAction.leadershipImpact || 0;
    }
}

// Trigger and log passive event
function handlePassiveEvent() {
    const result = triggerPassiveEvent(gameState);
    minValues();
    checkStressLimit();

    if (!result) {
        console.warn("No passive event was triggered.");
        return;
    }

    const { event, consequenceMessage } = result;
    console.log("Passive event triggered:", event.name, "- Message:", consequenceMessage);

    const choiceButtonsDiv = document.getElementById("choice-buttons");
    choiceButtonsDiv.innerHTML = "";  // Clear active choices

    const passiveEventContainer = document.createElement("div");
    passiveEventContainer.classList.add("passive-event-container");

    passiveEventContainer.innerHTML = `<strong>${event.name}</strong><br>`;
    choiceButtonsDiv.appendChild(passiveEventContainer);

    logEvent(consequenceMessage);  // Log the passive event with description

    passiveEventContainer.addEventListener("click", () => {
        proceedToNextChoice();
    });
}

// Proceed to next choice or semester
function proceedToNextChoice() {
    checkStressLimit();

    if (gameState.choiceTime < 4) {
        gameState.choiceTime++;
        displayEventChoices(); // Continue to the next choice
    } else {
        calculateGPA();
        applyRestPeriod();
        gameState.choiceTime = 1;

        const choiceButtonsDiv = document.getElementById("choice-buttons");
        choiceButtonsDiv.innerHTML = ""; // Clear all choice buttons

        // Display each course grade and the GPA for this semester
        const gradesDiv = document.createElement("div");
        gradesDiv.innerHTML = `<p>Your course grades for this semester: ${gameState.courseGrades.join(', ')}</p>`;
        gradesDiv.innerHTML += `<p>GPA: ${gameState.gpa.toFixed(2)}</p>`;
        choiceButtonsDiv.appendChild(gradesDiv);

        // Add a "Next Semester" button
        const nextSemesterButton = document.createElement("button");
        nextSemesterButton.textContent = "Next Semester";
        nextSemesterButton.addEventListener("click", () => {
            if (gameState.semester === 1) {
                gameState.semester = 2;
            } else {
                gameState.semester = 1;
                gameState.previousStress = gameState.stress;
                gameState.gradeLevel++;

                if (gameState.gradeLevel > 12) {
                    endGame();
                    return;
                }
            }
            displayEventChoices();
            updateSidebar();
        });
        choiceButtonsDiv.appendChild(nextSemesterButton);
    }

    updateSidebar(); // Update the sidebar with the latest game state
}

// End the game
function endGame() {
    const choiceButtonsDiv = document.getElementById("choice-buttons");
    choiceButtonsDiv.innerHTML = ""; // Clear all choice buttons

    let endMessage = "";

    if (gameState.gradeLevel > 12) {
        endMessage = "Congratulations! You've completed high school!";
    } else if (gameState.stress >= 100) {
        endMessage = "Your stress level has exceeded the safe limit. Game over.";
    }

    logEvent(endMessage);

    // Display a "Restart Game" button
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.addEventListener("click", restartGame);
    choiceButtonsDiv.appendChild(restartButton);

    // Optionally, disable further updates to the sidebar
    document.getElementById("sidebar").innerHTML = `
        <p><strong>Final Stress Level:</strong> ${gameState.stress}</p>
        <p><strong>Game Over:</strong> ${endMessage}</p>
        <p>Click 'Restart Game' to try again.</p>
    `;
}

// Restart the game
function restartGame() {
    gameState = {
        stress: 0,
        brainPower: 30,
        gpa: 3.0,
        social: 10,
        gradeLevel: 9,
        isInClub: false,
        isInRelationship: false,
        studentGov: false,
        leadershipExperience: 0,
        extracurriculars: 0,
        semester: 1,
        choiceTime: 1,
        clubPresident: false,
        previousStress: 0,
        gameOver: false,
        triggeredPassiveEvents: [],
        arguedWithTeacher: false,
    };
    document.getElementById("log-content").innerHTML = ""; // Clear full log
    document.getElementById("latest-log").innerHTML = ""; // Clear latest log
    logEvent(`Welcome to Grade ${gameState.gradeLevel}, Semester ${gameState.semester}!`);
    startSemester();
}


// Simplified GPA calculation 
function calculateGPA() {
    const stressThreshold = 65; // Determines course count
    const courses = (gameState.gradeLevel <= 10 || gameState.previousStress < stressThreshold) ? 7 : 6;

    // Adjust the minimum percentage based on brain power
    const minPercentage = Math.min(100, 27 + Math.floor((gameState.brainPower-15) / 2));
    const maxPercentage = 100;

    const coursePercentages = Array.from({ length: courses }, () => Math.floor(Math.random() * (maxPercentage - minPercentage + 1) + minPercentage));

    // Apply a 5% reduction to the third course
    if (gameState.arguedWithTeacher) {
        coursePercentages[2] = Math.max(0, coursePercentages[2] - 5);
    }

    // Map percentages to letter grades
    const gradeScale = [
        { min: 0, max: 35, grade: "F", gpa: 0.0 },
        { min: 35, max: 40, grade: "D", gpa: 1.0 },
        { min: 40, max: 45, grade: "D+", gpa: 1.5 },
        { min: 45, max: 50, grade: "C", gpa: 2.0 },
        { min: 50, max: 60, grade: "C+", gpa: 2.5 },
        { min: 60, max: 65, grade: "B", gpa: 3.0 },
        { min: 65, max: 70, grade: "B+", gpa: 3.5 },
        { min: 70, max: 85, grade: "A", gpa: 4.0 },
        { min: 85, max: 101, grade: "A+", gpa: 4.5 },
    ];

    // Convert percentages to grades
    gameState.courseGrades = coursePercentages.map(percent => {
        const gradeInfo = gradeScale.find(scale => percent >= scale.min && percent <= scale.max);
        return gradeInfo ? gradeInfo.grade : "C+";
    });

    const totalPercentage = coursePercentages.reduce((sum, percent) => sum + percent, 0);
    const averagePercentage = totalPercentage / courses;
    const averageGradeInfo = gradeScale.find(scale => averagePercentage >= scale.min && averagePercentage <= scale.max);
    if (averageGradeInfo) {
        gameState.gpa = averageGradeInfo.gpa;
    } else {
        console.error("Average percentage out of bounds:", averagePercentage);
        gameState.gpa = 3.05;
    }

    // Add a small random variation to the GPA
    const variation = (Math.random() * 0.09) + 0.01; // Random value between 0.01 and 0.1
    gameState.gpa = Math.min(5, gameState.gpa + variation);

    logEvent(`Your GPA for Grade ${gameState.gradeLevel} Semester ${gameState.semester} is now ${gameState.gpa.toFixed(2)}.`);
    logEvent(`Your course grades for this semester: ${gameState.courseGrades.join(', ')}`);
}

// Apply rest period to reduce stress and restore BP
function applyRestPeriod() {
    gameState.stress = Math.max(0, gameState.stress - 5);
    logEvent("Holiday between semesters! Stress -5."); 
}

export function checkStressLimit() {
    if (gameState.stress >= 100 && !gameState.gameOver) {
        gameState.gameOver = true; // Prevent further interactions
        logEvent("Your stress level has exceeded the safe limit. Game over.");
        endGame();
        return; 
    }
}

// Update the sidebar with current game state
function updateSidebar() {
    const sidebar = document.getElementById("sidebar");

    // Set the sidebar content with the appropriate stress level
    sidebar.innerHTML = `
        <h3>Current Game State</h3>
        <p class="grade-level"><strong>Grade Level:</strong> ${gameState.gradeLevel}</p>
        <p class="semester"><strong>Semester:</strong> ${gameState.semester}</p>
        <p class="stress"><strong>Stress:</strong> ${gameState.stress}</p>
        <p><strong>Brain Power:</strong> ${gameState.brainPower}</p>
        <p><strong>GPA:</strong> ${gameState.gpa.toFixed(2)}</p>
        <p><strong>Social:</strong> ${gameState.social}</p>
        <p><strong>In Club:</strong> ${gameState.isInClub ? 'Yes' : 'No'}</p>
        <p><strong>In Relationship:</strong> ${gameState.isInRelationship ? 'Yes' : 'No'}</p>
        <p><strong>Leadership Experience:</strong> ${gameState.leadershipExperience}</p>
        <p><strong>Club President:</strong> ${gameState.clubPresident ? 'Yes' : 'No'}</p>
        <p><strong>Student Government:</strong> ${gameState.studentGov ? 'Yes' : 'No'}</p>
    `;
}

// Add a new log entry to the game log
function logEvent(message) {
    const logDiv = document.getElementById('log-content');
    const logEntry = document.createElement("p");
    logEntry.textContent = message;
    logDiv.appendChild(logEntry);

    // Update the latest log entry
    const latestLogDiv = document.getElementById('latest-log');
    latestLogDiv.innerHTML = `<p>${message}</p>`;

    if (logDiv.children.length > 10) {
        logDiv.removeChild(logDiv.firstChild);
    }
}
/* all major functions 
displayEventChoices()
minValues()
handleEventChoice(event)
proceedToNextChoice()
endGame()
updateSidebar()
logEvent(message)
applyRestPeriod()
calculateGPA()
checkStressLimit()
applyDefaultActions(eventName, choiceTime)
handlePassiveEvent()
showPassiveEventButton()
getChoiceTimeOptions(choiceTime)
filterEvents(eventsList, choiceTime)
displayClubChoices()
*/

// Initialize the game on page load
window.onload = startSemester;


document.addEventListener("DOMContentLoaded", () => {
    const toggleLogButton = document.getElementById("toggle-log-button");
    const logContent = document.getElementById("log-content");

    toggleLogButton.addEventListener("click", () => {
        logContent.classList.toggle("hidden");
        toggleLogButton.textContent = logContent.classList.contains("hidden") ? "Show Full Log" : "Hide Full Log";
    });

    const rulesModal = document.getElementById("rulesModal");
    const rulesButton = document.getElementById("rulesButton");
    const closeButton = document.querySelector(".close-button");

    // Show modal initially
    rulesModal.classList.add("visible");

    // Hide modal on close button click
    closeButton.addEventListener("click", () => {
        rulesModal.classList.remove("visible");
    });

    // Allow re-access via the rules button
    rulesButton.addEventListener("click", () => {
        rulesModal.classList.add("visible");
    });

    // Hide modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target === rulesModal) {
            rulesModal.classList.remove("visible");
        }
    });
});