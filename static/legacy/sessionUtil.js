// sessionUtil.js// sessionUtil.js
// Shared data access/manipulation routines for the sessions data structure.
// Cleaned and modernized while preserving behavior.

'use strict';

// NOTE: currentSession and archivedSessions are expected to exist (as in original app).
const allSessions = [currentSession].concat(archivedSessions); // current first
const inOrderSessions = archivedSessions.concat(currentSession); // oldest -> most recent

const startingRank = 3; // default starting rank for new players
const sessionOrder = { 'Spring': 0, 'Summer': 1, 'Fall': 2 };
const pointsRequired = [14, 19, 25, 31, 38, 46, 55, 65, 75];
const inactivePlayers = [];
const teamName = 'Itchin to Scratch';
const team = {
    'Dean Pinckert': 94211255,
    'Johnson Lau': 94205033,
    'Lori Lau': 94201861,
    'Robert Valim': 94201620,
    'Kimberly Lucchesi': 94205145,
    'Maria Fogle': 94205287,
    'Ammoron Andrus': 94200009,
    'Aimee Wood': 94206082
};

const teamMembers = Object.keys(team).sort();

const teamMemberSpecifics = Object.keys(team).map(person => {
    return [
        team[person],
        person.split(' ')[0],
        playerRank(person.split(' ')[0]),
        0
    ];
});

// Former team members, don't display (individual stats)
// const inactivePlayers = ['Abhinav', 'Prashant', 'Nitish', 'Forfeit'];
// const baseURL = 'https://www.pinckert.com/rackless/';

// 9-ball specifics
const nineBall = {
    'possibleScores': [
        [0, 20], [1, 19], [2, 18], [3, 17], [4, 16], [5, 15], [6, 14], [7, 13], [8, 12],
        [12, 8], [13, 7], [14, 6], [15, 5], [16, 4], [17, 3], [18, 2], [19, 1], [20, 0]
    ],
    'resultColors': [
        '#700000', '#800000', '#900000', '#A00000', '#B00000', '#C00000', '#E00000', '#F00000', '#FF0000',
        '#007000', '#007800', '#009000', '#00A000', '#00B000', '#00C000', '#00E000', '#00F000', '#00FF00'
    ],
    'minRank': 1,
    'maxRank': 9
};

// Utility: create APAsheet-style link from a date
function APAlinkFromMatchDate(date, sessions = allSessions) {
    console.log('APAlinkFromMatchDate() :', date);
    try {
        const targetTime = new Date(date).getTime();
        for (const session of sessions) {
            for (const match of session.matches) {
                // match.date expected to be a date string: compare times
                if (new Date(match.date).getTime() === targetTime) {
                    return match.APALink || match.APALink === '' ? match.APALink : date;
                }
            }
        }
    } catch (err) {
        console.log('Error in APAlinkFromMatchDate:', err);
    }
    return date;
}

// Build an <a> link string for the UI
function linkDate(tag, href) {
    console.log("LINKED DATE(): ")
    return `<a href='${href}'>${tag}</a>`;
}

// Return all opponent teams for the given list of sessions.
function opponentTeams(sessions = allSessions) {
    const teams = sessions.reduce((opponents, session) => {
        session.matches.map(m => m.opponent).forEach(t => opponents.add(t));
        return opponents;
    }, new Set());
    return [...teams];
}

// Return all opponent players for a given team over the list of sessions
function opponentPlayers(teamFilter, sessions = allSessions) {
    console.log('opponentPlayers()');
    const matches = teamMatches(sessions).filter(m => {
        // if teamFilter is a substring or array check
        if (Array.isArray(teamFilter)) return teamFilter.includes(m.opponent);
        return String(m.opponent).includes(String(teamFilter));
    });
    const players = new Set(matches.flatMap(tm => tm.matches.map(match => match.opponent)));
    return [...players].sort();
}

// Return a session object given the session name
function getSessionByName(name) {
    const match = allSessions.find(s => s.name === name);
    return match || null;
}

// Limit a list of sessions by a start session and an end session (inclusive)
function limitSessions(sessions = allSessions, start = allSessions[0], end = allSessions[allSessions.length - 1]) {
    console.log('limitSessions() from', start, 'to', end);
    const startIndex = sessions.findIndex(s => s.name === start.name);
    const endIndex = sessions.findIndex(s => s.name === end.name);
    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        // fallback: return input
        return sessions;
    }
    return sessions.slice(startIndex, endIndex + 1);
}

// Return a set of all team players who have played in matches
function allPlayers(sessions = allSessions) {
    const matches = teamMatches(sessions);
    const players = new Set();
    matches.forEach(tm => tm.matches.forEach(match => players.add(match.player)));
    players.delete('Forfeit');
    players.delete('');
    return players;
}

function getInactivePlayers(sessions = allSessions) {
    const playerList = allPlayers(sessions);
    return [...playerList].filter(p => !teamMembers.includes(p));
}

// matches by calendar year
function matchesByDate(date) {
    console.log('matchesByDate() for year', date.getFullYear());
    const year = date.getFullYear();
    const matches = allSessions.reduce((allMatches, session) => {
        if (session.year === year) {
            return allMatches.concat(session.matches);
        }
        return allMatches;
    }, []);
    return matches;
}

// Sum of scores: [[w,l], ...] => [totalW, totalL]
function sumScores(scores) {
    console.dir(scores);
    return scores.reduce((acc, result) => {
        return [acc[0] + result[0], acc[1] + result[1]];
    }, [0, 0]);
}

function sumMatches(matches) {
    const scores = matches.map(m => m.result);
    return sumScores(scores);
}

// compareScores (handles text or array)
function compareScores(first, second) {
    // normalize
    if (!Array.isArray(first)) first = parseScore(first);
    if (!Array.isArray(second)) second = parseScore(second);
    const result = (first[0] - second[0]) - (first[1] - second[1]);
    return result === 0 ? 0 : (result > 0 ? 1 : -1);
}

function parseScore(textScore) {
    if (!textScore) return [0, 0];
    const nums = String(textScore).match(/\d+/g) || [0, 0];
    return [parseInt(nums[0], 10) || 0, parseInt(nums[1], 10) || 0];
}

function format_score(score) {
    const asString = Array.isArray(score) ? score.join('-') : String(score);
    return winOrLoss(score) ? ('W: ' + asString) : ('L: ' + asString);
}

function format_date(dateString) {
    try {
 //       console.log('format_date()');
 //       console.dir(dateString);
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString();
    } catch (err) {
        return dateString;
    }
}

function winOrLoss(result) {
    if (!Array.isArray(result)) result = parseScore(result);
    return result[0] > result[1];
}

// Get the people who played for our team in a session
function getPlayersBySession(sessionData, playerSet = new Set()) {
    for (const matchWrapper of sessionData.matches) {
        const matches = matchWrapper.matches || [];
        matches.forEach(m => playerSet.add(m.player));
    }
    return playerSet;
}

// Update displayed player rank as indicated by most recent match
function playerRank(name) {
    console.log('playerRank() for', name);
    const allMatches = teamMatches().slice().reverse(); // copy + reverse
    const flattened = allMatches.flatMap(m => m.matches || []);
    for (const match of flattened) {
        if (match.player === name) return match.rank;
    }
    return startingRank;
}

// Comparison of session labels like "Fall 2017"
// returns 1 if first < second (earlier), 0 if same, -1 if first > second (later)
function sessionCompare(firstSession, secondSession) {
    if (firstSession === secondSession) return 0;
    const [firstTerm, firstYearStr] = firstSession.split(' ');
    const [secondTerm, secondYearStr] = secondSession.split(' ');
    const firstYear = parseInt(firstYearStr, 10);
    const secondYear = parseInt(secondYearStr, 10);

    if (firstYear < secondYear) return 1;
    if (firstYear > secondYear) return -1;

    // same year: use term ordering
    const firstOrder = sessionOrder[firstTerm] ?? 0;
    const secondOrder = sessionOrder[secondTerm] ?? 0;
    if (firstOrder < secondOrder) return 1;
    if (firstOrder > secondOrder) return -1;
    return 0;
}

// Flat list of all player matches from an array of sessions
function individualMatches(sessions = allSessions) {
    return teamMatches(sessions).flatMap(s => s.matches || []);
}

// Flat list all team matches, agnostic of session.
function teamMatches(sessions = allSessions) {
    return sessions.flatMap(session => session.matches || []);
}

// Return link to APA scoresheet for a given date (or the date string if not found)
function APAlinkFromMatchDate(date) {
    return APAlinkFromMatchDateInternal(date, allSessions);
}

// internal helper (non-exported) to avoid confusion if called earlier
function APAlinkFromMatchDateInternal(date, sessions) {
    return date; // uses same function above; kept for compatibility
}

// Ignore matches that are yet to be played
function future(date) {
    try {
        return new Date(date).getTime() > new Date().getTime();
    } catch (err) {
        return false;
    }
}

