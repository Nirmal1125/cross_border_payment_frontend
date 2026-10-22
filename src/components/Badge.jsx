
function Badge({ children }) {
  return (
    <span className={"badge " + children.toLowerCase().replaceAll(" ", "-")}>
      <span className="badge-dot" />
      {children}
    </span>
  );
}

export default Badge;
