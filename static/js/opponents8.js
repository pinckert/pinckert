'use strict'

		// HTML ID's used
		const teamHTMLIds = { table: "teamTable", links: "teamLinks", header: "teamHeader" };
		const opponentHTMLIds = { table: "oppTable", links: "oppLinks", header: "oppHeader" };

		// Colors representing possible player match results. DWP Deprecate
		const colorMap = {
			'0,3': 'crimson', '0,2': 'red', '1,2': 'lightcoral', '2,1': 'forestgreen', '2,0': 'mediumseagreen', '3,0': 'limegreen',

		};

		//  Make teamname friendly as an html link
		function fixName(teamName) {
			return teamName.replace(/\'/g, '');
		}

		function genLinkName(teamName, teamOrOpponent) {
			// Add link to this team
			let unquotedName = fixName(teamName);
			return unquotedName + `${teamOrOpponent}`;
		}

		window.onload = function () {
			const teamNames = [...opponentTeams()];
			console.log("window.onload() list of team names:");
			console.dir(teamNames);
			const matches = teamMatches(allSessions);

			// initialize drop-downs for session selections
			initSessionSelect();
			// Add links at top of page to opponent data
			addLinks(teamNames, opponentHTMLIds['links'], 1);
			addLinks(teamNames, teamHTMLIds['links'], 0);

			// Tables based on opponent member performance
			let teamData = orderByOpponents(teamNames, matches);
			console.log("Team Data:")
			console.dir(teamData);
			buildResultsTable(teamNames, teamData, opponentHTMLIds, 1);
			// Tables based on team member performance
			teamData = orderByTeamMembers(teamNames, matches);
			buildResultsTable(teamNames, teamData, teamHTMLIds, 0);
			swapTables(0);
			initDashboardEnhancements();
		};
		//
		//  Cycle through teams creating a wins/losses chart for each
		//
		function buildResultsTable(teamNames, teamData, DOMId, opponent) {
			console.log("buildResultsTable()");
			console.dir(teamData);
			let table_ = document.getElementById(DOMId['table']);
			table_.textContent = ''
			table_.appendChild(document.createElement('br'));

			console.log('List of opponent team names');
			console.dir(teamNames);
			for (let name of teamNames) {
				console.log("Building table for team " + name);
				let teamTable_ = document.createElement('table');
				teamTable_.classList.add('TeamTable');
				teamTable_.dataset.teamName = name;

				const matches = teamData[name];
				if (matches == undefined) continue;
				let matchDates = matches.results.map(result => { return result.date }).sort();
				let matchLinks = matches.results.map(result => { return result.linkedDate }).sort()
				teamTable_.appendChild(document.createElement("tr"));

				let teamNode_ = document.createElement("th");
				teamTable_.appendChild(teamNode_);

				// Add link to this team

				let linkName = genLinkName(name, opponent); // fixName(name);
				teamTable_.dataset.teamId = linkName;
				teamNode_.innerHTML = `<h2 id="${linkName}"><button type="button" class="team-toggle" data-team-id="${linkName}" aria-expanded="true"><span>${name}</span><span class="material-icons" aria-hidden="true">expand_more</span></button></h2>`;

				let playerHeader_ = document.createElement("th");
				playerHeader_.innerHTML = "Player";
				playerHeader_.classList.add('Header');
				teamTable_.appendChild(playerHeader_);

				// Header with links to score sheets.
				let i = 0;
				matchDates.forEach(date => {
					let cell_ = document.createElement("th");
					cell_.innerHTML = matchLinks[i];
					i = i + 1;
					cell_.classList.add('Header');
					teamTable_.appendChild(cell_);
				});

				matchDates = matches.results.map(result => { return result.date }).sort();
				console.log("Match Dates =");
				console.dir(matchDates);
				// Player totals
				let totalNode_ = document.createElement('td');
				totalNode_.innerHTML = "<b>Match total</b>";
				totalNode_.style.width = '60px'
				teamTable_.appendChild(totalNode_);

				// Add player matches
				let players = Object.keys(matches).sort();
				for (let player of players) {
					addPlayer(teamTable_, player, matches, matchDates);
				}

				// Add summary score row
				teamTable_.appendChild(document.createElement("tr"));

				// Empty cells for Team column and player name column
				teamTable_.appendChild(document.createElement("th"));
				teamTable_.appendChild(document.createElement("th"));

				let cumulativeScore = [];
				// Determine score for each match played against this team
				matchDates.forEach(date => {
					console.log("Updating table for date: " + date);
					//console.dir(date);
					let score_ = document.createElement("th");
					let matchScore = matches.results.find(score => { return score.date == date }).score;
					console.log('Total match Score:');
					console.dir(matchScore);
					score_.innerHTML = matchScore;
					teamTable_.appendChild(score_);
					cumulativeScore.push(parseScore(matchScore));
				});
				let matchTotal_ = teamTable_.appendChild(document.createElement("th"));

				let total = sumScores(cumulativeScore)
				console.dir(total);
				matchTotal_.innerHTML = total.join('-')

				table_.appendChild(teamTable_);
				table_.appendChild(document.createElement("br"));
			}
		}

		// Modify the table with the current player
		function addPlayer(table_, player, matches, teamMatchDates) {
			//		console.log('addPlayer()');

			if (player == 'results' || player == '' || player == 'undefined' || player.toLowerCase() == "forfeit") return;

			teamMatchDates = teamMatchDates.sort();
			let playerMatches = matches[player].sort((a, b) => {
				return (a.date > b.date) ? 1 : -1;
			})

			let playerNode_ = table_.appendChild(document.createElement("tr"));
			playerNode_.appendChild(document.createElement("td"));

			let nameNode_ = document.createElement("td");
			//		console.log('...Player Name: ' + player);
			nameNode_.innerHTML = player;
			playerNode_.appendChild(nameNode_);

			for (let matchDate in teamMatchDates) {
				let scoreNode_ = document.createElement("td");
				let innerTable_ = document.createElement('table');

				let matchesThisDate = playerMatches.filter(match => {
					return (match.date == teamMatchDates[matchDate])
				});

				matchesThisDate.map(match => {
					formatMatchCell(match, innerTable_, matches['teamOrOpponent']);
				});
				innerTable_.classList.add('innerCell');
				scoreNode_.classList.add('scoreNode');
				scoreNode_.appendChild(innerTable_);
				playerNode_.appendChild(scoreNode_);
			}
			let totalScoreNode_ = document.createElement('td');
			totalScoreNode_.innerHTML = sumMatches(playerMatches).join('-');
			playerNode_.appendChild(totalScoreNode_);
		}
		//
		// Set the contents of an individual match cell
		//
		function formatMatchCell(match, tdCell_) {

			tdCell_.appendChild(document.createElement('tr'));
			let node_ = document.createElement('td');
			// Always show score in how it relates to our team (not a bug!)
			node_.innerHTML = `${match.player}: [${match.rank}]<br>${format_score(match.result)}<br>${match.opponent.split(' ')[0]}: [${match.oppRank}]`;
			node_.style.textAlign = 'center';
			node_.style.backgroundColor = colorMap[match.result.toString()];
			tdCell_.appendChild(node_);
		}

		//
		//  Organize match data by opponent team and (our) team member: {opponentTeam : {teamMember : [matches, ...]}, {teamMember : [matches, ...]}, ...}
		//
		function orderByTeamMembers(opponentList, matches = allSessions) {
			console.log("orderByTeamMembers()");
			let results = {};   // {team : {player1 : [matches], player2 : [matches], ...}}
			matches.forEach(teamMatch => {
				if (future(teamMatch.date)) { return; }
				//			let oppMatches = matches.filter(match => {return (match.opponent == teamMatch.opponent) && !future(match.date);});
				if (!results.hasOwnProperty(teamMatch.opponent)) {
					results[teamMatch.opponent] = {};
					results[teamMatch.opponent].results = [];
				}
				const data = { 'date': teamMatch.date, 'score': teamMatch.score, 'link': teamMatch.linkedDate };
				results[teamMatch.opponent].results.push(data);
				teamMatch.matches.forEach(game => {

					if (!results[teamMatch.opponent].hasOwnProperty(game.player)) {
						results[teamMatch.opponent][game.player] = [];
					}

					results[teamMatch.opponent][game.player].push({
						'date': teamMatch.date,
						'result': game.result,
						'oppRank': game.rank,
						'player': game.opponent,
						'opponent': game.player,
						'rank': game.oppRank
					});
				});
			});

			return results;
		};
		//
		//  Organize match data by opponent team and team member: {opponentTeam : {oppTeamMember : [matches, ...]}, {oppTeamMember : [matches, ...]}, ...}
		//	// Takes [] of opposing teams
		//
		function orderByOpponents(opponentList, matches = allSessions) {
			console.log('orderByOpponents()');
			let rivalTeams = {};

			matches.forEach(match => {
				let rivalTeam = match.opponent;
				if (!rivalTeams.hasOwnProperty(rivalTeam) && opponentList.includes(rivalTeam)) {
					rivalTeams[rivalTeam] = {};
					rivalTeams[rivalTeam].results = [];
				}
				if (future(match.date)) return;

				const data = { 'date': match.date, 'score': match.score, 'APALink': match.APALink, 'linkedDate' : match.linkedDate };
				//			console.dir(data);
				rivalTeams[rivalTeam].results.push(data);
				const individualMatches = match.matches;

				for (let game of individualMatches) {
					let opp = game.opponent;
					if (!rivalTeams[rivalTeam].hasOwnProperty(opp)) {
						rivalTeams[rivalTeam][opp] = [];
					}
					rivalTeams[rivalTeam][opp].push({
						'date': match.date,
						'player': game.player,
						'result': game.result,
						'oppRank': game.oppRank,
						'rank': game.rank,
						'opponent': game.opponent
					});
				}
			});

			return rivalTeams;
		}

		// Swap between ordering by team members or by opponents
		function swapTables(which) {
			let oppTable = document.getElementById('opponentChart');
			let teamTable = document.getElementById('teamChart');
			let oppHeader = document.getElementById('oppLinks');
			let teamHeader = document.getElementById('teamLinks');
			oppTable.style.visibility = (which) ? 'collapse' : 'visible';
			oppHeader.style.visibility = (which) ? 'collapse' : 'visible';
			teamTable.style.visibility = (which) ? 'visible' : 'collapse';
			teamHeader.style.visibility = (which) ? 'visible' : 'collapse';
		}

		//  Create table with links to opponent tables
		function addLinks(teams, tableId, orderByOpponent) {
			// Add quick links to each team section. These links now open the
			// section if it is collapsed, then scroll to the team heading.
			console.log('addOpponentLinks()');

			let sortedTeamNames = [...teams].sort();
			let container = document.getElementById(tableId);
			container.innerHTML = '';
			container.classList.add('team-selector-wrap');

			sortedTeamNames.forEach(team => {
				let linkID = genLinkName(team, orderByOpponent);
				let anchor = document.createElement('a');
				anchor.className = 'team-anchor';
				anchor.href = '#' + linkID;
				anchor.textContent = team;
				anchor.onclick = function () { openTeamSection(linkID, true); };
				container.appendChild(anchor);
			});
		}


		// Set up drop-downs for specifying start and end sessions.
		function initSessionSelect() {
			let start_ = document.getElementById('startingSession');
			let end_ = document.getElementById('endingSession');
			//	start_.onchange = handleSessionSelect;
			//	end_.onchange   = handleSessionSelect;
			inOrderSessions.forEach(session => {
				let startSession_ = document.createElement("option");
				let endSession_ = document.createElement("option");
				startSession_.text = session.name;
				endSession_.text = session.name;
				start_.add(startSession_);
				end_.add(endSession_);
			});
			start_.value = inOrderSessions[0].name;
			end_.value = inOrderSessions[inOrderSessions.length - 1].name;
		}

		// Update charts based on sessions selected
		function handleSessionSelect(startOrEnd) {
			console.log("handleSessionSelect()");
			const main_ = document.querySelector('main.table-fade');
			if (main_) main_.classList.add('is-refreshing');

			let start = document.getElementById('startingSession').value;
			let end = document.getElementById('endingSession').value;

			if (sessionCompare(start, end) == -1) {  // End Session is earlier than start session
				console.log("Start is later than End");
				if (startOrEnd == 1) {
					document.getElementById('startingSession').value = end;
					end = start;
				} else {
					console.log("End updated");
					document.getElementById('endingSession').value = start;
					start = end;
				}
			}
			const sessions = limitSessions(inOrderSessions, getSessionByName(start), getSessionByName(end));
			const matches = teamMatches(sessions);
			console.log("Team Matches by Session:");
			console.dir(matches);
			const teamNames = [...opponentTeams(sessions)];

			// Tables based on opponent member performance

			const teamData = orderByOpponents(teamNames, matches);
			buildResultsTable(teamNames, teamData, opponentHTMLIds, 1);

			// Tables based on team member performance
			const opponentData = orderByTeamMembers(teamNames, matches);
			buildResultsTable(teamNames, opponentData, teamHTMLIds, 0);

			// Redo links since # of opponents may have changed
			document.getElementById(opponentHTMLIds['links']).innerHTML = '';
			document.getElementById(teamHTMLIds['links']).innerHTML = '';

			addLinks(teamNames, opponentHTMLIds['links'], 1);
			addLinks(teamNames, teamHTMLIds['links'], 0);
			refreshDashboardEnhancements();
			window.setTimeout(() => { if (main_) main_.classList.remove('is-refreshing'); }, 120);
		}

		const dashboardState = {
			activeTable: 0,
			collapsedTeamIdsByView: { opponent: new Set(), team: new Set() },
			sortColumn: null,
			sortDirection: 1
		};

		function saveDashboardState() {
			try {
				localStorage.setItem('opponents8.dashboardState', JSON.stringify({
					activeTable: dashboardState.activeTable,
					start: document.getElementById('startingSession')?.value || '',
					end: document.getElementById('endingSession')?.value || '',
					search: document.getElementById('tableSearch')?.value || '',
					collapsedOpponentTeams: Array.from(dashboardState.collapsedTeamIdsByView.opponent),
					collapsedTeamMemberTeams: Array.from(dashboardState.collapsedTeamIdsByView.team)
				}));
			} catch (err) {
				console.log('Unable to save dashboard state');
				console.dir(err);
			}
		}

		function loadDashboardState() {
			try {
				return JSON.parse(localStorage.getItem('opponents8.dashboardState')) || {};
			} catch (err) {
				console.log('Unable to load dashboard state');
				console.dir(err);
				return {};
			}
		}

		function activeTeamStateKey() {
			return dashboardState.activeTable ? 'team' : 'opponent';
		}

		function enhancedSwapTables(which) {
			const main_ = document.querySelector('main.table-fade');
			if (main_) main_.classList.add('is-refreshing');
			dashboardState.activeTable = which;
			swapTables(which);
			applySavedCollapseState();
			applyTableSearch();
			updateSummaryCards();
			saveDashboardState();
			window.setTimeout(() => { if (main_) main_.classList.remove('is-refreshing'); }, 120);
		}

		function visibleChart() {
			return dashboardState.activeTable ? document.getElementById('teamChart') : document.getElementById('opponentChart');
		}

		function currentTeamTables() {
			const chart = visibleChart();
			return Array.from(chart ? chart.querySelectorAll('table.TeamTable') : [])
				.filter(table => table.id !== 'oppTable' && table.id !== 'teamTable');
		}

		function countPlayerRows(teamTable) {
			return Array.from(teamTable.rows).filter(row => {
				return row.style.display !== 'none' && row.cells.length > 2 && row.cells[1] && row.cells[1].textContent.trim() && !row.cells[1].querySelector('h2');
			}).length;
		}

		function updateSummaryCards() {
			const tables = currentTeamTables().filter(table => table.style.display !== 'none');
			const openTables = tables.filter(table => !table.classList.contains('is-collapsed'));
			const players = openTables.reduce((count, table) => count + countPlayerRows(table), 0);
			const sessions = document.getElementById('startingSession') && document.getElementById('endingSession')
				? `${document.getElementById('startingSession').value} → ${document.getElementById('endingSession').value}`
				: 'All';
			document.getElementById('summaryTeams').textContent = `${openTables.length}/${tables.length}`;
			document.getElementById('summaryPlayers').textContent = players;
			document.getElementById('summaryView').textContent = dashboardState.activeTable ? 'Team Member' : 'Opponent';
			document.getElementById('summarySessions').textContent = sessions;
		}

		function tableMatchesSearch(table, query) {
			if (!query) return true;
			return Array.from(table.rows).some(row => {
				const isPlayerRow = row.cells.length > 2 && row.cells[1] && row.cells[1].textContent.trim() && !row.cells[1].querySelector('h2');
				return isPlayerRow && row.textContent.toLowerCase().includes(query);
			});
		}

		function applyTableSearch() {
			const searchBox = document.getElementById('tableSearch');
			const query = searchBox ? searchBox.value.trim().toLowerCase() : '';
			let visibleTeamCount = 0;
			let visibleRowCount = 0;

			currentTeamTables().forEach(table => {
				const teamHasMatch = tableMatchesSearch(table, query);
				table.style.display = teamHasMatch ? '' : 'none';
				if (!teamHasMatch) return;
				visibleTeamCount += 1;

				// When searching, expand matching teams so the matching rows are visible.
				if (query) setTeamCollapsed(table, false, false);

				Array.from(table.rows).forEach(row => {
					const isPlayerRow = row.cells.length > 2 && row.cells[1] && row.cells[1].textContent.trim() && !row.cells[1].querySelector('h2');
					if (!isPlayerRow) return;
					const matched = !query || row.textContent.toLowerCase().includes(query);
					row.style.display = matched ? '' : 'none';
					if (matched && !table.classList.contains('is-collapsed')) visibleRowCount += 1;
				});
			});

			const status = document.getElementById('resultStatus');
			if (status) status.textContent = query ? `${visibleTeamCount} matching teams, ${visibleRowCount} matching player rows` : `${visibleTeamCount} teams shown`;
			const noResults = document.getElementById('noResults');
			if (noResults) noResults.style.display = visibleTeamCount === 0 ? 'block' : 'none';
			updateSummaryCards();
			saveDashboardState();
		}

		function setTeamCollapsed(table, collapsed, shouldSave = true) {
			if (!table) return;
			table.classList.toggle('is-collapsed', collapsed);
			const button = table.querySelector('.team-toggle');
			if (button) button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
			const key = activeTeamStateKey();
			if (collapsed) dashboardState.collapsedTeamIdsByView[key].add(table.dataset.teamId);
			else dashboardState.collapsedTeamIdsByView[key].delete(table.dataset.teamId);
			if (shouldSave) {
				updateSummaryCards();
				saveDashboardState();
			}
		}

		function toggleTeamSection(button) {
			const table = button.closest('table.TeamTable');
			setTeamCollapsed(table, !table.classList.contains('is-collapsed'));
		}

		function openTeamSection(teamId, scrollToTeam) {
			const table = currentTeamTables().find(item => item.dataset.teamId === teamId);
			if (!table) return;
			setTeamCollapsed(table, false);
			if (scrollToTeam) {
				window.setTimeout(() => {
					const heading = document.getElementById(teamId);
					if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 0);
			}
		}

		function setAllTeamSections(collapsed) {
			currentTeamTables().forEach(table => {
				if (table.style.display !== 'none') setTeamCollapsed(table, collapsed, false);
			});
			updateSummaryCards();
			saveDashboardState();
		}

		function applySavedCollapseState() {
			const collapsedIds = dashboardState.collapsedTeamIdsByView[activeTeamStateKey()];
			currentTeamTables().forEach(table => setTeamCollapsed(table, collapsedIds.has(table.dataset.teamId), false));
		}

		function enableTeamAccordions() {
			Array.from(document.querySelectorAll('.team-toggle')).forEach(button => {
				button.onclick = function () { toggleTeamSection(button); };
			});
			applySavedCollapseState();
		}


		function sortTeamTable(teamTable, columnIndex, direction) {
			const rows = Array.from(teamTable.rows);
			const playerRows = rows.filter(row => row.cells.length > 2 && row.cells[1] && !row.cells[1].querySelector('h2'));
			playerRows.sort((a, b) => {
				const aValue = (a.cells[columnIndex]?.textContent || '').trim().toLowerCase();
				const bValue = (b.cells[columnIndex]?.textContent || '').trim().toLowerCase();
				return aValue.localeCompare(bValue, undefined, { numeric: true }) * direction;
			});
			playerRows.forEach(row => teamTable.appendChild(row));
		}

		function enableTableSorting() {
			Array.from(document.querySelectorAll('table.TeamTable')).forEach(teamTable => {
				if (teamTable.id === 'oppTable' || teamTable.id === 'teamTable') return;
				Array.from(teamTable.querySelectorAll('th.Header')).forEach((header, index) => {
					header.title = 'Click to sort this team table';
					header.onclick = function () {
						const columnIndex = index + 1;
						dashboardState.sortDirection = dashboardState.sortColumn === columnIndex ? dashboardState.sortDirection * -1 : 1;
						dashboardState.sortColumn = columnIndex;
						Array.from(teamTable.querySelectorAll('th.Header')).forEach(th => th.classList.remove('sort-asc', 'sort-desc'));
						header.classList.add(dashboardState.sortDirection === 1 ? 'sort-asc' : 'sort-desc');
						sortTeamTable(teamTable, columnIndex, dashboardState.sortDirection);
					};
				});
			});
		}

		function refreshDashboardEnhancements() {
			enableTeamAccordions();
			enableTableSorting();
			applyTableSearch();
			updateSummaryCards();
		}

		function resetDashboardFilters() {
			const searchBox = document.getElementById('tableSearch');
			if (searchBox) searchBox.value = '';
			dashboardState.sortColumn = null;
			dashboardState.sortDirection = 1;
			dashboardState.collapsedTeamIdsByView.opponent.clear();
			dashboardState.collapsedTeamIdsByView.team.clear();
			try { localStorage.removeItem('opponents8.dashboardState'); } catch (err) {}
			applySavedCollapseState();
			applyTableSearch();
		}

		function initDashboardEnhancements() {
			const saved = loadDashboardState();
			const searchBox = document.getElementById('tableSearch');
			dashboardState.collapsedTeamIdsByView.opponent = new Set(saved.collapsedOpponentTeams || []);
			dashboardState.collapsedTeamIdsByView.team = new Set(saved.collapsedTeamMemberTeams || []);
			if (saved.start && document.getElementById('startingSession')) document.getElementById('startingSession').value = saved.start;
			if (saved.end && document.getElementById('endingSession')) document.getElementById('endingSession').value = saved.end;
			if ((saved.start || saved.end) && document.getElementById('startingSession') && document.getElementById('endingSession')) {
				handleSessionSelect(0);
			}
			if (searchBox && saved.search) searchBox.value = saved.search;
			if (saved.activeTable === 1) {
				document.querySelectorAll('input[name="select"]')[1].checked = true;
				dashboardState.activeTable = 1;
				swapTables(1);
			}
			if (searchBox) searchBox.addEventListener('input', applyTableSearch);
			refreshDashboardEnhancements();
		}
