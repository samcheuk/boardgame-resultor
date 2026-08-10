import { useEffect, useId, useRef, useState } from 'react';

export interface PlayerOption {
  name: string;
  email: string;
}

interface PlayerNameFieldProps {
  id?: string;
  value: string;
  options: PlayerOption[];
  loadError?: string | null;
  onChange: (next: { name: string; email: string | null }) => void;
}

/**
 * Combobox: free-text input with filterable whitelist dropdown on focus.
 * Selecting a whitelist option includes email; free text clears email.
 */
export function PlayerNameField({
  id,
  value,
  options,
  loadError = null,
  onChange,
}: PlayerNameFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(value.trim().toLowerCase()),
  );

  useEffect(() => {
    setHighlightIndex(0);
  }, [value, open]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  function selectOption(option: PlayerOption) {
    onChange({ name: option.name, email: option.email });
    setOpen(false);
  }

  function applyTypedName(name: string) {
    const exact = options.find(
      (option) => option.name.toLowerCase() === name.trim().toLowerCase(),
    );
    onChange({
      name,
      email: exact ? exact.email : null,
    });
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={value}
        onChange={(event) => {
          applyTypedName(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            setOpen(true);
            return;
          }

          if (!open) {
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightIndex((current) =>
              filteredOptions.length === 0
                ? 0
                : Math.min(current + 1, filteredOptions.length - 1),
            );
            return;
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightIndex((current) => Math.max(current - 1, 0));
            return;
          }

          if (event.key === 'Enter' && filteredOptions[highlightIndex]) {
            event.preventDefault();
            selectOption(filteredOptions[highlightIndex]);
            return;
          }

          if (event.key === 'Escape') {
            setOpen(false);
          }
        }}
        placeholder="Type name or filter whitelist"
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        required={false}
        autoComplete="off"
      />

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-48 w-full overflow-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {loadError ? (
            <li className="px-3 py-2 text-sm text-red-600">{loadError}</li>
          ) : options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-400">
              Whitelist is empty
            </li>
          ) : filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-400">
              No match — you can still type a custom name
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.email}
                role="option"
                aria-selected={index === highlightIndex}
              >
                <button
                  type="button"
                  className={`block w-full px-3 py-2 text-left text-sm ${
                    index === highlightIndex
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                  onMouseEnter={() => {
                    setHighlightIndex(index);
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectOption(option);
                  }}
                >
                  <span className="block font-medium">{option.name}</span>
                  <span className="block text-xs text-neutral-500">
                    {option.email}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
