

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
				{ player: 'Kimberly Lucchesi',	result: [2,1], pf: 3, pa: 1, rank: 4, oppRank: 3, opponent: 'Ruth Mcdougal' },
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
				{ player: 'Kimberly Lucchesi',	result: [0,2], pf: 2, pa: 4, rank: 5, oppRank: 5, opponent: 'Grace Kennedy' },
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
				{ player: 'Kimberly Lucchesi',	result: [0,2], pf: 2, pa: 4, rank: 5, oppRank: 5, opponent: 'Julian Duarte' },
				{ player: 'Robert Valim',		result: [3,0], pf: 5, pa: 0, rank: 6, oppRank: 5, opponent: 'Kimberly Gudino' },
				{ player: 'Johnson Lau',		result: [0,2], pf: 1, pa: 5, rank: 7, oppRank: 7, opponent: 'Cody Seegert' }

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
				{ player: 'Kimberly Lucchesi',	result: [0,3], pf: 0, pa: 3, rank: 5, oppRank: 4, opponent: 'Hasheem Whitmore' },
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
				{ player: 'Aimee Wood',      	result: [0,3], pf: 0, pa: 0, rank: 2, oppRank: 4, opponent: 'Jinny Hilderbrand' },
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
		{
			date: '2026/10/01',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Cue Crew',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646551',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [2, 0], pf: 3, pa: 1, rank: 4, oppRank: 4, opponent: 'Trang Nguyen' },
				{ player: 'Aimee Wood', result: [2, 0], pf: 2, pa: 2, rank: 2, oppRank: 4, opponent: 'Romesh Chand' },
				{ player: 'Johnson Lau ', result: [1, 2], pf: 4, pa: 5, rank: 7, oppRank: 7, opponent: 'Bob Randolph' },
				{ player: 'Robert Valim', result: [2,1], pf: 5, pa: 2, rank: 6, oppRank: 4, opponent: 'Grace Kennedy' },
				{ player: 'Maria Fogle', result: [3,0], pf: 2, pa: 0, rank: 3, oppRank: 3, opponent: 'Dawn Francetich' },
			]
		},
		{
			date: '2026/10/08',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Nice Shot',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646554',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [0,3], pf: 0, pa: 3, rank: 4, oppRank: 4, opponent: 'David Cotto' },
				{ player: 'Ammoron Andrus', result: [0, 2], pf: 1, pa: 5, rank: 6, oppRank: 7, opponent: 'Cody Seegert' },
				{ player: 'Kimberly Lucchesi', result: [0, 2], pf: 2, pa: 3, rank: 5, oppRank: 4, opponent: 'Thomas Funk' },
				{ player: 'Maria Fogle', result: [1, 2], pf: 1, pa: 2, rank: 3, oppRank: 3, opponent: 'Andrea Ortega-Funk' },
			]
		},
				{
			date: '2026/10/15',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Big Win Energy!',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646556',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [3,0], pf: 3, pa: 0, rank: 4, oppRank: 3, opponent: 'Vincent Walker' },
				{ player: 'Aimee Wood', result: [2,0], pf: 2, pa: 1, rank: 2, oppRank: 2, opponent: 'Antione Dunn' },
				{ player: 'Kimberly Lucchesi', result: [0, 2], pf: 2, pa: 3, rank: 5, oppRank: 4, opponent: 'Hasheem Whitmore' },
				{ player: 'Johnson Lau', result: [0, 2], pf: 2, pa: 5, rank: 7, oppRank: 7, opponent: 'Brandon Gilham' },
				{ player: 'Forfeit', result: [0, 2], pf: 0, pa: 0, rank: 0, oppRank: 0 , opponent: '' },
			]
		},
				{
			date: '2026/10/22',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Unusual Suspects',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646558',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [0,2], pf: 1, pa: 3, rank: 4, oppRank: 4, opponent: 'Calvin McGhie' },
				{ player: 'Aimee Wood', result: [3, 0], pf: 2, pa: 0, rank: 2, oppRank: 2, opponent: 'Stephanie Velasco' },
				{ player: 'Ammoron Andrus', result: [2,1], pf: 5, pa: 3, rank: 6, oppRank: 5, opponent: 'David Willer' },
				{ player: 'Robert Valim', result: [2,0], pf: 5, pa: 1, rank: 6, oppRank: 4, opponent: 'Sam Macapagal' },
				{ player: 'Kimberly Lucchesi', result: [0,3], pf: 0, pa: 3, rank: 5, oppRank: 4, opponent: 'Jinny Hilderbrand' },
			]
		},
						{
			date: '2026/10/29',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'The Odd Balls',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646563',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [2,0], pf: 3, pa: 1, rank: 4, oppRank: 5, opponent: 'Jason Ryan' },
				{ player: 'Aimee Wood', result: [2,1], pf: 2, pa: 2, rank: 3, oppRank: 4, opponent: 'Romesh Chand'},
				{ player: 'Robert Valim', result: [2,0], pf: 5, pa: 1, rank: 6, oppRank: 5, opponent: 'Xavier Silva' },
				{ player: 'Kimberly Lucchesi', result: [0,2], pf: 2, pa: 3, rank: 5, oppRank: 4, opponent: 'Karyn Baker' },
				{ player: 'Lori Lau', result: [0,2], pf: 1, pa: 2, rank: 5, oppRank: 3, opponent: 'Ruth Mcdougal' },
				
			]
		},
								{
			date: '2026/11/05',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Cue Crew',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646566',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [3,0], pf: 3, pa: 0, rank: 4, oppRank: 4, opponent: 'Mellisa Mitchell' },
				{ player: 'Aimee Wood', result: [1,2], pf: 1, pa: 3, rank: 3, oppRank: 4, opponent: 'Grace Kennedy'},
				{ player: 'Robert Valim', result: [2,1], pf: 5, pa: 1, rank: 6, oppRank: 3, opponent: 'Melissa Radmand' },
				{ player: 'Ammoron Andrus', result: [2,0], pf: 4, pa: 1, rank: 6, oppRank: 7, opponent: 'Bob Randolph' },
				{ player: 'Kimberly Lucchesi', result: [2,1], pf: 2, pa: 3, rank: 5, oppRank: 4, opponent: 'Dawn Francetich' },
			]
		},
		{
			date: '2026/11/12',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Nice Shot',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646569',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [3,0], pf: 3, pa: 0, rank: 4, oppRank: 2, opponent: 'Toby McGilvray' },
				{ player: 'Maria Fogle', result: [3,0], pf: 2, pa: 0, rank: 3, oppRank: 3, opponent: 'Andrea Ortega-Funk'},
				{ player: 'Robert Valim', result: [0,3], pf: 0, pa: 5, rank: 6, oppRank: 7, opponent: 'Alberto J Campos F' },
				{ player: 'Lori Lau', result: [0,2], pf: 1, pa: 5, rank: 5, oppRank: 7, opponent: 'Cody Seegert' },
				{ player: 'Kimberly Lucchesi', result: [2,0], pf: 3, pa: 1, rank: 4, oppRank: 4, opponent: 'David Cotto' },
			]
		},
				{
			date: '2026/11/12',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Big Win Energy!',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51646571',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Ammoron Andrus', result: [1,2], pf: 4, pa: 5, rank: 6, oppRank: 6, opponent: 'Kaleo Ross' },
				{ player: 'Maria Fogle', result: [0,3], pf: 0, pa: 2, rank: 3, oppRank: 3, opponent: 'Vincent Walker'},
				{ player: 'Robert Valim', result: [0,2], pf: 1, pa: 3, rank: 6, oppRank: 4, opponent: 'Hasheem Whitmore' },
				{ player: 'Lori Lau', result: [0,2], pf: 1, pa: 5, rank: 5, oppRank: 7, opponent: 'Brandon Gilham' },
				{ player: 'Aimee Wood', result: [2,1], pf: 3, pa: 1, rank: 3, oppRank: 2, opponent: 'Antione Dunn' },
			]
		},
	]
}


archivedSessions = [ ];
	