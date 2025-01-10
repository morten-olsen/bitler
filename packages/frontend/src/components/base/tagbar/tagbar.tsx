import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useCallback, useMemo, useState } from "react";
import clsx from 'clsx'
import { Chip } from '@nextui-org/react';

type TagbarProps<T> = {
  selected?: string[];
  items: T[];
  getKey: (item: T) => string;
  filter?: (query: string, item: T) => boolean;
  onSelectedChange?: (items: string[]) => void;
  children: (item: T) => React.ReactNode;
};

function Tagbar<T>({ selected, onSelectedChange, filter, items, getKey, children }: TagbarProps<T>) {
  const [inputValue, setInputValue] = useState('');

  const selectedItems = useMemo(
    () => {
      if (!selected) {
        return [];
      }
      return selected.map((key) => items.find((item) => getKey(item) === key)).filter(Boolean) as T[];
    },
    [selected, items, getKey],
  );

  const filtered = useMemo(
    () => {
      if (!inputValue) {
        return items.filter((item) => !selectedItems.includes(item));
      }
      return items.filter((item) => {
        if (selected && selected.includes(getKey(item))) {
          return false;
        }
        if (filter) {
          return filter(inputValue, item);
        }
        const key = getKey(item);
        return key.toLowerCase().includes(inputValue);
      })
    },
    [inputValue, items, filter, getKey],
  );

  const onSelect = useCallback(
    (key: T | null) => {
      if (!key) {
        return;
      }
      setInputValue('');
      onSelectedChange?.([...new Set([...(selected || []), getKey(key)])])
    },
    [onSelectedChange, selected],
  );

  return (
    <div className="flex flex-wrap gap-1">
      {selectedItems.map((item) => (
        <Chip
          className="h-12 rounded-lg"
          key={getKey(item)}
          size="lg"
          onClose={() => {
            onSelectedChange?.((selected || []).filter((key) => key !== getKey(item)));
          }}
        >
          {children(item)}
        </Chip>
      ))}
      <Combobox value={selected} onChange={onSelect as any} immediate onClose={() => setInputValue('')}>
        <div className="relative">
          <ComboboxInput
            className={clsx(
              'w-full rounded-lg border-none bg-default-50 py-1.5 pr-8 pl-3 text-sm/6',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
            placeholder="Select..."
            displayValue={() => ''}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </div>
        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'rounded-xl border border-black/5 bg-default-100 p-1 z-[10000]',
            // 'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
          )}
        >
          {filtered.map((item) => (
            <ComboboxOption
              key={getKey(item)}
              value={item}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-primary-100"
            >
              <div>{children(item)}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox >
    </div >
  );
}

export { Tagbar };
