import { ChevronRight, ChevronLeft, ListVideo, Library, Signpost, Database, MessagesSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { SidebarItem } from "./sidebar.item";
import { useState } from 'react';
import { useOpenScreen } from '../screens/screens.hooks';
import { Dialog } from '../dialog/dialog';
import { Timers } from '../timers/timers';
import { Capabilities } from '../capbilites/capabilites';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const openScreen = useOpenScreen();
  const ExpandIcon = expanded ? ChevronLeft : ChevronRight;
  return (
    <motion.div
      className="h-full border-default-100 border-r-1 px-4 pt-10 pb-4"
      animate={{
        width: expanded ? 250 : 74
      }}
    >
      <motion.div
        className="h-full flex flex-col items-start gap-6"
        animate={{
          alignItems: expanded ? 'flex-start' : 'center'
        }}
      >
        <SidebarItem
          expanded={expanded}
          title="New conversation"
          description="Start a new conversation"
          icon={Plus}
          onPress={() => openScreen(Dialog, {
            title: 'New conversation',
            focus: true,
            props: {},
          })}
        />
        <div className="h-4" />
        <SidebarItem
          expanded={expanded}
          title="Receptionist"
          description="Find the expert you need"
          icon={Signpost}
          onPress={() => openScreen(Dialog, {
            title: 'Receptionist',
            focus: true,
            props: {
              userIntro: 'Hi there! I\'m your digital assistant. I can connect you with specialized experts for different topics. Please describe what you need help with, and I\'ll create a new conversation with the right expert.',
              initialAgentConfig: {
                agent: 'builtin.receptionist',
              },
            },
          })}
        />
        <div className="h-4" />
        <SidebarItem
          expanded={expanded}
          title="Capabilities"
          description="Run you capabilities"
          icon={ListVideo}
          onPress={() => openScreen(Capabilities, {
            id: 'capabilities',
            title: 'Capabilities',
            focus: true,
            props: {},
          })}
        />
        <SidebarItem
          expanded={expanded}
          title="Knowledge bases"
          description="Manage your knowledge bases"
          icon={Library}
        />
        <SidebarItem
          expanded={expanded}
          title="Databases"
          description="Manage your databases"
          icon={Database}
        />
        <SidebarItem
          expanded={expanded}
          title="History"
          description="Manage your conversations"
          icon={MessagesSquare}
        />
        <div className="flex-1" />
        <Timers />
        <div>
          <ExpandIcon
            className="w-8 h-8 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export { Sidebar };
