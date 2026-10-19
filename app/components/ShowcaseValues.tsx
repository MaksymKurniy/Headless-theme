/**
 * What a showcase block stores, printed: one row per setting. The blocks apply
 * most values to their own markup too, but a value nobody can see (a handle, a
 * link) would otherwise be impossible to check by looking at the preview.
 */
export function ShowcaseValues({
  values,
}: {
  values: Array<[label: string, value: unknown]>;
}) {
  return (
    <dl className="showcase-values">
      {values.map(([label, value]) => (
        <div key={label} className="showcase-values__row">
          <dt>{label}</dt>
          <dd>{format(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function format(value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}
