import { ReactNode } from "react";

type PageProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
};

export const Page: React.FunctionComponent<PageProps> = ({
  title,
  children,
  className,
}) => {
  document.title = "TLDB" + (title ? ` | ${title}` : "");

  return <div className={`Page ${className}`}>{children}</div>;
};
