import { Link } from "@radix-ui/themes";
import PropTypes from "prop-types";

function NavLink({ href, children }) {
  return (
    <Link href={href} target="_blank" rel="noopener" highContrast size={{ initial: "1", md: "3" }}>
      {children}
    </Link>
  );
}
NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default NavLink;
