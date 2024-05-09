import { ReactElement } from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

const Header: React.FC<Props> = (props) => {
  const { title } = props;

  return (
    <div>
      <footer>
        <p>{title}</p>
      </footer>
    </div>
  );
};

export default Header;
