

const currentSession =
{
	format: "8-ball",
	year: 2026,
	term: 'Fall',
	leagueName: "Humprheys - (141)",
	region: "Sacramento APA",
	get name() { return `${this.term} ${this.year}` },
	finish: [0, 0],
	matches: [
		{
			date: '2026/08/20',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'The Odd Balls',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646533',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert',	    result: [2,1], pf: 2, pa: 2, rank: 3, oppRank: 4, opponent: 'Brian McLemore' },
				{ player: 'Kimberly Lucchesi ',	result: [2,1], pf: 3, pa: 1, rank: 4, oppRank: 3, opponent: 'Ruth Mcdougal' },
				{ player: 'Robert Valim',		result: [1,2], pf: 4, pa: 4, rank: 6, oppRank: 5, opponent: 'Jason Ryan' },
				{ player: 'Johnson Lau',		result: [3,0], pf: 5, pa: 0, rank: 7, oppRank: 4, opponent: 'Karyn Baker' },
				{ player: 'Aimee Wood',			result: [0,3], pf: 0, pa: 4, rank: 2, oppRank: 4, opponent: 'Xavier Silva' }
			]
		},
		{
			date: '2026/08/27',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Cue Crew',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646536',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Ammoron Andrus',		result: [3,0], pf: 4, pa: 0, rank: 6, oppRank: 7, opponent: 'Bob Randolph' },
				{ player: 'Maria Fogle',		result: [3,0], pf: 2, pa: 0, rank: 3, oppRank: 3, opponent: 'Dawn Francetich' },
				{ player: 'Aimee Wood',      	result: [0,3], pf: 0, pa: 2, rank: 2, oppRank: 2, opponent: 'Jennifer Blanchard' },
				{ player: 'Kimberly Lucchesi ',	result: [0,2], pf: 2, pa: 4, rank: 5, oppRank: 5, opponent: 'Grace Kennedy' },
				{ player: 'Robert Valim',		result: [3,0], pf: 5, pa: 0, rank: 6, oppRank: 3, opponent: 'Audrey Amundsen' }
			]
		},
		{
			date: '2026/09/03',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Nice Shot',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646539',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert',		result: [2,0], pf: 2, pa: 1, rank: 3, oppRank: 4, opponent: 'Thomas Funk' },
				{ player: 'Aimee Wood',      	result: [3,0], pf: 2, pa: 0, rank: 2, oppRank: 2, opponent: 'Toby McGilvray' },
				{ player: 'Kimberly Lucchesi ',	result: [0,2], pf: 2, pa: 4, rank: 5, oppRank: 5, opponent: 'Julian Duarte' },
				{ player: 'Robert Valim',		result: [3,0], pf: 5, pa: 0, rank: 6, oppRank: 5, opponent: 'Kimberly Gudino' }
			]
		},
		{
			date: '2026/09/10',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Big Win Energy!',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646541',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Ammoron Andrus',		result: [3,0], pf: 6, pa: 0, rank: 6, oppRank: 2, opponent: 'Antione Dunn' },
				{ player: 'Aimee Wood',      	result: [3,0], pf: 2, pa: 0, rank: 2, oppRank: 3, opponent: 'Vincent Walker' },
				{ player: 'Kimberly Lucchesi ',	result: [0,3], pf: 0, pa: 3, rank: 5, oppRank: 4, opponent: 'Hasheem Whitmore' },
				{ player: 'Robert Valim',		result: [2,1], pf: 4, pa: 4, rank: 6, oppRank: 7, opponent: 'Brandon Gilham' },
				{ player: 'Maria Fogle',      	result: [0,3], pf: 0, pa: 4, rank: 3, oppRank: 5, opponent: 'Kaleo Ross' },
			]
		},
				{
			date: '2026/09/17',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Unusual Suspects',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646543',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert',		result: [2,1], pf: 3, pa: 2, rank: 4, oppRank: 4, opponent: 'Calvin McGhie' },
				{ player: 'Aimee Wood',      	result: [0,3], pf: 0, pa: 0, rank: 2, oppRank: 4, opponent: 'Jinny Hildebrand' },
				{ player: 'Johnson Lau ',		result: [0,2], pf: 1, pa: 4, rank: 7, oppRank: 6, opponent: 'Joshua Newman' },
				{ player: 'Robert Valim',		result: [2,1], pf: 5, pa: 3, rank: 6, oppRank: 5, opponent: 'David Willer' },
				{ player: 'Maria Fogle',      	result: [3,0], pf: 3, pa: 0, rank: 3, oppRank: 2, opponent: 'Stephanie Velasco' },
			]
		},
						{
			date: '2026/09/24',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'The Odd Balls',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646548',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert',		result: [2,0], pf: 3, pa: 2, rank: 4, oppRank: 5, opponent: 'Xavier Silva' },
				{ player: 'Aimee Wood',      	result: [2,0], pf: 2, pa: 2, rank: 2, oppRank: 4, opponent: 'Romesh Chand' },
				{ player: 'Johnson Lau ',		result: [0,2], pf: 1, pa: 4, rank: 7, oppRank: 6, opponent: 'Joshua Newman' },
				{ player: 'Robert Valim',		result: [1,2], pf: 4, pa: 3, rank: 6, oppRank: 4, opponent: 'Karyn Baker' },
				{ player: 'Maria Fogle',      	result: [0,3], pf: 0, pa: 3, rank: 3, oppRank: 4, opponent: 'Brian McLemore' },
			]
		},

	]
}


archivedSessions = [ ];
	