// 🎲 Test Daily Click Rate Variation
// This shows what click rates look like for next 30 days

function getDailyClickRates(dayOffset = 0) {
  const now = new Date();
  now.setDate(now.getDate() + dayOffset);
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const seed = dayOfYear;
  
  const random1 = Math.sin(seed * 12.9898) * 43758.5453;
  const random2 = Math.sin(seed * 78.233) * 43758.5453;
  const decimal1 = random1 - Math.floor(random1);
  const decimal2 = random2 - Math.floor(random2);
  
  const baseRate = 8 + (decimal1 * 4);
  const extraPrecision = decimal2 * 0.9999;
  const finalRate = baseRate + extraPrecision;
  const clampedRate = Math.min(12, Math.max(8, finalRate));
  
  let pattern = '';
  if (clampedRate < 9) {
    pattern = 'Low Activity Day';
  } else if (clampedRate < 10) {
    pattern = 'Normal Day';
  } else if (clampedRate < 11) {
    pattern = 'Busy Day';
  } else {
    pattern = 'Peak Activity Day';
  }
  
  const decimals = (seed % 2 === 0) ? 3 : 4;
  const displayRate = clampedRate.toFixed(decimals);
  
  return {
    dayOfYear: dayOfYear,
    displayRate: displayRate,
    pattern: pattern,
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║                                                               ║');
console.log('║        🎲 DAILY CLICK RATE PREVIEW - NEXT 30 DAYS            ║');
console.log('║                                                               ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('📊 This shows how click rates will vary naturally over time:\n');
console.log('─────────────────────────────────────────────────────────────────');

for (let i = 0; i < 30; i++) {
  const rates = getDailyClickRates(i);
  const dayLabel = i === 0 ? '👉 TODAY' : `Day +${i}`;
  
  // Format with spacing
  const dateStr = rates.date.padEnd(20);
  const rateStr = `${rates.displayRate}%`.padEnd(10);
  const patternStr = rates.pattern.padEnd(20);
  
  console.log(`${dayLabel.padEnd(10)} ${dateStr} ${rateStr} ${patternStr}`);
}

console.log('─────────────────────────────────────────────────────────────────');

// Calculate statistics
let total = 0;
let min = 100;
let max = 0;
for (let i = 0; i < 30; i++) {
  const rates = getDailyClickRates(i);
  const rate = parseFloat(rates.displayRate);
  total += rate;
  min = Math.min(min, rate);
  max = Math.max(max, rate);
}
const avg = total / 30;

console.log('\n📈 STATISTICS FOR NEXT 30 DAYS:\n');
console.log(`   Average Click Rate: ${avg.toFixed(4)}%`);
console.log(`   Lowest Day: ${min.toFixed(4)}%`);
console.log(`   Highest Day: ${max.toFixed(4)}%`);
console.log(`   Range: ${(max - min).toFixed(4)}%`);

console.log('\n✅ All rates are between 8-12% - PERFECT for Adsterra!');
console.log('✅ Each day is different - looks 100% natural!');
console.log('✅ Decimal precision makes it look like real analytics!\n');

console.log('═══════════════════════════════════════════════════════════════');
console.log('         Run "node test-daily-rates.js" anytime to preview');
console.log('═══════════════════════════════════════════════════════════════\n');
