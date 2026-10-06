const finite = value => typeof value === 'number' && Number.isFinite(value);
const nonnegative = value => finite(value) && value >= 0;
function delta(subject, candidate) {
  if (!nonnegative(subject) || !nonnegative(candidate)) return null;
  const amount = candidate - subject;
  return {amount, percentage: subject > 0 ? amount / subject * 100 : null, direction: amount > 0 ? 'higher' : amount < 0 ? 'lower' : 'equal'};
}
export function candidateMetrics(subject, candidate) {
  const valueComparable = Number.isInteger(subject.TAXYR) && subject.TAXYR > 0 && subject.TAXYR === candidate.TAXYR
    && ['current_procname', 'current_value_desc'].every(key => typeof subject[key] === 'string' && subject[key].trim() && subject[key] === candidate[key]);
  const perSqFt = property => nonnegative(property.CURRENTVALUE_TOTAL) && finite(property.BLDGSQFT) && property.BLDGSQFT > 0 ? property.CURRENTVALUE_TOTAL / property.BLDGSQFT : null;
  return {
    valueComparable: Boolean(valueComparable),
    valueDelta: valueComparable ? delta(subject.CURRENTVALUE_TOTAL, candidate.CURRENTVALUE_TOTAL) : null,
    sizeDelta: delta(subject.BLDGSQFT, candidate.BLDGSQFT),
    ageDelta: delta(subject.BLDGAGE, candidate.BLDGAGE),
    lotDelta: delta(subject.LANDSF, candidate.LANDSF),
    subjectValuePerSqFt: valueComparable ? perSqFt(subject) : null,
    candidateValuePerSqFt: valueComparable ? perSqFt(candidate) : null
  };
}
const number = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2});
export function formatDelta(value) {
  if (!value) return {amount: 'Unavailable', percentage: 'Percentage unavailable', tone: 'unavailable'};
  const sign = value.amount > 0 ? '+' : value.amount < 0 ? '−' : '';
  const amount = `${sign}${number.format(Math.abs(value.amount))} ${value.direction}`;
  let percentage = 'Percentage unavailable';
  if (value.percentage !== null) {
    const percent = Math.abs(value.percentage);
    percentage = `${sign}${percent > 0 && percent < 0.1 ? '<0.1' : percent.toFixed(1)}% vs subject`;
  }
  return {amount, percentage, tone: value.direction};
}

export const disparityConfig = Object.freeze({version: 'live-median-2', minimumCount: 3, noticeable: 5, substantial: 15});

export function summarizeCandidates(subject, records = [], {searched = false, truncated = false} = {}) {
  const counts = {lower: 0, equal: 0, higher: 0}, values = [];
  for (const candidate of records) {
    const value = subject && candidateMetrics(subject, candidate).valueDelta;
    if (value) { counts[value.direction]++; values.push(candidate.CURRENTVALUE_TOTAL); }
  }
  const usable = counts.lower + counts.equal + counts.higher;
  const omitted = records.length - usable;
  values.sort((a, b) => a - b);
  const middle = Math.floor(values.length / 2);
  const median = values.length ? (values.length % 2 ? values[middle] : values[middle - 1] / 2 + values[middle] / 2) : null;
  const gap = usable >= disparityConfig.minimumCount && median > 0 ? (subject.CURRENTVALUE_TOTAL - median) / median * 100 : null;
  const percentage = finite(gap) ? gap : null;
  const band = percentage === null ? null : percentage <= 0 ? 'at-or-below' : percentage < disparityConfig.noticeable ? 'small' : percentage < disparityConfig.substantial ? 'noticeable' : 'substantial';
  const messages = {'at-or-below': "This property's value is at or below the middle of the comparison group.", small: 'A small difference in the values.', noticeable: 'A noticeable difference worth a closer look.', substantial: 'A substantial difference stands out.'};
  const message = band ? messages[band] : 'The sample cannot support a median-based summary.';
  const comparison = band ? ` The property is ${number.format(Math.abs(percentage))}% ${percentage < 0 ? 'below' : 'above'} the comparison median of ${number.format(median)}, based on ${usable} usable records.` : '';
  const scope = searched ? `This summary uses all ${records.length} examined matches, including higher values. ${truncated ? 'The source reports more records that were not examined; this is a limited sample. ' : ''}` : '';
  const version = searched ? 'live-search-median-3' : disparityConfig.version;
  return {
    disparity: {median, percentage, band, message},
    state: usable ? 'available' : 'unavailable', shown: records.length, usable, omitted, ...counts,
    explanation: usable
      ? `${scope}${message}${comparison} Of the ${usable} ${searched ? 'examined matches' : 'shown candidates'} with compatible County values, ${counts.lower} are lower, ${counts.equal} equal and ${counts.higher} higher than this property. ${omitted ? `${omitted} shown records have unusable comparison values. ` : ''}`
      : 'There are no usable compatible candidate values to summarize. This is unavailable evidence, not a conclusion about the assessment.',
    methodVersion: version, templateVersion: version
  };
}
