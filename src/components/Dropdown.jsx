import { Button, DropdownMenu, Text } from "@radix-ui/themes";
import PropTypes from "prop-types";

function Dropdown({ label, children }) {
  return (
    <DropdownMenu.Root key={label}>
      <DropdownMenu.Trigger>
        <Button variant="ghost">
          <Text weight="bold">{label}</Text>
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>{children}</DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dropdown;
