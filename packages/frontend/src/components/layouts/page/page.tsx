import { ScrollShadow } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';

type PageProps = {
  children: React.ReactNode;
};
const PageRoot = ({ children }: PageProps) => {
  return <div className="h-full flex flex-col overflow-y-auto">{children}</div>;
};

type PageHeaderProps = {
  children: React.ReactNode;
};

const PageHeader = ({ children }: PageHeaderProps) => {
  return <div>{children}</div>;
};

type PageFooterProps = {
  children: React.ReactNode;
};

const PageFooter = ({ children }: PageFooterProps) => {
  return <div>{children}</div>;
};

const PageBody = ({ children }: PageProps) => {
  return <ScrollShadow className="flex-1 overflow-y-auto p-4">{children}</ScrollShadow>;
};

type PageContent = {
  children: React.ReactNode;
  className?: string;
};

const PageContent = ({ children, className }: PageContent) => {
  return (
    <div className="w-full h-full">
      <div className={clsx('max-w-4xl mx-auto px-4', className)}>{children}</div>
    </div>
  );
};

const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Body: PageBody,
  Content: PageContent,
  Footer: PageFooter,
});

export { Page };
