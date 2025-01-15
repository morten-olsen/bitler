import React from 'react';
import { useDialog } from "@bitler/react"
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import Markdown from 'react-markdown';

type DialogMessageProps = {
  message: ReturnType<typeof useDialog>["messages"][number];
};

const DialogMessage = ({ message }: DialogMessageProps) => {
  return (

    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex gap-4 items-start">
        <div className="text-xs py-4 w-[40px] flex-shrink-0 flex flex-col gap-2 items-center justify-start">
          {message.role === 'user' ? (
            <>
              <User />
              You
            </>
          ) : (
            <>
              <Bot />
              Agent
            </>
          )}
        </div>
        <div className={clsx({ 'px-4 py-4 border-1 border-default-100 rounded-lg': true, 'flex-1': message.isLoading })}>
          <div className="flex-1 justify-center flex flex-col">
            {message.isLoading ? (
              <div className="flex-1 flex flex-wrap gap-2">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            ) : (
              <div className="prose dark:prose-invert p-6 text-foreground text-sm flex-1 max-w-full pt-0 pb-0 pl-0 pr-0">
                <Markdown>{message.content}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>

  )
}

export { DialogMessage };
