

import { activeEvents, triggerPassiveEvent, passiveEvents } from './events.js';

// Initial game state
let gameState = {
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
    previousStress: 10,
    gameOver: false,
    triggeredPassiveEvents: [],
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

    // Create buttons for active events
    choiceOptions.forEach(event => {
        if (!event || !event.name) return;
        const button = document.createElement("button");
        button.textContent = `${event.name}: ${event.description}`;

        // Add appropriate class based on event type
        if (["Very hard work", "Normal effort", "Slacking"].includes(event.name)) {
            button.classList.add("hardwork");
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
            showPassiveEventButton();
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
    return filterEvents(activeEvents, choiceTime).slice(0, 4);
    
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

    return true;
}

// Handle event choice and progress
function handleEventChoice(event) {
    if (gameState.gameOver) return;
    
    const result = event.consequence(gameState);
    if (result) logEvent(result);

    applyDefaultActions(event.name, gameState.choiceTime);

    const choiceButtonsDiv = document.getElementById("choice-buttons");
    choiceButtonsDiv.innerHTML = "";  // Clear active choices
    showPassiveEventButton();

    updateSidebar();
}

// Apply a default action
function applyDefaultActions(eventName, choiceTime) {
    const defaultActions = {
        1: { name: "Normal effort", stressImpact: 5, brainPowerImpact: 5 },
        5: { name: "Normal Revision", stressImpact: 5, brainPowerImpact: 5 }
    };

    const defaultAction = defaultActions[choiceTime];
    if (defaultAction && !["Very hard work", "Normal effort", "Slacking", "All Night Revision", "Normal Revision", "Give Up"].includes(eventName)) {
        applyDefaultAction(defaultAction.name, defaultAction.stressImpact, defaultAction.brainPowerImpact);
    }
}

// Trigger and log passive event
function handlePassiveEvent() {
    const result = triggerPassiveEvent(gameState);
    clampGameStateValues();
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
    clampGameStateValues();
    checkStressLimit();

    if (gameState.choiceTime < 4) {
        // Increment choiceTime within the same semester
        gameState.choiceTime++;
    } else {
        // End of choices for the semester; calculate GPA and apply rest period
        calculateGPA();
        applyRestPeriod();  // This should happen only at the end of a semester

        // Reset choiceTime and handle semester advancement
        gameState.choiceTime = 1;

        if (gameState.semester === 1) {
            // Move to the second semester within the same grade
            gameState.semester = 2;
        } else {
            // End of the school year; reset to first semester and increase grade level
            gameState.semester = 1;
            gameState.previousStress = gameState.stress;
            gameState.gradeLevel++;

            // Check if the player has completed all grades
            if (gameState.gradeLevel > 12) {
                endGame();
                return;
            }
        }
    }

    // Update choices and sidebar for the new round or semester
    displayEventChoices();
    updateSidebar();
}

// End the game
function endGame() {
    const choiceButtonsDiv = document.getElementById("choice-buttons");
    choiceButtonsDiv.innerHTML = ""; // Clear all choice buttons
    
    if (gameState.gradeLevel === 12) {
        logEvent("Graduation!");
    }    

    // Display a "Restart Game" button
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.addEventListener("click", restartGame);
    choiceButtonsDiv.appendChild(restartButton);
    
    // Optionally, disable further updates to the sidebar
    document.getElementById("sidebar").innerHTML = `
        <p><strong>Final Stress Level:</strong> ${gameState.stress}</p>
        <p><strong>Game Over:</strong> Stress limit exceeded.</p>
        <p>Click below to restart.</p>
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
        previousStress: 10,
    };
    document.getElementById("log-content").innerHTML = "";
    startSemester();
}

// Simplified GPA calculation with better documentation
function calculateGPA() {
    const baseBrainPower = 35; // C+ baseline
    const stressThreshold = 65; // Determines course count
    const courses = (gameState.gradeLevel <= 10 || gameState.previousStress < stressThreshold) ? 7 : 6;
    
    const gradeAdjustment = Math.floor((gameState.brainPower - baseBrainPower) / 4);
    const gradeScale = [
        { grade: "F", gpa: 0.0 },
        { grade: "D", gpa: 1.0 },
        { grade: "D+", gpa: 1.5 },
        { grade: "C", gpa: 2.0 },
        { grade: "C+", gpa: 2.5 },
        { grade: "B", gpa: 3.2 },
        { grade: "B+", gpa: 3.6 },
        { grade: "A", gpa: 4.2 },
        { grade: "A+", gpa: 4.6 },
    ];

    let baselineIndex = 4; // Corresponds to C+
    const gradePoints = Array.from({ length: courses }, () => {
        const adjustedIndex = Math.max(0, Math.min(8, baselineIndex + gradeAdjustment + (Math.floor(Math.random() * 3) - 1)));
        return gradeScale[adjustedIndex].gpa;
    });

    gameState.gpa = gradePoints.reduce((sum, gpa) => sum + gpa, 0) / courses;
    logEvent(`Your GPA for Grade ${gameState.gradeLevel} Semester ${gameState.semester} is now ${gameState.gpa.toFixed(2)}.`);
}

// Apply rest period to reduce stress and restore BP
function applyRestPeriod() {
    gameState.stress = Math.max(0, gameState.stress - 5);
    logEvent("Holiday between semesters! Stress -5.");
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function clampGameStateValues() {
    gameState.stress = clamp(gameState.stress, 0, 100);
    gameState.social = clamp(gameState.social, 0, 100);
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
        <p><strong>Brain Power:</strong> ${gameState.brainPower}</p>
        <p><strong>GPA:</strong> ${gameState.gpa.toFixed(2)}</p>
        <p><strong>Social:</strong> ${gameState.social}</p>
        <p><strong>In Club:</strong> ${gameState.isInClub ? 'Yes' : 'No'}</p>
        <p><strong>In Relationship:</strong> ${gameState.isInRelationship ? 'Yes' : 'No'}</p>
        <p><strong>Leadership Experience:</strong> ${gameState.leadershipExperience}</p>
        <p><strong>Extracurriculars:</strong> ${gameState.extracurriculars}</p>
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

document.addEventListener("DOMContentLoaded", () => {
    const toggleLogButton = document.getElementById("toggle-log-button");
    const logContent = document.getElementById("log-content");

    toggleLogButton.addEventListener("click", () => {
        logContent.classList.toggle("hidden");
        toggleLogButton.textContent = logContent.classList.contains("hidden") ? "Show Full Log" : "Hide Full Log";
    });
});


// Initialize the game on page load
window.onload = startSemester;

document.addEventListener("DOMContentLoaded", () => {
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
