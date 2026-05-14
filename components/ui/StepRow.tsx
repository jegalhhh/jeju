interface StepRowProps {
  step: number;
  title: string;
  description?: string;
  handNote?: string;
}

export default function StepRow({ step, title, description, handNote }: StepRowProps) {
  return (
    <div className="flex gap-4 py-[18px] border-t border-[var(--line)]">
      <div className="w-14 shrink-0 pt-0.5">
        <span className="text-label-mono text-[var(--muted)]">
          STEP {String(step).padStart(2, "0")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-headline-sm text-[var(--ink)]">{title}</p>
        {description && (
          <p className="text-body-sm text-[var(--muted)] mt-1">{description}</p>
        )}
        {handNote && (
          <p className="text-hand-md mt-2 -rotate-1">{handNote}</p>
        )}
      </div>
    </div>
  );
}
