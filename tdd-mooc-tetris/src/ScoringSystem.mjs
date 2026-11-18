export class ScoringSystem {
  score = 0;
  lines = 0;
  level = 1;

  linesCleared(count) {
    const points = [0, 40, 100, 300, 1200][count] || count * 40;
    this.score += points * this.level;
    this.lines += count;
    this.level = Math.floor(this.lines / 10) + 1;
  }
}
