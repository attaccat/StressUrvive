// events.js
import {checkStressLimit} from './script.js';

// Event pools for different phases of the game
export const activeEvents = [
    {
        name: "Very hard work",
        description: "Work very hard this semester.",
        consequence: function(gameState) {
            gameState.stress += 15;
            gameState.brainPower += 5;
            checkStressLimit();
            return "You studied very hard! ";
        },
        choiceTime: 1 // Available in the first choice slot of each semester
    },
    {
        name: "Normal effort",
        description: "Put in normal effort this semester.",
        consequence: function(gameState) {
            gameState.stress += 8;
            gameState.brainPower += 3;
            checkStressLimit();
            return "You put in normal effort! ";
        },
        choiceTime: 1
    },
    {
        name: "Slacking",
        description: "Slack off this semester.",
        consequence: function(gameState) {
            gameState.stress += 4;
            gameState.brainPower -= 10;
            checkStressLimit();
            return "You slacked off!";
        },
        choiceTime: 1
    },
    {
        name: "Join clubs",
        description: "Participate in several clubs.",
        consequence: function(gameState) {
            gameState.social += 10;
            gameState.isInClub = true;
            checkStressLimit();
            return "You joined clubs! ";
        },
        choiceTime: 2
    },
    {
        name: "Join no clubs",
        description: "You decide not to join any club for now.",
        consequence: function(gameState) {
            gameState.isInClub = false;
            checkStressLimit();
            return "You chose not to participate in any club activities for this semester.";
        },
        choiceTime: 2
    },
    {
        name: "Run for Club President",
        description: "Elect to become the president of the club.",
        consequence: function(gameState) {
            gameState.stress += 6;
            if(gameState.social >= 20){
                gameState.clubPresident = true;
                gameState.leadershipExperience += 1;
                checkStressLimit();
                return "You are now the club president!" ;
            }
            checkStressLimit();
            return "Not enough people voted you as the club president. "
        },
        choiceTime: 2,
        semesterOnly: 2,
        gradeLevelOnly: [9, 10, 11],
        requiresClubMembership: true, // New property to signify it needs club membership
        requiresPresident: false
    },
    {
        name: "Stay as Club President",
        description: "Stay in the club and commit to your presidency. ",
        consequence: function(gameState) {
            gameState.stress += 4;
            checkStressLimit();
            return "You are still the club president!";
        },
        choiceTime: 2,
        semesterOnly: 2,
        gradeLevelOnly: [10, 11],
        requiresClubMembership : true,
        requiresPresident: true
    },
    {
        name: "Student Government",
        description: "Run for student government.",
        consequence: function(gameState) {
            gameState.stress += 10;
            if(gameState.social >= 35){
                gameState.leadershipExperience += 1;
                gameState.social +=20;
                checkStressLimit();
                return "You joined student government!";
            } 
            checkStressLimit();
            return "You ran but didn't get elected.";
        },
        choiceTime: 3,
        semesterOnly: 1,
        gradeLevelOnly: [9, 10, 11]
    },
    {
        name: "Attend Extra Tutoring",
        description: "Get some extra help with your subjects.",
        consequence: function(gameState) {
            gameState.brainPower += 10;
            gameState.stress += 2;
            checkStressLimit();
            return "You learned a lot, but it was exhausting!";
        },
        choiceTime: 3,
    },
    {
        name: "Skip a Class",
        description: "Take a break and skip a class.",
        consequence: function(gameState) {
            gameState.stress -= 5;
            gameState.gpa -= 0.1;
            checkStressLimit();
            return "You feel relaxed, but your teacher wasn't happy!";
        },
        choiceTime: 3,
    },
    {
        name: "Tryout for varsity",
        description: "Sign up for a sport and start training.",
        consequence: function(gameState) {
            gameState.social += 8;
            checkStressLimit();
            if(gameState.stress < 70){
                gameState.stress += 4;
                return "You got into the varsity team! Start preparing for IASIS. "
            }
            return "You tried but didn't get in. Try again next year! ";
        },
        choiceTime: 3,
    },
    {
        name: "All Night Revision",
        description: "Pull all-nighters for the end-of-semester exams.",
        consequence: function(gameState) {
            gameState.stress += 15;
            gameState.brainPower += 5;
            checkStressLimit();
            return "You worked very hard! ";
        },
        choiceTime: 4
    },
    {
        name: "Normal Revision",
        description: "Plan ahead and revise regularly.",
        consequence: function(gameState) {
            gameState.stress += 10;
            gameState.brainPower += 3;
            checkStressLimit();
            return "You put in normal effort! ";
        },
        choiceTime: 4
    },
    {
        name: "Give Up",
        description: "Give up on revision for this semester's exams.",
        consequence: function(gameState) {
            gameState.stress += 5;
            gameState.brainPower -= 15;
            checkStressLimit();
            return "You decided to take a chance on fate!";
        },
        choiceTime: 4
    },
    { 
        name: "Date someone",
        description: "Start a romantic relationship",
        consequence: function(gameState) {
            gameState.brainPower -= 10;
            gameState.isInRelationship = true;
            checkStressLimit();
            return "You are no longer single. ";
        },
        choiceTime: [1, 2, 3, 4],
        forbidRelationship: true
    },
    {
        name: "Fight someone",
        description: "Provoke a person and get into a fight",
        consequence: function(gameState) {
            if(gameState.social >= 20){
                gameState.stress -= 5;
                checkStressLimit();
                return "You won the fight! ";
            }
            else{
                gameState.social -= 2;
                gameState.stress += 2;
                checkStressLimit();
                return "You lost the fight! ";
            }
        },
        choiceTime: [1, 2, 3]
    },
    {
        name: "Break up",
        description: "You feel you are not suitable for each other",
        consequence: function(gameState) {
            if (gameState.isInRelationship) {
                gameState.isInRelationship = false;
                gameState.stress += 2;
                gameState.social -= 1;
                checkStressLimit();
                return "You broke up. You are kinda sad but also happy... ";}
        },
        choiceTime: [1, 2, 3, 4],
        requiresRelationship: true
    },
    {
        name: "Early Application",
        description: "Apply for early admission.",
        consequence: function(gameState) {
            if (gameState.gpa > 4.15 && (gameState.brainPower > 95 || gameState.extracurriculars > 50) && gameState.leadershipExperience >= 2) {
                return "You were accepted for early admission!";
            } else {
                return "You didn't receive any news back from early admission.";
            }
        },
        gradeLevelOnly: 12,
        choiceTime: 3,
        semesterOnly: 1
    },
    {
        name: "Normal Application",
        description: "You applied to universities normally.",
        consequence: function(gameState) {
            if (gameState.gpa > 3.5 && (gameState.brainPower > 75 || gameState.extracurriculars > 30) && gameState.leadershipExperience >= 0.5) {
                return "You were accepted for normal admission!";
            } else {
                return "You didn't receive any news back from your applications.";
            }
        },
        gradeLevelOnly: 12,
        choiceTime: [2,3],
        semesterOnly: 2
    },
    {
        name: "Last Chance Application",
        description: "You applied for last-chance admission.",
        consequence: function(gameState) {
            if (gameState.gpa > 3.0 && (gameState.brainPower > 55 || gameState.extracurriculars > 20)) {
                return "You were accepted for last-chance admission!";
            } else {
                return "You were rejected for last-chance admission...";
            }
        },
        gradeLevelOnly: 12,
        choiceTime: 4,
        semesterOnly: 2
    }
];

// triggerPassiveEvent() 
export function triggerPassiveEvent(gameState) {
    if (Math.random() < 0.9) { // 90% chance of passive event
        let randomIndex = Math.floor(Math.random() * passiveEvents.length);
        let event = passiveEvents[randomIndex];
        
        if (event) {
            const consequenceMessage = event.consequence(gameState);
            return { 
                event, 
                consequenceMessage: `${event.description} - ${consequenceMessage}` 
            };  // Include name and description in message
        } else {
            console.warn("Undefined event selected at index:", randomIndex);
            return null;
        }
    }
    console.log("No passive event triggered this time.");
    return null;
}


// Passive events
export const passiveEvents = [
    {
        name: "Provoked",
        description: "Someone provoked you for a fight.",
        consequence: function(gameState) {
            gameState.stress += 3;
            if (gameState.social > 20) {
                gameState.brainPower += 1;
                checkStressLimit();
                return "You handled the provocation well. ";
            } else {
                gameState.social -= 2;
                checkStressLimit();
                return "You had a fight and lost. ";
            }
        }
    },
    {
        name: "Dumped",
        description: "You broke up",
        consequence: function(gameState) {
            gameState.social -= 1;
            gameState.brainPower += 2;
            checkStressLimit();
            return "You were dumped. You felt sad, but you were able to overcome it. ";
        },
        requiresRelationship: true
    },
    {
        name: "Bankruptcy",
        description: "Your family is bankrupt... But you can still finish high school. ",
        consequence: function(gameState) {
            gameState.stress += 10;
            checkStressLimit();
            return "You decided to work harder";
        }
    },
    {
        name: "Friendship Crisis",
        description: "You lost a close friend. ",
        consequence: function(gameState) {
            gameState.social -= 3;
            checkStressLimit();
            return "Your best friend left you. You didn't know what you've done wrong. "
        }
    },
    {
        name: "Bullying",
        description: "Someone is trying to bully you. ",
        consequence: function(gameState) {
            if(gameState.social < 20){
                gameState.stress += 7;
                gameState.brainPower -= 2;
                checkStressLimit();
                return "You feel pain and cannot focus during class. "
            }
            return "You were almost bullied but your friends rescued you. "
        }
    },
    {
        name: "Missing Homework",
        description: "You forgot to do your homework! ",
        consequence: function(gameState) {
            gameState.stress += 2;
            gameState.brainPower -= 1;
            checkStressLimit();
            return "You are worried. ";
        }
    },
    {
        name: "Exam Cancelled",
        description: "Your summative test was cancelled! Yay! ",
        consequence: function(gameState) {
            gameState.stress -= 10;
            checkStressLimit();
            return "You felt relieved. ";
        }
    },
    {
        name: "Rumors",
        description: "Someone spread a rumor about you",
        consequence: function(gameState) {
            gameState.stress += 3;
            gameState.social -=3;
            if (gameState.social < 20) {
                gameState.social -= 3;
            }
            checkStressLimit();
            return "You felt everyone is looking at you weirdly. "
        }
    },
    {
        name: "Hidden Genius",
        description: "You unlocked your hidden brain",
        consequence: function(gameState) {
            gameState.stress -= 10;
            if(gameState.brainPower >= 88){
                gameState.brainPower += 4;
            }
            else{
                gameState.brainPower += 6;
            }
            checkStressLimit();
            return "You feel smarter now. "
        }
    },
    {
        name: "Argue with Teacher",
        description: "You found a teacher annoying and you had an argue",
        consequence: function(gameState) {
            gameState.stress -= 15;
            gameState.gpa -= 1.0;
            checkStressLimit();
            return "It felt great, but your gpa might not feel so great. "
        }
    },
    {
        name: "Unexpected Quiz",
        description: "A surprise quiz caught you off guard.",
        consequence: function(gameState) {
            gameState.stress += 3;
            gameState.brainPower += 2;
            checkStressLimit();
            return "You managed to scrape through the quiz.";
        }
    },
    {
        name: "Motivational Speech",
        description: "A guest speaker inspired you to work harder.",
        consequence: function(gameState) {
            gameState.stress -= 3;
            checkStressLimit();
            return "You feel rejuvenated and ready to tackle new challenges.";
        }
    },
];