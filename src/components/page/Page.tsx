import { ReactNode } from "react";

type PageProps = {
  title?: string;
  children?: ReactNode;
};

export const Page: React.FunctionComponent<PageProps> = ({
  title,
  children,
}) => {
  document.title = "TLDB" + (title ? ` | ${title}` : "");

  return <div className="Page">{children}</div>;
};
