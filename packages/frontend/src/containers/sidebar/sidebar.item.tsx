import clsx from "clsx";
import { User } from "lucide-react";

type SidebarItemProps = {
  icon: typeof User;
  expanded: boolean;
  description: string;
  title: string;
  onPress?: () => void;
  active?: boolean;
};
const SidebarItem = ({ icon: Icon, description, expanded, title, onPress, active }: SidebarItemProps) => {
  return (
    <div onClick={onPress} className="flex text-foreground gap-4">
      <Icon className={clsx("w-5 h-5", active && "text-primary")} />
      {expanded && (<div className="text-xs">
        {title}
        <div className="text-default-500">{description}</div>
      </div>)}
    </div>
  );
};

export { SidebarItem };
