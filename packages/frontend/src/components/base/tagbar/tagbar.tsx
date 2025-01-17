import React, { useCallback, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteItem, Chip } from '@nextui-org/react';

type TagbarProps<T> = {
  label?: string;
  selected?: string[];
  items: T[];
  getKey: (item: T) => string;
  filter?: (query: string, item: T) => boolean;
  onSelectedChange?: (items: string[]) => void;
  renderOption: (item: T) => React.ReactNode;
  renderSelection?: (item: T) => React.ReactNode;
};

function Tagbar<T extends object>({
  label,
  selected,
  onSelectedChange,
  filter,
  items,
  getKey,
  renderOption,
  renderSelection,
}: TagbarProps<T>) {
  const [inputValue, setInputValue] = useState('');

  const selectedItems = useMemo(() => {
    if (!selected) {
      return [];
    }
    return selected.map((key) => items.find((item) => getKey(item) === key)).filter(Boolean) as T[];
  }, [selected, items, getKey]);

  const filtered = useMemo(() => {
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
    });
  }, [inputValue, items, filter, getKey]);

  const onSelect = useCallback(
    (key: string | null) => {
      if (!key) {
        return;
      }
      setInputValue('');
      onSelectedChange?.([...new Set([...(selected || []), key])]);
    },
    [onSelectedChange, selected],
  );

  return (
    <div className="flex flex-col gap-2">
      <Autocomplete
        value={inputValue}
        label={label}
        onValueChange={(value) => setInputValue(value)}
        items={filtered}
        isVirtualized={false}
        onSelectionChange={(item) => {
          onSelect(item as any);
        }}
      >
        {(item) => <AutocompleteItem key={getKey(item)}>{renderOption(item)}</AutocompleteItem>}
      </Autocomplete>
      {selectedItems.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedItems.map((item) => (
            <Chip
              className="h-12 rounded-lg"
              key={getKey(item)}
              onClose={() => {
                onSelectedChange?.((selected || []).filter((key) => key !== getKey(item)));
              }}
            >
              {(renderSelection || renderOption)(item)}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

export { Tagbar };
