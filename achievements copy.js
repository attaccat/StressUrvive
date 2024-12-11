// achievements.js

// Define the structure for an achievement
export const achievements = [
    // stress section 1-10
    {
        id: 1,
        name: "Ouroboro",
        description: "End game in first year by reaching the stress limit.",
        condition: (gameState) => gameState.stress >= 100 || gameState.gradeLevel < 10,
        unlocked: false,
    },
    {
        id: 2,
        name: "One Step to the Crown",
        description: "Reach stress limit in Grade 12 before graduation.",
        condition: (gameState) => gameState.stress >= 100 && gameState.gradeLevel === 12,
        unlocked: false,
    },
    {
        id: 3,
        name: "Ice Walker",
        description: "Graduate with stress level above 90",
        condition: (gameState) => gameState.stress >= 90 && gameState.stress < 100,
        unlocked: false,
    },
    {
        id: 4,
        name: "ZEN",
        description: "Graduate with stress level below 20",
        condition: (gameState) => gameState.stress <= 20,
        unlocked: false,
    },
    {
        id: 5,
        name: "The Controller",
        description: "Graduate with a stress level below 30",
        condition: (gameState) => gameState.stress > 20 && gameState.stress <=30,
        unlocked: false,
    },
    {
        id: 5,
        name: "The Planner",
        description: "Graduate with a stress level below 40",
        condition: (gameState) => gameState.stress > 30 && gameState.stress <=40,
        unlocked: false,
    },
    {
        id: 6,
        name: "The Calculator",
        description: "Graduate with a stress level below 50",
        condition: (gameState) => gameState.stress > 40 && gameState.stress <= 50,
        unlocked: false,
    },
    {
        id: 7,
        name: "The Manager",
        description: "Graduate with a stress level below 60",
        condition: (gameState) => gameState.stress > 50 && gameState.stress <= 60,
        unlocked: false,
    },
    {
        id: 8,
        name: "The Robot",
        description: "Graduate with a stress level below 70",
        condition: (gameState) => gameState.stress > 60 && gameState.stress <= 70,
        unlocked: false,
    },
    {
        id: 9,
        name: "Corridor Runner",
        description: "Graduate with a stress level below 80",
        condition: (gameState) => gameState.stress > 70 && gameState.stress <= 80,
        unlocked: false,
    },
    {
        id: 10,
        name: "Anxiously Relaxed",
        description: "Graduate with a stress level below 90",
        condition: (gameState) => gameState.stress > 80 && gameState.stress <= 90,
        unlocked: false,
    },
    
    // social section 11-18
    {
        id: 11,
        name: "Who's that",
        description: "Graduate with social level below 5",
        condition: (gameState) => gameState.social <= 5,
        unlocked: false,
    },
    {
        id: 12,
        name: "Lone Wolf",
        description: "Graduate with social level below 15",
        condition: (gameState) => gameState.social > 5 && gameState.social <= 15,
        unlocked: false,
    },
    {
        id: 13,
        name: "Loyal to the Group",
        description: "Graduate with social level below 30",
        condition: (gameState) => gameState.social > 15 && gameState.social <= 30,
        unlocked: false,
    },
    {
        id: 14,
        name: "Butterfly",
        description: "Graduate with social level above 30",
        condition: (gameState) => gameState.social > 30 && gameState.social <= 50,
        unlocked: false,
    },
    {
        id: 15,
        name: "Spotlight",
        description: "Graduate with social level above 50",
        condition: (gameState) => gameState.social >= 50,
        unlocked: false,
    },
    {
        id: 16,
        name: "Blooming Youth",
        description: "Graduate having a girlfriend/boyfriend",
        condition: (gameState) => gameState.isInRelationship,
        unlocked: false,
    },
    {
        id: 17,
        name: "Heartbreaker",
        description: "Broke someone's heart",
        condition: (gameState) => gameState.triggeredActiveEvents.includes("Break Up"),
        unlocked: false,
    },
    {
        id: 18,
        name: "Heartbroken",
        description: "Dumped by someone",
        condition: (gameState) => gameState.triggeredPassiveEvents.includes("Dumped"),
        unlocked: false,
    },
    // brain power section 19-24
    {
        id: 19,
        name: "Elbert Ainstein",
        description: "Graduate with a brain power > 100",
        condition: (gameState) => gameState.brainPower > 100,
        unlocked: false,
    },
    {
        id: 20,
        name: "Professional Thinker",
        description: "Graduate with a brain power > 90",
        condition: (gameState) => gameState.brainPower <= 100 && gameState.brainPower >= 90,
        unlocked: false,
    },
    {
        id: 21,
        name: "Academic",
        description: "Graduate with a brain power > 80",
        condition: (gameState) => gameState.brainPower < 90 && gameState.brainPower >= 80,
        unlocked: false,
    },
    {
        id: 22,
        name: "Book Collector",
        description: "Graduate with a brain power > 70",
        condition: (gameState) => gameState.brainPower < 80 && gameState.brainPower >= 70,
        unlocked: false,
    },
    {
        id: 23,
        name: "Grinder",
        description: "Graduate with a brain power > 60",
        condition: (gameState) => gameState.brainPower < 70 && gameState.brainPower >= 60,
        unlocked: false,
    },
    {
        id: 24,
        name: "Somewhat Smart",
        description: "Graduate with a brain power > 50",
        condition: (gameState) => gameState.brainPower < 60 && gameState.brainPower >= 50,
        unlocked: false,
    },

    // leadership section 25-28
    {
        id: 25,
        name: "Born to Lead",
        description: "Graduate with leadership experience of 4",
        condition: (gameState) => gameState.leadershipExperience >= 4,
        unlocked: false,
    },
    {
        id: 26,
        name: "Best Group Member",
        description: "Graduate with leadership experience of 0",
        condition: (gameState) => gameState.leadershipExperience === 0,
        unlocked: false,
    },
    {
        id: 27,
        name: "People's Representative",
        description: "Graduate with Student Government Experience",
        condition: (gameState) => gameState.triggeredActiveEvents.includes("Student Government"),
        unlocked: false,
    },
    {
        id: 28,
        name: "Captain Columbus",
        description: "Established a club of your own",
        condition: (gameState) => gameState.triggeredActiveEvents.includes("Create Club"),
        unlocked: false,
    },

    // extra achievements for fun 29-34
    {
        id: 29,
        name: "Revolution!",
        description: "Argued With Teacher 3 times ",
        condition: (gameState) => gameState.triggeredPassiveEvents.includes("Argue with Teacher") >= 3,
        unlocked: false,
    },
    {
        id: 30,
        name: "Popular",
        description: "Dated 4 people ",
        condition: (gameState) => gameState.triggeredActiveEvents.includes("Date Someone") >= 4,
        unlocked: false,
    },
    {
        id: 31,
        name: "My Dog Ate It",
        description: "Forgot Homework 3 times ",
        condition: (gameState) => gameState.triggeredPassiveEvents.includes("Missing Homework") >= 3,
        unlocked: false,
    },
    {
        id: 32,
        name: "Ultraman",
        description: "Won 5 Fights",
        condition: (gameState) => gameState.fightsWon >= 5,
        unlocked: false,
    },
    {
        id: 33,
        name: "Batman Pro Max",
        description: "Won Every Fight You Had",
        condition: (gameState) => gameState.triggeredActiveEvents.includes("Fight Someone") + gameState.triggeredPassiveEvents.includes("Provoked") - fightsWon === 0,
        unlocked: false,
    },
    {
        id: 34,
        name: "O Brave New World",
        description: "Only Joined Clubs You Created",
        condition: (gameState) => !gameState.triggeredActiveEvents.includes("Join clubs") && gameState.triggeredActiveEvents.includes("Create Club"),
        unlocked: false,
    },
    {
        id: 35,
        name: "Auto Study Mode",
        description: "Never Worked Hard But GPA always above 3.75",
        condition: (gameState) => !gameState.triggeredActiveEvents.includes("Very hard work") && gameState.gpaRecord.every(gpa => gpa >= 3.75),
        unlocked: false,
    },
];

// Function to check and unlock achievements
export function checkAchievements(gameState) {
    let anyUnlocked = false;
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition(gameState)) {
            achievement.unlocked = true;
            anyUnlocked = true;
            console.log(`Achievement Unlocked: ${achievement.name}`);
        }
    });
    if (anyUnlocked) {
        saveAchievements();
    }
}

function saveAchievements() {
    const unlockedAchievements = achievements.map(achievement => ({
        id: achievement.id,
        unlocked: achievement.unlocked
    }));
    localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
}

export function loadAchievements() {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
        const unlockedAchievements = JSON.parse(savedAchievements);
        unlockedAchievements.forEach(savedAchievement => {
            const achievement = achievements.find(a => a.id === savedAchievement.id);
            if (achievement) {
                achievement.unlocked = savedAchievement.unlocked;
            }
        });
    }
}


// Function to reset achievements 
export function resetAchievements() {
    achievements.forEach(achievement => {
        achievement.unlocked = false;
    });
    localStorage.removeItem('achievements');
}


export function displayAchievements() {
    const achievementListDiv = document.getElementById("achievement-list");
    achievementListDiv.innerHTML = ""; // Clear previous list

    achievements.forEach((achievement) => {
        const achievementDiv = document.createElement("div");
        achievementDiv.classList.add("achievement");
        achievementDiv.innerHTML = `
            <strong>${achievement.name}</strong>: ${achievement.description}
            <span style="color: ${achievement.unlocked ? 'green' : 'gray'};">
                ${achievement.unlocked ? 'Unlocked' : 'Locked'}
            </span>
        `;
        achievementListDiv.appendChild(achievementDiv);
    });
}

document.getElementById("close-achievements").addEventListener("click", () => {
    document.getElementById("achievements-section").classList.add("hidden");
});
