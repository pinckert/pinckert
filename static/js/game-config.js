// Game-specific configuration used by the structured pages.
// The current pages are still conservative adaptations, but this file documents
// the shared settings needed to continue merging 8-ball and 9-ball logic.
window.GameConfigs = {
  eightBall: {
    format: '8-ball',
    dataFile: 'itchyscratchy8.js',
    logo: '8-ball.jpg',
    minRank: 2,
    maxRank: 7,
    resultScores: ['0,3','0,2','1,2','2,1','2,0','3,0']
  },
  nineBall: {
    format: '9-ball',
    dataFile: 'itchyscratchy9.js',
    logo: '9-ball.jpg',
    minRank: 1,
    maxRank: 9,
    resultScores: ['0,20','1,19','2,18','3,17','4,16','5,15','6,14','7,13','8,12','12,8','13,7','14,6','15,5','16,4','17,3','18,2','19,1','20,0']
  }
};
