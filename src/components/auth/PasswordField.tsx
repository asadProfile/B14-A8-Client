'use client';

import { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Field } from '@/components/ui/Form';
import { cn } from '@/lib/utils';

const rules = [
  { label: '6+ characters', test: (value: string) => value.length >= 6 },
  { label: 'Uppercase', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Lowercase', test: (value: string) => /[a-z]/.test(value) },
];

export function PasswordField({
  id,
  label = 'Password',
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  hint,
  showChecklist = false,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  hint?: string;
  showChecklist?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} htmlFor={id} required error={error} hint={hint}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={cn('field pr-12', error && 'field-error')}
          required
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-elevated hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showChecklist && (
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Password requirements">
          {rules.map((rule) => {
            const met = rule.test(value);
            return (
              <li
                key={rule.label}
                className={cn(
                  'inline-flex items-center gap-1.5 text-[0.68rem] font-medium transition',
                  met ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted',
                )}
              >
                <span
                  className={cn(
                    'grid h-3.5 w-3.5 place-items-center rounded-full border',
                    met ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-line',
                  )}
                >
                  {met && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </Field>
  );
}
