import React from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Cog, LogOut } from 'lucide-react';
import { useBitler } from '@bitlerjs/react';

const Settings = () => {
  const { logout } = useBitler();
  return (
    <Popover placement="top" showArrow>
      <PopoverTrigger>
        <Button radius="full" size="sm" isIconOnly>
          <Cog size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Button color="danger" variant="flat" startContent={<LogOut />} onPress={logout}>
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export { Settings };
