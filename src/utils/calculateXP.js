function calculateXP({
    workDone,
    hoursWorked,
    githubLink
}) {

    let xp = 10; // Base XP

    const words = workDone.trim().split(/\s+/);

    if (words.length >= 20) {
        xp += 5;
    }

    // Hours worked
    if (hoursWorked >= 4) {
        xp += 5;
    }

    const isGithubLink = githubLink.startsWith("https://github.com/");

    if (isGithubLink) {
        xp += 10;
    }

    return xp;
}

module.exports = calculateXP;