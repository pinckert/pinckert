

const currentSession =
{
	format: "9-ball",
	year: 2026,
	term: 'Fall',
	leagueName: "Humprheys - (241)",
	region: "Sacramento APA",
	get name() { return `${this.term} ${this.year}` },
	finish: [0, 0],
	matches: [
		{
			date: '2026/08/20',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'The Odd Balls',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634415',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Ammoron Andrus',	  	result: [13,7], pf: 55, pa: 44, rank: 7, oppRank: 7, opponent: 'Devon Radke' },
				{ player: 'Dean Pinckert',		result: [12,8], pf: 31, pa: 24, rank: 4, oppRank: 3, opponent: 'Ruth Mcdougal' },
				{ player: 'Maria Fogle',		result: [8,12], pf: 17, pa: 46, rank: 2, oppRank: 6, opponent: 'Ronald Hubbartt' },
				{ player: 'Andrew Fulikawa',	result: [4,16], pf: 17, pa: 25, rank: 4, oppRank: 3, opponent: 'Xavier Silva' },
				{ player: 'Robert Valim',		result: [5,15], pf: 31, pa: 25, rank: 6, oppRank: 3, opponent: 'Karyn Baker' }
			]
		},
		{
			date: '2026/08/27',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Cue Crew',APALink: 'https://league.poolplayers.com/Sacramento/match/51634418',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Johnson Lau',		result: [7,13], pf: 44, pa: 55, rank: 7, oppRank: 6, opponent: 'Bob Randolph' },
				{ player: 'Maria Fogle',		result: [2,18], pf: 6, pa: 19, rank: 2, oppRank: 3, opponent: 'Trang Nguyen' },
				{ player: 'Dean Pinckert',      result: [8,12], pf: 30, pa: 19, rank: 4, oppRank: 2, opponent: 'Jennifer Blanchard' },
				{ player: 'Kimberly Lucchesi ',	result: [13,7], pf: 31, pa: 25, rank: 4, oppRank: 3, opponent: 'Audrey Amundsen' },
				{ player: 'Andrew Fulikawa',	result: [14,6], pf: 31, pa: 29, rank: 4, oppRank: 5, opponent: 'Wes Fujii' }
			]
		},
				{
			date: '2026/09/03',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Nice Shot',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634421',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Robert Valim',		result: [8,12], pf: 42, pa: 25, rank: 6, oppRank: 3, opponent: 'Kimberly Gudino' },
				{ player: 'Dean Pinckert',      result: [4,16], pf: 15, pa: 14, rank: 4, oppRank: 1, opponent: 'Toby McGilvray' },
				{ player: 'Kimberly Lucchesi',	result: [8,12], pf: 15, pa: 19, rank: 2, oppRank: 2, opponent: 'Julian Duarte' },
				{ player: 'Ammoron Andrus',	    result: [4,16], pf: 31, pa: 31, rank: 7, oppRank: 4, opponent: 'Thomas Funk' },
//				{ player: 'Aimee Wood',      	result: [16,4], pf: 19, pa: 10, rank: 2, oppRank: 2, opponent: 'Vincent Walker' },
			]
		},
		{
			date: '2026/09/10',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Big Win Energy!',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634423',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Robert Valim',		result: [14,6], pf: 46, pa: 34, rank: 6, oppRank: 6, opponent: 'Kaleo Ross' },
				{ player: 'Dean Pinckert',      result: [12,8], pf: 31, pa: 30, rank: 4, oppRank: 4, opponent: 'Hasheem Whitmore' },
				{ player: 'Maria Fogle',		result: [7,13], pf: 15, pa: 19, rank: 2, oppRank: 2, opponent: 'Antoine Dunn' },
				{ player: 'Johnson Lau',	    result: [12,8], pf: 55, pa: 73, rank: 7, oppRank: 9, opponent: 'Brandon Gilham' },
				{ player: 'Aimee Wood',      	result: [16,4], pf: 19, pa: 10, rank: 2, oppRank: 2, opponent: 'Vincent Walker' },
			]
		},
		{
			date: '2026/09/17',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Unusual Suspects',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634425',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Robert Valim',		result: [16,4], pf: 46, pa: 18, rank: 6, oppRank: 4, opponent: 'David Willer' },
				{ player: 'Dean Pinckert',      result: [5,15], pf: 21, pa: 31, rank: 4, oppRank: 4, opponent: 'Sam Macapagal' },
				{ player: 'Maria Fogle',		result: [3,17], pf:  8, pa: 25, rank: 2, oppRank: 3, opponent: 'Karen Hart' },
				{ player: 'Ammoron Andrus',	    result: [4,16], pf: 28, pa: 46, rank: 7, oppRank: 6, opponent: 'Joshua Newman' },
				{ player: 'Aimee Wood',      	result: [4,16], pf: 10, pa: 31, rank: 2, oppRank: 4, opponent: 'Amber Trammell' },
			]
		},
		{
			date: '2026/09/24',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'The Odd Balls',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634430',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Robert Valim',		result: [12,8], pf: 46, pa: 37, rank: 6, oppRank: 5, opponent: 'Jason Ryan' },
				{ player: 'Dean Pinckert',      result: [6,14], pf: 23, pa: 31, rank: 4, oppRank: 4, opponent: 'Cynthia Currie' },
				{ player: 'Maria Fogle',		result: [15,5], pf: 12, pa: 25, rank: 2, oppRank: 3, opponent: 'Karyn Baker' },
				{ player: 'Johnson Lau',	    result: [5,15], pf: 34, pa: 46, rank: 7, oppRank: 6, opponent: 'Ronald Hubbartt' },
			]
		},
		{
			date: '2026/10/01',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Cue Crew',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634433',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Kimberly Lucchesi', result: [7, 13], pf: 25, pa: 31, rank: 4, oppRank: 4, opponent: 'Grace Kennedy' },
				{ player: 'Dean Pinckert', result: [6, 14], pf: 24, pa: 31, rank: 4, oppRank: 4, opponent: 'Trang Nguyen' },
				{ player: 'Maria Fogle', result: [7,13], pf: 16, pa: 19, rank: 2, oppRank: 2, opponent: 'Jennifer Blanchard' },
				{ player: 'Ammoran Andrus', result: [3,17], pf: 20, pa: 46, rank: 6, oppRank: 6, opponent: 'Bob Randolph' },
			]
		},
		{
			date: '2026/10/08',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Nice Shot',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634436',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [13,7], pf: 31, pa: 25, rank: 4, oppRank: 4, opponent: 'Thomas FUnk' },
				{ player: 'Aimee Wood', result: [12,8], pf: 19, pa: 23, rank: 2, oppRank: 3, opponent: 'Kimberly Gudino' },
				{ player: 'Johnson Lau', result: [8, 12], pf: 53, pa: 75, rank: 7, oppRank: 9, opponent: 'Cody Seegert' },
			]
		},
						{
			date: '2026/10/15',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Big Win Energy!',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634438',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [14,6], pf: 31, pa: 14, rank: 4, oppRank: 2, opponent: 'Vincent Walker' },
				{ player: 'Aimee Wood', result: [6,14], pf: 14, pa: 19, rank: 2, oppRank: 2, opponent: 'Antoine Dunn' },
				{ player: 'Robert Valim', result: [4,16], pf: 26, pa: 65, rank: 6, oppRank: 8, opponent: 'Brandon Gilham' },
				{ player: 'Ammoron Andrus', result: [18, 2], pf: 46, pa: 11, rank: 6, oppRank: 4, opponent: 'Hasheem Whitmore' },
				{ player: 'Kimberly Lucchesi', result: [12,8], pf: 31, pa: 29, rank: 4, oppRank: 4 , opponent: 'Drea Arnold' },
			]
		},
				{
			date: '2026/10/22',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Unusual Suspects',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634440',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [6,14], pf: 22, pa: 31, rank: 4, oppRank: 4, opponent: 'Jinny Hilderbrand' },
				{ player: 'Aimee Wood', result: [8, 12], pf: 18, pa: 31, rank: 2, oppRank: 4, opponent: 'David Willer' },
				{ player: 'Ammoron Andrus', result: [6,14], pf: 40, pa: 25, rank: 7, oppRank: 3, opponent: 'Calvin McGhie' },
				{ player: 'Robert Valim', result: [17,3], pf: 46, pa: 13, rank: 6, oppRank: 4, opponent: 'Sam Macapagal' },
				{ player: 'Kimberly Lucchesi', result: [14,6], pf: 31, pa: 19, rank: 4, oppRank: 3, opponent: 'Karen Hart' },
			]
		},
		{
			date: '2026/10/29',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'The Odd Balls',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634445',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [14,6], pf: 31, pa: 23, rank: 4, oppRank: 4, opponent: 'Brian McLemore' },
				{ player: 'Aimee Wood', result: [12,8], pf: 19, pa: 34, rank: 2, oppRank: 5, opponent: 'Jason Ryan' },
				{ player: 'Ammoron Andrus', result: [13,7], pf: 46, pa: 39, rank: 6, oppRank: 6, opponent: 'Ronald Hubbartt' },
				{ player: 'Robert Valim', result: [12,8], pf: 46, pa: 37, rank: 6, oppRank: 5, opponent: 'Xavier Silva' },
				{ player: 'Maria Fogle', result: [14,6], pf: 19, pa: 19, rank: 2, oppRank: 3, opponent: 'Karyn Baker' },
			]
		},
				{
			date: '2026/11/05',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Cue Crew',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634448',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [16,4], pf: 31, pa: 15, rank: 4, oppRank: 4, opponent: 'Mellisa Mitchell' },
				{ player: 'Aimee Wood', result: [6,14], pf: 13, pa: 19, rank: 2, oppRank: 4, opponent: 'Grace Kennedy' },
				{ player: 'Ammoron Andrus', result: [5,15], pf: 31, pa: 46, rank: 6, oppRank: 6, opponent: 'Bob Randolph' },
				{ player: 'Robert Valim', result: [7,13], pf: 40, pa: 31, rank: 6, oppRank: 4, opponent: 'Trang Nguyen' },
				{ player: 'Maria Fogle', result: [7,13], pf: 16, pa: 25, rank: 2, oppRank: 3, opponent: 'Melissa Radmand' },
			]
		},
		{
			date: '2026/11/12',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Nice Shot',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634451',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Dean Pinckert', result: [13,7], pf: 31, pa: 21, rank: 4, oppRank: 3, opponent: 'David Cotto' },
				{ player: 'Aimee Wood', result: [17,3], pf: 19, pa: 8, rank: 2, oppRank: 2, opponent: 'Andrea Ortega-Funk' },
				{ player: 'Johnson Lau', result: [16,4], pf: 55, pa: 39, rank: 7, oppRank: 8, opponent: 'Cody Seegert' },
				{ player: 'Laurie Lau', result: [7,13], pf: 27, pa: 31, rank: 4, oppRank: 4, opponent: 'Thomas Funk' },
				{ player: 'Maria Fogle', result: [4,16], pf: 9, pa: 14, rank: 2, oppRank: 1, opponent: 'Toby McGilvray' },
			]
		},
		{
			date: '2026/11/19',
			get linkedDate() { return linkDate(this.date, this.APALink) },
			place: 'Jointed Cue Billiards',
			opponent: 'Big Win Energy!',
			APALink: 'https://league.poolplayers.com/Sacramento/match/51634453',
			get score() { return format_score(sumMatches(this.matches)) },
			matches: [
				{ player: 'Aimee Wood', result: [16,4], pf: 19, pa: 10, rank: 2, oppRank: 2, opponent: 'Antoine Dunn' },
				{ player: 'Laurie Lau', result: [13,7], pf: 31, pa: 27, rank: 4, oppRank: 4, opponent: 'Drea Arnold' },
				{ player: 'Johnson Lau', result: [12,8], pf: 55, pa: 61, rank: 7, oppRank: 8, opponent: 'Brandon Gilham' },
				{ player: 'Maria Fogle', result: [12,8], pf: 19, pa: 18, rank: 2, oppRank: 2, opponent: 'Vincent Walker' },
			]
		},
	]
}

archivedSessions = [ ];