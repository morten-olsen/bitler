import React from 'react';
import { useNotifications } from '@bitlerjs/react';
import { Badge, Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Bell, X } from 'lucide-react';

const Notifications = () => {
  const { notifications, isLoading, removeNotifications } = useNotifications();
  return (
    <Badge content={notifications.length} isInvisible={notifications.length === 0} size="md" color="secondary">
      <Popover placement="bottom-end" showArrow>
        <PopoverTrigger>
          <Button radius="full" size="sm" isLoading={isLoading} isIconOnly>
            <Bell size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Listbox isVirtualized={false} selectionMode="none" className="w-[300px]">
            {notifications.map((notification) => (
              <ListboxItem
                key={notification.id}
                title={notification.title}
                description={notification.message}
                startContent={
                  <Button
                    color="danger"
                    variant="light"
                    size="sm"
                    isIconOnly
                    onClick={() => removeNotifications([notification.id])}
                  >
                    <X size={16} />
                  </Button>
                }
              />
            ))}
          </Listbox>
        </PopoverContent>
      </Popover>
    </Badge>
  );
};

export { Notifications };
