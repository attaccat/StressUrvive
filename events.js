// events.js
import {checkStressLimit} from './script.js';

// Event pools for different phases of the game
export const activeEvents = [
    {
        name: "Very hard work",
        description: "Work very hard this semester.",
        consequence: function(gameState) {
            gameState.stress += 14;
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
            gameState.stress += 9;
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
            gameState.stress += 3;
            gameState.brainPower -= 4;
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
            checkStressLimit();
            return "Choose a club to join: ";
        },
        choiceTime: 2
    },
        {
            name: "Service Club",
            description: "Clubs commited to making the world better by volunteering in the community.",
            consequence: function(gameState) {
                gameState.extracurriculars += 10;
                gameState.isInClub = true;
                gameState.social += 10;
                checkStressLimit();
                return "You joined a Service Club!";
            },
        },
        {
            name: "General Club",
            description: "Clubs with members interested in various activities.",
            consequence: function(gameState) {
                gameState.extracurriculars += 5;
                gameState.isInClub = true;
                gameState.social += 5;
                checkStressLimit();
                return "You joined a General Club!";
            },
        },
        {
            name: "Academic Club",
            description: "Clubs focused on academic excellence.",
            consequence: function(gameState) {
                gameState.brainPower += 10;
                gameState.isInClub = true;
                gameState.social += 5;
                checkStressLimit();
                return "You joined an Academic Club!";}
        },
        {
            name: "Competitional Club",
            description: "Clubs focused on particpating professional competitions.",
            consequence: function(gameState) {
                gameState.brainPower += 10;
                gameState.extracurriculars += 8;
                gameState.isInClub = true;
                gameState.social += 5;
                checkStressLimit();
                return "You joined a Competitional Club!";
            },
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
            gameState.stress += 5;
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
        gradeLevelOnly: [10, 11],
        requiresClubMembership: true, 
        requiresPresident: false
    },
    {
        name: "Stay as Club President",
        description: "Stay in the club and commit to your presidency. ",
        consequence: function(gameState) {
            gameState.stress += 3;
            gameState.leadershipExperience += 1;
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
            if(gameState.social >= 35){
                gameState.leadershipExperience += 1;
                gameState.stress += 10;
                gameState.social +=20;
                checkStressLimit();
                return "You joined student government!";
            } 
            checkStressLimit();
            return "You ran but didn't get elected.";
        },
        choiceTime: 3,
        semesterOnly: 1,
        gradeLevelOnly: [9, 10, 11],
    },
    {
        name: "Attend Extra Tutoring",
        description: "Get some extra help with your subjects.",
        consequence: function(gameState) {
            gameState.brainPower += 10;
            gameState.stress += 4;
            checkStressLimit();
            return "You learned a lot from the tutoring, but it was exhausting!";
        },
        choiceTime: 3,
    },
    {
        name: "Skip a Class",
        description: "Take a break and skip a class.",
        consequence: function(gameState) {
            gameState.stress -= 3;
            checkStressLimit();
            return "You feel relaxed, but your teacher wasn't that happy!";
        },
        choiceTime: 3,
    },
    {
        name: "Tryout for varsity / junior varsity",
        description: "Sign up for a sport and start training.",
        consequence: function(gameState) {
            gameState.social += 8;
            checkStressLimit();
            if(gameState.stress <= 70){
                gameState.stress += 8;
                return "You got into the team! Start preparing for exchange and IASIS. "
            }
            return "You tried but didn't get in. Try again next year! ";
        },
        choiceTime: [2],
    },
    {
        name: "All Night Revision",
        description: "Pull all-nighters for the end-of-semester exams.",
        consequence: function(gameState) {
            gameState.stress += 12;
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
            gameState.stress += 8;
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
            gameState.stress += 4;
            gameState.brainPower -= 5;
            checkStressLimit();
            return "You decided to take a chance on fate!";
        },
        choiceTime: 4
    },
    { 
        name: "Date someone",
        description: "Start a romantic relationship",
        consequence: function(gameState) {
            gameState.brainPower -= 1;
            gameState.stress -= 1;
            gameState.isInRelationship = true;
            checkStressLimit();
            return "You are no longer single. ";
        },
        choiceTime: [2, 3, 4],
        forbidRelationship: true
    },
    {
        name: "Fight someone",
        description: "Provoke a person and get into a fight",
        consequence: function(gameState) {
            if(gameState.social >= 20){
                gameState.stress -= 2;
                checkStressLimit();
                return "You won the fight! ";
            }
            else{
                gameState.social -= 1;
                gameState.stress += 1;
                checkStressLimit();
                return "You lost the fight! ";
            }
        },
        choiceTime: [1, 2, 3, 4]
    },
    {
        name: "Start a New Club",
        description: "Establish a new club.",
        consequence: function(gameState) {
            gameState.social += 10;
            checkStressLimit();
            return "You started a new club!"
        },
        semesterOnly: 2,
        gradeLevelOnly: [9, 10, 11],
        choiceTime: [3],
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
            if (gameState.gpa > 4.15 && (gameState.brainPower >= 95 || gameState.extracurriculars >= 40) && gameState.leadershipExperience >= 1.5) {
                return "You were accepted for early admission! 🎉";
            } else {
                return "You didn't receive any news back from early admission.";
            }
        },
        gradeLevelOnly: 12,
        choiceTime: 3,
        semesterOnly: 1
    },
    {
        name: "Regular Application",
        description: "Apply to universities.",
        consequence: function(gameState) {
            if (gameState.gpa > 3.5 && gameState.brainPower >= 75 && (gameState.extracurriculars >= 20 || gameState.leadershipExperience >= 0.5)) {
                return "You were accepted for normal admission! 😆";
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
        description: "Apply to universities again",
        consequence: function(gameState) {
            if (gameState.gpa > 3.0 && (gameState.brainPower >= 55 || gameState.extracurriculars >= 10)) {
                return "You were accepted for last-chance admission! ";
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
    let availableEvents = passiveEvents.filter(event => {
        // Check if the event is a limited event and has already been triggered
        if (limitedEvents.includes(event.name) && gameState.triggeredPassiveEvents.includes(event.name)) {
            return false;
        }
        // Check if the event requires a relationship and if the player is in one
        if (event.requiresRelationship && !gameState.isInRelationship) {
            return false;
        }
        return true;
    });

    if (availableEvents.length === 0) {
        console.warn("No more passive events available.");
        return null;
    }

    let randomIndex = Math.floor(Math.random() * availableEvents.length);
    let event = availableEvents[randomIndex];

    if (event) {
        const consequenceMessage = event.consequence(gameState);
        // Mark event as triggered if it's a limited event
        if (limitedEvents.includes(event.name)) {
            gameState.triggeredPassiveEvents.push(event.name);
        }
        return { 
            event, 
            consequenceMessage: `${event.description} - ${consequenceMessage}` 
        };
    } else {
        console.warn("Undefined event selected at index:", randomIndex);
        return null;
    }
}

// Passive events
const limitedEvents = ["Bullying", "Rumors", "Hidden Genius", "Exam Cancelled", "Friendship Crisis"];

export const passiveEvents = [
    {
        name: "Provoked",
        description: "Someone provoked you for a fight.",
        consequence: function(gameState) {
            gameState.stress += 2;
            if (gameState.social >= 20) {
                gameState.brainPower += 1;
                checkStressLimit();
                return "You handled the provocation well. ";
            } else {
                gameState.social -= 1;
                checkStressLimit();
                return "You had a fight and lost. ";
            }
        }
    },
    {
        name: "Dumped",
        description: "You were dumped.",
        consequence: function(gameState) {
            gameState.social -= 1;
            gameState.brainPower += 1;
            gameState.isInRelationship = false;
            checkStressLimit();
            return "You felt sad, but you were able to overcome it. ";
        },
        requiresRelationship: true
    },
    {
        name: "Friendship Crisis",
        description: "You lost a close friend. ",
        consequence: function(gameState) {
            gameState.social -= 1;
            checkStressLimit();
            return "Your best friend left you. You didn't know what you've done wrong. "
        }
    },
    {
        name: "Bullying",
        description: "Someone is trying to bully you. ",
        consequence: function(gameState) {
            if(gameState.social < 20){
                gameState.stress += 5;
                gameState.brainPower -= 2;
                checkStressLimit();
                return "You feel pain and cannot focus during class. "
            }
            gameState.stress += 2;
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
            gameState.stress -= 5;
            checkStressLimit();
            return "You felt relieved. ";
        }
    },
    {
        name: "Rumors",
        description: "Someone spread a rumor about you",
        consequence: function(gameState) {
            gameState.stress += 5;
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
            gameState.stress -= 8;
            if(gameState.brainPower >= 88){
                gameState.brainPower += 3;
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
        description: "You found a teacher annoying.",
        consequence: function(gameState) {
            gameState.stress -= 10;
            gameState.arguedWithTeacher = true;
            checkStressLimit();
            return "You argued. It felt great, but your gpa might not feel so great. "
        }
    },
    {
        name: "Unexpected Quiz",
        description: "A surprise quiz caught you off guard.",
        consequence: function(gameState) {
            gameState.stress += 2;
            gameState.brainPower += 1;
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