import { useCallback, useMemo, useState } from "react";
import { Autocomplete, AutocompleteItem, Chip } from '@nextui-org/react';

type TagbarProps<T> = {
  selected?: string[];
  items: T[];
  getKey: (item: T) => string;
  filter?: (query: string, item: T) => boolean;
  onSelectedChange?: (items: string[]) => void;
  children: (item: T) => React.ReactNode;
};

function Tagbar<T extends object>({ selected, onSelectedChange, filter, items, getKey, children }: TagbarProps<T>) {
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
    (key: string | null) => {
      if (!key) {
        return;
      }
      setInputValue('');
      onSelectedChange?.([...new Set([...(selected || []), key])])
    },
    [onSelectedChange, selected],
  );

  return (
    <div className="flex flex-wrap gap-1"
      onPointerDown={(evt) => evt.stopPropagation()}
      onMouseDown={(evt) => evt.stopPropagation()}
      onClick={(evt) => evt.stopPropagation()}
    >
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
      <Autocomplete
        className="max-w-xs"
        value={inputValue}
        onValueChange={(value) => setInputValue(value)}
        items={filtered}
        onSelectionChange={(item) => {
          onSelect(item as any);
        }}
      >
        {(item) => (
          <AutocompleteItem
            key={getKey(item)}
          >
            {children(item)}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div >
  );
}

export { Tagbar };
