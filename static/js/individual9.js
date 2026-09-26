'use strict';


        function setPlayerVisible(playerName, visible) {
            const playerNode = document.getElementById(playerName);
            if (playerNode) playerNode.style.display = visible ? 'block' : 'none';
        }

        function saveIndividualDashboardState() {
            try {
                const checkedPlayers = Array.from(document.querySelectorAll('#members input[type="checkbox"]'))
                    .filter(cb => cb.checked)
                    .map(cb => cb.id.replace('_checkbox', ''));
                localStorage.setItem('individual9.checkedPlayers', JSON.stringify(checkedPlayers));
                localStorage.setItem('individual9.startingSession', document.getElementById('startingSession').value || '');
                localStorage.setItem('individual9.endingSession', document.getElementById('endingSession').value || '');
            } catch (err) {
                console.log('Unable to save individual dashboard state:', err.message);
            }
        }

        function restoreIndividualDashboardState(players) {
            try {
                const savedStart = localStorage.getItem('individual9.startingSession');
                const savedEnd = localStorage.getItem('individual9.endingSession');
                if (savedStart && Array.from(document.getElementById('startingSession').options).some(o => o.value === savedStart || o.text === savedStart)) {
                    document.getElementById('startingSession').value = savedStart;
                }
                if (savedEnd && Array.from(document.getElementById('endingSession').options).some(o => o.value === savedEnd || o.text === savedEnd)) {
                    document.getElementById('endingSession').value = savedEnd;
                }

                const savedPlayers = JSON.parse(localStorage.getItem('individual9.checkedPlayers') || 'null');
                if (Array.isArray(savedPlayers)) {
                    players.forEach(player => {
                        const checked = savedPlayers.includes(player);
                        const cb = document.getElementById(player + '_checkbox');
                        if (cb) cb.checked = checked;
                        setPlayerVisible(player, checked);
                    });
                }
            } catch (err) {
                console.log('Unable to restore individual dashboard state:', err.message);
            }
        }

        // Field meta: label, optional formatter and sorter
        const allFields = {
            'date': { label: 'Match Date', formatValue: format_date, sorter: sort_date },
            'linkedDate': { label: 'Match Date', formatValue: undefined, sorter: sort_alpha },
            'opponent': { label: 'Opponent', formatValue: undefined, sorter: sort_lastName },
            'result': { label: 'Result', formatValue: format_score, sorter: undefined },
            'rank': { label: 'Rank', formatValue: undefined, sorter: sort_int },
            'oppRank': { label: 'Opponent Rank', formatValue: undefined, sorter: sort_int },
            'innings': { label: 'Innings', formatValue: undefined, sorter: sort_int },
            'wins': { label: 'PF', formatValue: undefined, sorter: sort_int },
            'losses': { label: 'PA', formatValue: undefined, sorter: sort_int },
            'pf': { label: 'Points For', formatValue: undefined, sorter: sort_int },
            'pa': { label: 'Points against', formatValue: undefined, sorter: sort_int },
            'pf_average': { label: 'Wins', formatValue: format_float, sorter: sort_float },
            'pa_average': { label: 'Losses', formatValue: format_float, sorter: sort_float }
        };

        const displayFields = ['date', 'opponent', 'result', 'rank', 'oppRank', 'wins', 'losses'];

        const nineBallRules = (window.GameConfigs && window.GameConfigs.nineBall) ? window.GameConfigs.nineBall : {
            resultScores: ['0,20','1,19','2,18','3,17','4,16','5,15','6,14','7,13','8,12','12,8','13,7','14,6','15,5','16,4','17,3','18,2','19,1','20,0'],
            minRank: 1,
            maxRank: 9
        };

        const resultColors = [
            '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2',
            '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'
        ];

        const tableOptions = {};

        // Shared Google Charts styling.  Keep these options visual-only so the
        // existing data, callbacks, and drill-down behavior remain unchanged.
        const chartTheme = {
            backgroundColor: 'transparent',
            fontName: 'Inter, Segoe UI, Arial, sans-serif',
            titleTextStyle: {
                color: '#1f2937',
                fontSize: 15,
                bold: true
            },
            legend: {
                position: 'right',
                maxLines: 3,
                textStyle: { color: '#475569', fontSize: 12 }
            },
            chartArea: {
                left: 58,
                top: 44,
                width: '70%',
                height: '68%'
            },
            animation: { duration: 450, easing: 'out', startup: true },
            height: 280,
            width: 540,
            tooltip: {
                textStyle: { color: '#1f2937', fontSize: 12 },
                showColorCode: true
            }
        };

        const barChartOptions = {
            ...chartTheme,
            bar: { groupWidth: '70%' },
            colors: ['#16a34a', '#dc2626'],
            hAxis: {
                format: '#',
                minValue: 0,
                textStyle: { color: '#64748b', fontSize: 11 },
                titleTextStyle: { color: '#475569', fontSize: 12, italic: false },
                gridlines: { color: '#e5e7eb', count: 5 },
                minorGridlines: { color: 'transparent' },
                baselineColor: '#cbd5e1'
            },
            vAxis: {
                title: 'Opponent rank',
                textStyle: { color: '#64748b', fontSize: 11 },
                titleTextStyle: { color: '#475569', fontSize: 12, italic: false },
                gridlines: { color: 'transparent' },
                baselineColor: '#cbd5e1'
            }
        };

        const pieChartOptions = {
            ...chartTheme,
            title: 'Results by points earned',
            pieHole: 0.42,
            pieSliceText: 'value',
            sliceVisibilityThreshold: 0.02,
            chartArea: {
                left: 24,
                top: 44,
                width: '76%',
                height: '76%'
            },
            legend: {
                position: 'right',
                textStyle: { color: '#475569', fontSize: 12 }
            },
            colors: resultColors,
            pieSliceBorderColor: '#ffffff'
        };

        const timelineChartOptions = {
            ...chartTheme,
            title: 'Match result difference (pf-pa) over time',
            colors: ['#2563eb', '#94a3b8'],
            curveType: 'function',
            pointSize: 4,
            lineWidth: 3,
            chartArea: {
                left: 58,
                top: 44,
                width: '76%',
                height: '68%'
            },
            hAxis: {
                textStyle: { color: '#64748b', fontSize: 11 },
                gridlines: { color: '#eef2f7' },
                minorGridlines: { color: 'transparent' },
                baselineColor: '#cbd5e1'
            },
            vAxis: {
                textStyle: { color: '#64748b', fontSize: 11 },
                titleTextStyle: { color: '#475569', fontSize: 12, italic: false },
                gridlines: { color: '#e5e7eb' },
                minorGridlines: { color: 'transparent' },
                baselineColor: '#cbd5e1'
            }
        };

        window.onload = function () {
            console.log('window.onload - loading charts');

           // Parse current page URL
            const params = new URLSearchParams(window.location.search);
            console.log("URL Parameters:")

            for (const [key, val] of params.entries()) {
                console.log(`${key} = ${val}`);
            }

            google.charts.load('current', { packages: ['corechart', 'table'] });
            google.charts.setOnLoadCallback(handleDrawCharts);

            initSessionSelect();

            const players = Object.keys(team).sort();
            console.log('Players found:', players);
            players.forEach(playerName => insertChart(playerName));

            updatePlayerSelect(players);
            restoreIndividualDashboardState(players);
        };

        // Build charts for current sessions (callback after google charts loads)
        function handleDrawCharts(sessions = inOrderSessions) {
            console.log('handleDrawCharts()');
            const playerData = extractIndividualRecords(sessions);
            console.dir(playerData);
            teamMembers.forEach(player => {
                if (!playerData[player]) return;
                drawRankCharts(player, playerData[player]);
                drawResultCharts(player, playerData[player]);
                drawTimelineCharts(player, playerData[player]);
                drawMatches(player, playerData[player]);
                drawSummaries(player, playerData[player]);
            });
        }

        // Toggle display of all players
        function togglePlayerSelect(onOrOff) {
            const membersNode = document.getElementById('members');
            const inputs = membersNode.querySelectorAll('input[type="checkbox"]');
            inputs.forEach(cb => {
                cb.checked = !!onOrOff;
                const playerChart = document.getElementById(cb.id.replace('_checkbox', ''));
                if (playerChart) playerChart.style.display = onOrOff ? 'block' : 'none';
            });
            saveIndividualDashboardState();
        }

        // Create checkboxes for players
        function updatePlayerSelect(players) {
            const membersNode = document.getElementById('members');
            players.forEach(player => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.id = player + '_checkbox';
                checkbox.onclick = function () {
                    const playerName = this.id.replace('_checkbox', '');
                    const playerNode = document.getElementById(playerName);
                    setPlayerVisible(playerName, this.checked);
                    saveIndividualDashboardState();
                };

                const label = document.createElement('label');
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(player));

                membersNode.appendChild(label);
            });
        }

        // Insert chart template for a player
        function insertChart(playerName) {
            console.log('insertChart()', playerName);
            const main = document.getElementById('main-ID');
            const chartNames = ['matches', 'games', 'matchesDetails', 'results', 'rank', 'resultsDetails', 'rankDetails'];

            const template = document.getElementsByTagName('template')[0];
            const wrapper = document.importNode(template.content, true);

            const playerCard = wrapper.querySelector('div');
            playerCard.id = playerName;
            playerCard.classList.add('player-card');
            const header = wrapper.querySelector('h3');
            header.innerHTML = playerName;
            header.id = playerName + '_header';

            const cells = wrapper.querySelectorAll('td');
            cells.forEach((c, i) => c.id = `${playerName}_${chartNames[i]}`);

            const details = wrapper.querySelector('#details-ID');
            if (details) details.id = playerName + '_details';

            const summary = wrapper.querySelector('#summary-ID');
            if (summary) summary.id = playerName + '_summary';

            main.appendChild(wrapper);
        }

        // Build player data structure from sessions
        function extractIndividualRecords(sessions = inOrderSessions) {
            console.log('extractIndividualRecords()');
            const players = {};

            sessions.forEach(session => {
                session.matches.forEach(teamMatch => {
                    if (future(teamMatch.date)) return; // skip future matches
                    updatePlayers(players, teamMatch.matches, teamMatch.linkedDate, session.name);
                });
            });

            return players;
        }

        function initializePlayer(players, playerName) {

            console.log('InitializePlayer(' + playerName + ')');

            // Eliminate invalid/unintersting players
            if (playerName == '' || (playerName.toLowerCase() == 'forfeit') || inactivePlayers.includes(playerName)) {
                return 0;
            }

            players[playerName] = {};

            players[playerName].matchesWon  = Array(9).fill(0); // indexed by opponent rank
            players[playerName].matchesLost = Array(9).fill(0);
            players[playerName].gamesWon = Array(9).fill(0);
            players[playerName].gamesLost = Array(9).fill(0);
            players[playerName].pf = players[playerName].gamesWon;
            players[playerName].pa = players[playerName].gamesLost;

            players[playerName].results = nineBallRules.resultScores.reduce((scores, score) => { scores[score] = 0; return scores; }, {});   // All possible scores; 
            players[playerName].matchDetails   = []; // All matches played by this player
            players[playerName].rankByDate     = []; // [[date, player rank]]
            players[playerName].sessionSummary = {}  // indexed by year + session (spring/summer/fall)

            return 1;


        }

        function updatePlayers(players, matches, matchDate, sessionName) {
            // matches: array of match objects
            matches.forEach(match => {
                const name = match.player;
                if (!players.hasOwnProperty(name)) {
                    if (!initializePlayer(players, name)) return;
                }
                const rankIndex = (match.oppRank || nineBallRules.minRank) - 1;
                match.date = matchDate;
                players[name].matchDetails.push(match);

                const won = (match.result[0] > match.result[1]) ? 1 : 0;
                players[name].matchesWon[rankIndex] += won;
                players[name].matchesLost[rankIndex] += (won ? 0 : 1);
                players[name].gamesWon[rankIndex] += match.pf || 0;
                players[name].gamesLost[rankIndex] += match.pa || 0;
                const key = Array.isArray(match.result) ? match.result.toString() : match.result;
                players[name].results[key] = (players[name].results[key] || 0) + 1;

                updateSessionSummary(players[name], match, won, sessionName);
            });
        }

        function updateSessionSummary(player, match, won, sessionName) {
            if (!player.sessionSummary.hasOwnProperty(sessionName)) {
                player.sessionSummary[sessionName] = { wins: 0, losses: 0, gamesWon: [], gamesLost: [], rank: 0, oppRank: 0, pf: 0, pa: 0 };
            }
            const summary = player.sessionSummary[sessionName];
            summary.wins += won ? 1 : 0;
            summary.losses += won ? 0 : 1;
            summary.rank += match.rank || 0;
            summary.oppRank += match.oppRank || 0;
            summary.pf  += match.pf || 0;
            summary.pa += match.pa || 0;
            summary.ratio = summary.pf ? (summary.pf / summary.pa) : 0;
//            console.log(`Update Session Summary ${match.player}`, summary);
        }

        // --- Charting and selection handlers ---

        function selectionHandler(chart, playerData, callback) {
            return function () {
                callback(chart, playerData);
            };
        }

        // Handle selection on rank charts (bar charts)
        function rankSelectCallback(chart, playerData) {
            console.log('rankSelectCallback()');
            const selection = chart.getSelection();
            if (!selection || !selection[0]) return;

            const matchesOrGames = (chart.container.id.search('games') === -1) ? 1 : 0;
            const playerName = playerData.matchDetails[0].player;
            const detailsContainer = document.getElementById(playerName + '_matchesDetails');
            if (detailsContainer) detailsContainer.parentNode.classList.remove('hide');

            const column = selection[0].column;
            const row = selection[0].row;
            const rankValue = row + nineBallRules.minRank;

            const data = playerData.matchDetails.filter(record => {
                const games = (column === 1) ? record.pf : record.pa;
                const ranksMatch = (record.oppRank === rankValue);
                const lost = ((!winOrLoss(record.result)) + 1 === column);
                const gamesMatch = matchesOrGames ? lost : (games !== 0);
                return ranksMatch && gamesMatch;
            });

            const fields = data.map(match => {
                const record = {};
                displayFields.forEach(field => {
                    record[field] = (allFields[field].formatValue === undefined) ? match[field] : allFields[field].formatValue(match[field]);
                });
                return record;
            });

            const labels = [];
            const sorters = displayFields.map(field => {
                labels.push(allFields[field].label);
                return allFields[field].sorter;
            });

            const table_ = sortableTableFromDictArray(fields, labels, sorters);
            const div_ = document.createElement('div');
            div_.classList.add('detailTable');

            if (detailsContainer) {
                detailsContainer.innerHTML = '';
                div_.appendChild(table_);
                detailsContainer.appendChild(div_);
            }
        }

        // Pie chart selection for scores
        function scoreSelectCallback(chart, playerData) {
            console.log('scoreSelectCallback()');
            console.dir(playerData);
            const selection = chart.getSelection();
            if (!selection || !selection[0]) return;

            const playerName = playerData.matchDetails[0].player;
            const scoreIndex = selection[0].row;
            const allPossibleScores = Object.keys(playerData.results);
            const result = allPossibleScores[scoreIndex];


            const data = playerData.matchDetails.filter(record => record.result == result);

            const fields = data.map(match => {
                const record = {};
                ['date', 'opponent', 'result', 'rank', 'oppRank', 'pf', 'pa'].forEach(field => {
                    record[field] = (allFields[field].formatValue === undefined) ? match[field] : allFields[field].formatValue(match[field]);
                });
                return record;
            });

            const labels = [];
            const sorters = displayFields.map(field => {
                labels.push(allFields[field].label);
                return allFields[field].sorter;
            });

            const table_ = sortableTableFromDictArray(fields, labels, sorters);
            const detailsContainer = document.getElementById(playerName + '_resultsDetails');
            if (detailsContainer) {
                detailsContainer.innerHTML = '';
                const div_ = document.createElement('div');
                div_.classList.add('detailTable');
                div_.appendChild(table_);
                detailsContainer.appendChild(div_);
                detailsContainer.parentNode.classList.remove('hide');
            }
        }

        // Draw rank and games bar charts
        function drawRankCharts(player, playerData) {
            console.log('drawRankCharts()', player);
            const chartHeader = ['Label', 'Wins', 'Losses', { role: 'annotation' }];

            const matchResults = playerData.matchesWon.map((v, idx) => [idx + 1, v, playerData.matchesLost[idx] || 0, '']);
            const gameResults = playerData.gamesWon.map((v, idx) => [idx + 1, v, playerData.gamesLost[idx] || 0, '']);

            const matchData = [chartHeader].concat(matchResults);
            const gameData = [chartHeader].concat(gameResults);

            const matchNode = document.getElementById(`${player}_matches`);
            const matches = new google.visualization.BarChart(matchNode);
            const gameNode = document.getElementById(`${player}_games`);
            const games = new google.visualization.BarChart(gameNode);

            matches.draw(
                google.visualization.arrayToDataTable(matchData),
                { ...barChartOptions, title: 'Matches by opponent level' }
            );
            google.visualization.events.addListener(matches, 'select', selectionHandler(matches, playerData, rankSelectCallback));

            games.draw(
                google.visualization.arrayToDataTable(gameData),
                { ...barChartOptions, title: 'Total games by opponent level' }
            );
            google.visualization.events.addListener(games, 'select', selectionHandler(games, playerData, rankSelectCallback));
        }

        // Draw pie chart for results
        function drawResultCharts(playerName, playerData) {
            console.log('drawResultCharts()', playerName);
            try {
                const myData = Object.entries(playerData.results).map(([score, count]) => [score, count]);
                myData.unshift(['Score', 'Count']);
                const googleChartData = google.visualization.arrayToDataTable(myData);
                const options = pieChartOptions;
                const pieChartNode = document.getElementById(playerName + '_results');
                const chart = new google.visualization.PieChart(pieChartNode);
                google.visualization.events.addListener(chart, 'select', selectionHandler(chart, playerData, scoreSelectCallback));
                chart.draw(googleChartData, options);
            } catch (err) {
                console.log('Failed to create pie chart:', err.message);
            }
        }

        // Moving average calculation (keeps original intent)
        function calculateMovingAverage(matchScores) {
            console.log('calculateMovingAverage()');
            const normalizedScores = matchScores.map(score => (score.result[0] - score.result[1]));
            const average = matchScores.map((score, i) => {
                if (i < 2 || i > matchScores.length - 3) return [score.date, score.rank, score.rank];
                const window = (normalizedScores[i - 2] + normalizedScores[i - 1] + normalizedScores[i] + normalizedScores[i + 1] + normalizedScores[i + 2]) / 5;
                return [score.linkedDate || score.date, window + score.rank, score.rank];
            });
            return average;
        }

        // Draw timeline chart (rank vs time/moving average)
        function drawTimelineCharts(playerName, playerData) {
            console.log('drawTimelineCharts()', playerName);
            try {
                const averages = calculateMovingAverage(playerData.matchDetails);
                averages.unshift(['Match #', 'Result', 'Rank']);
                const googleChartData = google.visualization.arrayToDataTable(averages);
                const options = timelineChartOptions;
                const lineChartNode = document.getElementById(playerName + '_rank');
                const chart = new google.visualization.LineChart(lineChartNode);
                chart.draw(googleChartData, options);
            } catch (err) {
                console.log('Failed to create timeline chart:', err.message);
            }
        }

        // Build the matches table using DOMUtil helpers
        function drawMatches(playerName, playerData) {
            console.log('drawMatches()', playerName);
            const data = playerData.matchDetails.map(match => {
                return {
                    date: match.date,
                    opponent: match.opponent,
                    result: match.result,
                    rank: match.rank,
                    oppRank: match.oppRank,
                    innings: match.innings,
                    wins: match.pf,
                    losses: match.pa
                };
            });

            const fields = data.map(match => {
                const record = {};
                displayFields.forEach(field => {
                    record[field] = (allFields[field].formatValue === undefined) ? match[field] : allFields[field].formatValue(match[field]);
                });
                return record;
            });

            const labels = [];
            const sorters = displayFields.map(field => {
                labels.push(allFields[field].label);
                return allFields[field].sorter;
            });

            const table_ = sortableTableFromDictArray(fields, labels, sorters);
            const detailsNode = document.getElementById(playerName + '_details');
            if (detailsNode) {
                if (window.DashboardTable && typeof DashboardTable.render === 'function') {
                    DashboardTable.render(detailsNode, {
                        title: 'Complete match list',
                        subtitle: `${fields.length} ${fields.length === 1 ? 'match' : 'matches'}`,
                        table: table_,
                        searchable: true,
                        compactRows: 5
                    });
                } else {
                    detailsNode.innerHTML = '';
                    detailsNode.appendChild(table_);
                }
            }
        }

        // Session summary visualization
        function drawSummaries(playerName, playerData) {
            console.log('drawSummaries()', playerName);

            const summaryNode = document.getElementById(playerName + '_summary');
            if (!summaryNode) return;

            const keys = Object.keys(playerData.sessionSummary);
            const sessionRows = keys.map(key => {
                const s = playerData.sessionSummary[key];
                const wins = s.wins || 0;
                const losses = s.losses || 0;
                const matches = wins + losses;
                const pf = s.pf || 0;
                const pa = s.pa || 0;
                return {
                    session: key,
                    wins: wins,
                    losses: losses,
                    matches: matches,
                    pf: pf,
                    pa: pa,
                    winPct: matches ? (wins / matches) * 100 : 0,
                    pointRatio: pa ? (pf / pa) : 0,
                    avgOppRank: matches ? (s.oppRank / matches) : 0
                };
            });

            const totals = sessionRows.reduce((acc, row) => {
                acc.wins += row.wins;
                acc.losses += row.losses;
                acc.pf += row.pf;
                acc.pa += row.pa;
                acc.oppRankWeighted += row.avgOppRank * row.matches;
                acc.matches += row.matches;
                return acc;
            }, { wins: 0, losses: 0, pf: 0, pa: 0, oppRankWeighted: 0, matches: 0 });

            const totalWinPct = totals.matches ? ((totals.wins / totals.matches) * 100).toFixed(1) : '0.0';
            const totalPointRatio = totals.pa ? (totals.pf / totals.pa).toFixed(2) : '0.00';
            const avgOppRank = totals.matches ? (totals.oppRankWeighted / totals.matches).toFixed(2) : '0.00';

            summaryNode.innerHTML = '';
            summaryNode.classList.add('session-summary-card');

            const header = document.createElement('div');
            header.className = 'session-summary-header';
            header.innerHTML = `
                <div>
                    <h4>Session performance</h4>
                    <p>Win rate, point balance, and opponent strength by session.</p>
                </div>
                <div class="session-summary-badges" aria-label="Overall player session totals">
                    <span><strong>${totals.wins}-${totals.losses}</strong> record</span>
                    <span><strong>${totalWinPct}%</strong> win rate</span>
                    <span><strong>${totalPointRatio}</strong> point ratio</span>
                    <span><strong>${avgOppRank}</strong> avg opp rank</span>
                </div>
            `;
            summaryNode.appendChild(header);

            if (!sessionRows.length) {
                const empty = document.createElement('p');
                empty.className = 'muted-note';
                empty.textContent = 'No completed session data is available for this player.';
                summaryNode.appendChild(empty);
                return;
            }

            const chartNode = document.createElement('div');
            chartNode.className = 'session-summary-chart';
            summaryNode.appendChild(chartNode);

            const data = [['Session', 'Win %', 'Point Ratio', 'Avg Opp Rank']]
                .concat(sessionRows.map(row => [
                    row.session,
                    Number(row.winPct.toFixed(1)),
                    Number((row.pointRatio * 50).toFixed(1)),
                    Number((row.avgOppRank * 10).toFixed(1))
                ]));

            try {
                const googleData = google.visualization.arrayToDataTable(data);
                const options = {
                    title: '',
                    backgroundColor: 'transparent',
                    chartArea: { left: 52, top: 18, right: 24, bottom: 62, width: '82%', height: '68%' },
                    height: Math.max(260, Math.min(420, sessionRows.length * 42 + 140)),
                    legend: { position: 'top', textStyle: { color: '#475569', fontSize: 12 } },
                    hAxis: {
                        textStyle: { color: '#64748b', fontSize: 11 },
                        slantedText: true,
                        slantedTextAngle: 30
                    },
                    vAxis: {
                        minValue: 0,
                        maxValue: 100,
                        gridlines: { color: '#e5edf6' },
                        minorGridlines: { color: 'transparent' },
                        textStyle: { color: '#64748b', fontSize: 11 }
                    },
                    colors: ['#2563eb', '#16a34a', '#f59e0b'],
                    bar: { groupWidth: '72%' },
                    animation: { duration: 500, easing: 'out', startup: true }
                };

                const chart = new google.visualization.ColumnChart(chartNode);
                chart.draw(googleData, options);
            } catch (err) {
                console.log('Failed to create session summary chart:', err.message);
            }

            const footnote = document.createElement('p');
            footnote.className = 'chart-footnote';
            footnote.textContent = 'Point Ratio is scaled to fit the chart: 1.00 ratio = 50. Avg Opp Rank is scaled: rank 5 = 50.';
            summaryNode.appendChild(footnote);

            const detail = document.createElement('details');
            detail.className = 'session-summary-details';
            const detailSummary = document.createElement('summary');
            detailSummary.textContent = 'Show numeric session data';
            detail.appendChild(detailSummary);

            const labels = ['Session', 'Wins', 'Losses', 'Win %', 'Points for', 'Points against', 'Ratio', 'Avg opp rank'];
            const tableData = sessionRows.map(row => [
                row.session,
                row.wins,
                row.losses,
                row.winPct.toFixed(1) + '%',
                row.pf,
                row.pa,
                row.pointRatio.toFixed(2),
                row.avgOppRank.toFixed(2)
            ]);
            tableData.push(['Totals', totals.wins, totals.losses, totalWinPct + '%', totals.pf, totals.pa, totalPointRatio, avgOppRank]);

            const tableHost = document.createElement('div');
            tableHost.className = 'session-summary-table-host';
            tableHost.appendChild(tableFromDictArray(tableData, labels));
            detail.appendChild(tableHost);
            summaryNode.appendChild(detail);
        }

        // Session selection UI
        function initSessionSelect() {
            const startEl = document.getElementById('startingSession');
            const endEl = document.getElementById('endingSession');
            startEl.onchange = handleSessionSelect;
            endEl.onchange = handleSessionSelect;

            inOrderSessions.forEach(session => {
                const startOption = document.createElement('option');
                const endOption = document.createElement('option');
                startOption.text = session.name;
                endOption.text = session.name;
                startEl.add(startOption);
                endEl.add(endOption);
            });

            startEl.value = inOrderSessions[0].name;
            endEl.value = inOrderSessions[inOrderSessions.length - 1].name;
        }

        function handleSessionSelect() {
            const start = document.getElementById('startingSession').value;
            const end = document.getElementById('endingSession').value;
            if (sessionCompare(start, end) === -1) {
                document.getElementById('startingSession').value = end;
            }
            const sessions = limitSessions(inOrderSessions, getSessionByName(start), getSessionByName(end));
            handleDrawCharts(sessions);
            saveIndividualDashboardState();
        }
