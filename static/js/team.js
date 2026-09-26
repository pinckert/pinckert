/* team.js
   Season-over-time dashboard for team performance.
   This page intentionally emphasizes overview and trend data rather than the
   earlier handicap scatter analysis.
*/
'use strict';

const TEAM_HANDICAP_LIMIT = 23;
const MATCHES_PER_TEAM_MATCH = 5;
const TEAM_TERM_ORDER = { Spring: 1, Summer: 2, Fall: 3, Winter: 4 };

window.onload = function () {
    google.charts.load('current', { packages: ['corechart', 'bar', 'table'] });
    google.charts.setOnLoadCallback(drawTeamDashboard);
};

function drawTeamDashboard() {
    const sessions = getOrderedSessions().filter(hasCompletedMatches);
    const summaries = sessions.map(summarizeSession);
    const matches = flattenCompletedTeamMatches(sessions);

    renderTopMetrics(summaries, matches);
    renderSeasonCards(summaries);
    drawRecordChart(summaries);
    drawMarginChart(summaries);
    drawPointsChart(summaries);
    drawStrengthChart(summaries);
    renderRecentMatchesTable(matches);
    renderSeasonSummaryTable(summaries);
}

function getOrderedSessions() {
    const sessions = [];
    if (Array.isArray(window.archivedSessions)) sessions.push(...window.archivedSessions);
    if (window.currentSession) sessions.push(window.currentSession);

    return sessions
        .filter(Boolean)
        .sort((a, b) => {
            const yearDiff = (Number(a.year) || 0) - (Number(b.year) || 0);
            if (yearDiff) return yearDiff;
            return (TEAM_TERM_ORDER[a.term] || 99) - (TEAM_TERM_ORDER[b.term] || 99);
        });
}

function hasCompletedMatches(session) {
    return Array.isArray(session.matches) && session.matches.some(match => !isFutureTeamMatch(match.date));
}

function isFutureTeamMatch(dateValue) {
    if (typeof window.future === 'function') return window.future(dateValue);
    const parsed = new Date(String(dateValue || '').replace(/\//g, '-'));
    return !isNaN(parsed.getTime()) && parsed > new Date();
}

function sessionLabel(session) {
    return session && (session.name || `${session.term || ''} ${session.year || ''}`.trim());
}

function formatShortDate(dateValue) {
    const parsed = new Date(String(dateValue || '').replace(/\//g, '-'));
    if (isNaN(parsed.getTime())) return String(dateValue || '');
    return parsed.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
}

function formatOne(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(1) : '0.0';
}

function formatPct(value) {
    const number = Number(value);
    return Number.isFinite(number) ? `${(number * 100).toFixed(1)}%` : '0.0%';
}

function safeDivide(numerator, denominator) {
    const n = Number(numerator) || 0;
    const d = Number(denominator) || 0;
    return d ? n / d : 0;
}

function parseScore(scoreValue) {
    if (Array.isArray(scoreValue)) return [Number(scoreValue[0]) || 0, Number(scoreValue[1]) || 0];
    if (typeof scoreValue === 'string') {
        const parts = scoreValue.match(/-?\d+(?:\.\d+)?/g);
        if (parts && parts.length >= 2) return [Number(parts[0]) || 0, Number(parts[1]) || 0];
    }
    return [0, 0];
}

function getTeamMatchScore(teamMatch) {
    const direct = parseScore(teamMatch && teamMatch.score);
    if (direct[0] || direct[1]) return direct;

    const matches = Array.isArray(teamMatch && teamMatch.matches) ? teamMatch.matches : [];
    return matches.reduce((totals, match) => {
        const result = parseScore(match.result);
        totals[0] += result[0];
        totals[1] += result[1];
        return totals;
    }, [0, 0]);
}

function isForfeitMatch(match) {
    const player = String(match && match.player || '').trim().toLowerCase();
    const opponent = String(match && match.opponent || '').trim().toLowerCase();
    return !player || player === 'forfeit' || opponent === 'forfeit';
}

function validRankMatches(teamMatch) {
    return (teamMatch.matches || []).filter(match => !isForfeitMatch(match));
}

function getHandicapTotals(teamMatch) {
    const matches = validRankMatches(teamMatch);
    const totals = matches.reduce((sums, match) => {
        sums.team += Number(match.rank) || 0;
        sums.opponent += Number(match.oppRank) || 0;
        return sums;
    }, { team: 0, opponent: 0 });

    return {
        team: totals.team,
        opponent: totals.opponent,
        count: matches.length,
        complete: matches.length === MATCHES_PER_TEAM_MATCH
    };
}

function flattenCompletedTeamMatches(sessions) {
    const rows = [];
    sessions.forEach(session => {
        (session.matches || []).forEach(teamMatch => {
            if (isFutureTeamMatch(teamMatch.date)) return;
            const score = getTeamMatchScore(teamMatch);
            const handicap = getHandicapTotals(teamMatch);
            const pointMargin = score[0] - score[1];
            rows.push({
                session: sessionLabel(session),
                date: teamMatch.date,
                sortDate: new Date(String(teamMatch.date || '').replace(/\//g, '-')).getTime() || 0,
                opponent: teamMatch.opponent || 'Unknown',
                place: teamMatch.place || 'Unknown',
                scoreFor: score[0],
                scoreAgainst: score[1],
                pointMargin,
                result: pointMargin > 0 ? 'Win' : pointMargin < 0 ? 'Loss' : 'Tie',
                teamHandicap: handicap.complete ? handicap.team : null,
                opponentHandicap: handicap.complete ? handicap.opponent : null,
                handicapDiff: handicap.complete ? handicap.team - handicap.opponent : null,
                capUsage: handicap.complete ? safeDivide(handicap.team, TEAM_HANDICAP_LIMIT) : null,
                APALink: teamMatch.APALink || ''
            });
        });
    });
    return rows.sort((a, b) => a.sortDate - b.sortDate);
}

function summarizeSession(session) {
    const matches = flattenCompletedTeamMatches([session]);
    const totals = matches.reduce((summary, match) => {
        summary.matches += 1;
        summary.pointsFor += match.scoreFor;
        summary.pointsAgainst += match.scoreAgainst;
        summary.wins += match.pointMargin > 0 ? 1 : 0;
        summary.losses += match.pointMargin < 0 ? 1 : 0;
        summary.ties += match.pointMargin === 0 ? 1 : 0;
        summary.teamHandicap += match.teamHandicap || 0;
        summary.opponentHandicap += match.opponentHandicap || 0;
        summary.handicapMatches += match.teamHandicap === null ? 0 : 1;
        summary.capUsage += match.capUsage || 0;
        return summary;
    }, {
        session: sessionLabel(session),
        year: session.year,
        term: session.term,
        matches: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        teamHandicap: 0,
        opponentHandicap: 0,
        handicapMatches: 0,
        capUsage: 0
    });

    totals.pointMargin = totals.pointsFor - totals.pointsAgainst;
    totals.avgPointsFor = safeDivide(totals.pointsFor, totals.matches);
    totals.avgPointsAgainst = safeDivide(totals.pointsAgainst, totals.matches);
    totals.avgPointMargin = safeDivide(totals.pointMargin, totals.matches);
    totals.winPct = safeDivide(totals.wins, totals.matches);
    totals.pointRatio = safeDivide(totals.pointsFor, totals.pointsAgainst);
    totals.avgTeamHandicap = safeDivide(totals.teamHandicap, totals.handicapMatches);
    totals.avgOpponentHandicap = safeDivide(totals.opponentHandicap, totals.handicapMatches);
    totals.avgHandicapDiff = totals.avgTeamHandicap - totals.avgOpponentHandicap;
    totals.avgCapUsage = safeDivide(totals.capUsage, totals.handicapMatches);
    return totals;
}

function renderTopMetrics(summaries, matches) {
    const totals = summaries.reduce((acc, session) => {
        acc.sessions += 1;
        acc.matches += session.matches;
        acc.wins += session.wins;
        acc.losses += session.losses;
        acc.ties += session.ties;
        acc.pointsFor += session.pointsFor;
        acc.pointsAgainst += session.pointsAgainst;
        return acc;
    }, { sessions: 0, matches: 0, wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 });

    const recent = matches.slice(-5);
    const recentWins = recent.filter(match => match.pointMargin > 0).length;
    const recentLosses = recent.filter(match => match.pointMargin < 0).length;

    setText('metricSessions', totals.sessions);
    setText('metricMatches', totals.matches);
    setText('metricRecord', `${totals.wins}-${totals.losses}${totals.ties ? `-${totals.ties}` : ''}`);
    setText('metricWinPct', `${formatPct(safeDivide(totals.wins, totals.matches))} match win rate`);
    setText('metricPoints', `${totals.pointsFor}-${totals.pointsAgainst}`);
    setText('metricPointMargin', `${totals.pointsFor - totals.pointsAgainst >= 0 ? '+' : ''}${totals.pointsFor - totals.pointsAgainst} total point margin`);
    setText('metricRecentTrend', recent.length ? `${recentWins}-${recentLosses}` : '--');
}

function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
}

function renderSeasonCards(summaries) {
    const host = document.getElementById('seasonCards');
    if (!host) return;
    host.innerHTML = '';

    if (!summaries.length) {
        host.innerHTML = '<p class="status-note">No completed team matches found.</p>';
        return;
    }

    summaries.forEach(summary => {
        const card = document.createElement('article');
        card.className = 'season-summary-card';
        const marginClass = summary.avgPointMargin >= 0 ? 'positive' : 'negative';
        card.innerHTML = `
            <div class="season-card-topline">
                <h3>${summary.session}</h3>
                <span>${summary.matches} matches</span>
            </div>
            <div class="season-card-record">${summary.wins}-${summary.losses}${summary.ties ? `-${summary.ties}` : ''}</div>
            <div class="season-card-stat-row">
                <span>Win rate</span>
                <strong>${formatPct(summary.winPct)}</strong>
            </div>
            <div class="season-progress" aria-label="Win rate ${formatPct(summary.winPct)}">
                <span style="width:${Math.max(0, Math.min(100, summary.winPct * 100))}%"></span>
            </div>
            <div class="season-card-stat-row">
                <span>Points</span>
                <strong>${summary.pointsFor}-${summary.pointsAgainst}</strong>
            </div>
            <div class="season-card-stat-row">
                <span>Avg margin</span>
                <strong class="${marginClass}">${summary.avgPointMargin >= 0 ? '+' : ''}${formatOne(summary.avgPointMargin)}</strong>
            </div>
            <div class="season-card-stat-row">
                <span>Avg SL played</span>
                <strong>${formatOne(summary.avgTeamHandicap)} / 23</strong>
            </div>`;
        host.appendChild(card);
    });
}

function chartBaseOptions(overrides = {}) {
    if (window.DashboardCharts && typeof DashboardCharts.baseOptions === 'function') {
        return DashboardCharts.baseOptions(overrides);
    }
    return Object.assign({ backgroundColor: '#fff', animation: { duration: 400, startup: true } }, overrides);
}

function lineOptions(overrides = {}) {
    if (window.DashboardCharts && typeof DashboardCharts.lineOptions === 'function') {
        return DashboardCharts.lineOptions(overrides);
    }
    return chartBaseOptions(Object.assign({ curveType: 'function', pointSize: 5, lineWidth: 3 }, overrides));
}

function drawRecordChart(summaries) {
    const node = document.getElementById('recordChart');
    if (!node || !summaries.length) return;
    const data = [['Session', 'Wins', 'Losses', 'Ties']].concat(
        summaries.map(s => [s.session, s.wins, s.losses, s.ties])
    );
    const chart = new google.visualization.ColumnChart(node);
    chart.draw(google.visualization.arrayToDataTable(data), chartBaseOptions({
        title: 'Match record by session',
        isStacked: true,
        colors: ['#16a34a', '#dc2626', '#94a3b8'],
        chartArea: { left: 60, top: 55, width: '78%', height: '62%' },
        vAxis: { title: 'Team matches', minValue: 0, format: '0' }
    }));
}

function drawMarginChart(summaries) {
    const node = document.getElementById('marginChart');
    if (!node || !summaries.length) return;
    const data = [['Session', 'Avg point margin']].concat(
        summaries.map(s => [s.session, Number(s.avgPointMargin.toFixed(2))])
    );
    const chart = new google.visualization.ColumnChart(node);
    chart.draw(google.visualization.arrayToDataTable(data), chartBaseOptions({
        title: 'Average point margin per match',
        colors: ['#2563eb'],
        chartArea: { left: 70, top: 55, width: '76%', height: '62%' },
        vAxis: { title: 'Points per match' }
    }));
}

function drawPointsChart(summaries) {
    const node = document.getElementById('pointsChart');
    if (!node || !summaries.length) return;
    const data = [['Session', 'Avg points for', 'Avg points against']].concat(
        summaries.map(s => [s.session, Number(s.avgPointsFor.toFixed(2)), Number(s.avgPointsAgainst.toFixed(2))])
    );
    const chart = new google.visualization.LineChart(node);
    chart.draw(google.visualization.arrayToDataTable(data), lineOptions({
        title: 'Average points per team match',
        colors: ['#16a34a', '#dc2626'],
        vAxis: { title: 'Points' }
    }));
}

function drawStrengthChart(summaries) {
    const node = document.getElementById('strengthChart');
    if (!node || !summaries.length) return;
    const data = [['Session', 'Avg team SL', 'Avg opponent SL', '23 cap']].concat(
        summaries.map(s => [s.session, Number(s.avgTeamHandicap.toFixed(2)), Number(s.avgOpponentHandicap.toFixed(2)), TEAM_HANDICAP_LIMIT])
    );
    const chart = new google.visualization.LineChart(node);
    chart.draw(google.visualization.arrayToDataTable(data), lineOptions({
        title: 'Lineup strength and opponent strength',
        colors: ['#2563eb', '#f97316', '#94a3b8'],
        series: { 2: { lineDashStyle: [4, 4], pointSize: 0 } },
        vAxis: { title: 'Total skill level', viewWindow: { min: 0, max: 25 } }
    }));
}

function createTableFromRows(headers, rows) {
    const table = document.createElement('table');
    table.className = 'data-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(value => {
            const td = document.createElement('td');
            if (value && value.nodeType) {
                td.appendChild(value);
            } else {
                td.textContent = value;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}

function renderRecentMatchesTable(matches) {
    const host = document.getElementById('recentMatchesTable');
    if (!host) return;
    const recent = matches.slice().sort((a, b) => b.sortDate - a.sortDate);
    const rows = recent.map(match => {
        const dateNode = document.createElement(match.APALink ? 'a' : 'span');
        dateNode.textContent = formatShortDate(match.date);
        if (match.APALink) {
            dateNode.href = match.APALink;
            dateNode.target = '_blank';
            dateNode.rel = 'noopener noreferrer';
        }
        return [
            dateNode,
            match.session,
            match.opponent,
            match.result,
            `${match.scoreFor}-${match.scoreAgainst}`,
            match.pointMargin >= 0 ? `+${match.pointMargin}` : String(match.pointMargin),
            match.teamHandicap === null ? '—' : `${match.teamHandicap}-${match.opponentHandicap}`,
            match.handicapDiff === null ? '—' : (match.handicapDiff >= 0 ? `+${match.handicapDiff}` : String(match.handicapDiff)),
            match.place
        ];
    });

    const table = createTableFromRows(
        ['Date', 'Session', 'Opponent', 'Result', 'Score', 'Margin', 'SL Total', 'SL Diff', 'Venue'],
        rows
    );

    if (window.DashboardTable) {
        DashboardTable.render(host, {
            title: 'Recent Team Matches',
            subtitle: `${matches.length} completed team matches`,
            table,
            searchable: true,
            compactRows: 7
        });
    } else {
        host.appendChild(table);
    }
}

function renderSeasonSummaryTable(summaries) {
    const host = document.getElementById('seasonSummaryTable');
    if (!host) return;
    const rows = summaries.map(s => [
        s.session,
        s.matches,
        `${s.wins}-${s.losses}${s.ties ? `-${s.ties}` : ''}`,
        formatPct(s.winPct),
        `${s.pointsFor}-${s.pointsAgainst}`,
        s.pointMargin >= 0 ? `+${s.pointMargin}` : String(s.pointMargin),
        formatOne(s.avgPointsFor),
        formatOne(s.avgPointsAgainst),
        formatOne(s.avgPointMargin),
        formatOne(s.avgTeamHandicap),
        formatOne(s.avgOpponentHandicap),
        formatPct(s.avgCapUsage)
    ]);

    const table = createTableFromRows(
        ['Session', 'Matches', 'Record', 'Win %', 'Points', 'Point margin', 'Avg PF', 'Avg PA', 'Avg margin', 'Avg team SL', 'Avg opp SL', 'Avg cap usage'],
        rows
    );

    if (window.DashboardTable) {
        DashboardTable.render(host, {
            title: 'Season Details',
            subtitle: 'Complete season summary metrics',
            table,
            searchable: false,
            compactRows: 6
        });
    } else {
        host.appendChild(table);
    }
}
