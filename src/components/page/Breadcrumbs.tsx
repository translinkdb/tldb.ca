import { Link } from "react-router-dom";
import "./Breadcrumbs.scss";

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export interface Breadcrumb {
  name: string;
  link: string;
}

export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  breadcrumbs,
}) => {
  let path = "/";

  return (
    <div className="Breadcrumbs">
      <Link to="/">Home</Link>
      <span className="breadcrumb-divider">&gt;</span>
      {breadcrumbs.map((b, idx) => {
        path += b.link;

        return (
          <>
            <Link key={path} to={path}>
              {b.name}
            </Link>
            {idx < breadcrumbs.length - 1 && (
              <span key={path + "-divider"} className="breadcrumb-divider">
                &gt;
              </span>
            )}
          </>
        );
      })}
    </div>
  );
};
