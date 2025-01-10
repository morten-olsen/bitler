import { Chip, Autocomplete, AutocompleteItem, MenuTriggerAction } from "@nextui-org/react";
import { useFilter } from "@react-aria/i18n";
import { useMemo, useState } from "react";

type ComboBoxFieldState<TItem> = {
  inputValue: string;
  selectedKey?: React.Key | null;
  items: TItem[];
};

type ComboBoxProps<TItem> = {
  items: TItem[];
  selected?: string[];
  onSet: (items: string[]) => void;
  render?: (item: TItem) => React.ReactNode;
  getKey: (item: TItem) => string;
};

function ComboBox<TItem extends Object>({ items, selected, onSet, render, getKey }: ComboBoxProps<TItem>) {
  const { startsWith } = useFilter({ sensitivity: "base" });
  const [fieldState, setFieldState] = useState<ComboBoxFieldState<TItem>>({
    inputValue: '',
    selectedKey: null,
    items,
  });
  const selectedItems = useMemo(
    () => {
      if (!selected) {
        return [];
      }
      return items.filter((item) => selected.includes(getKey(item)));
    },
    [items, selected]
  );

  const onInputChange = (value: string) => {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prevState.selectedKey,
      items: items.filter((item) => startsWith(getKey(item), value)),
    }));
  };

  const onOpenChange = (isOpen: boolean, menuTrigger: MenuTriggerAction) => {
    if (menuTrigger === 'focus' && isOpen) {
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: items,
      }));
    }
    if (!isOpen) {
      if (fieldState.selectedKey) {
        onSet([...(selected || []), fieldState.selectedKey as string]);
      }
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: null,
        items: items,
      }));
    }
  };

  const onSelectionChange = (key: React.Key | null) => {
    setFieldState((prevState) => {
      let selectedItem = prevState.items.find((option) => getKey(option) === key);

      return {
        inputValue: prevState.inputValue,
        selectedKey: key,
        items: items.filter((item) => startsWith(getKey(item), selectedItem ? getKey(selectedItem) : "")),
      };
    });
  };


  return (
    <div className="flex flex-wrap gap-2">
      {selectedItems?.map((item) => {
        const key = getKey(item);
        return (
          <div key={key}>
            {render?.(item) || (
              <Chip
                key={key}
                onClose={() => onSet(selected!.filter((i) => i !== key))}
              >
                {key}
              </Chip>
            )}
          </div>
        );
      })}

      <Autocomplete
        className="max-w-xs"
        inputValue={fieldState.inputValue}
        onInputChange={onInputChange}
        items={fieldState.items}
        selectedKey={fieldState.selectedKey as any}
        onSelectionChange={onSelectionChange}
        onOpenChange={onOpenChange}
      >
        {(item: TItem) => (
          <AutocompleteItem key={getKey(item)}>{getKey(item)}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export { ComboBox };
