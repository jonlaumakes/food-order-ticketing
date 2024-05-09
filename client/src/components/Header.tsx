import React from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

const Header: React.FC<Props> = (props) => {
  const { title } = props;
  return (
    <div>
      <header>
        <h2>{title}</h2>
      </header>
    </div>
  );
};

export default Header;
