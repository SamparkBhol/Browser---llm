import PropTypes from "prop-types";
import { Tooltip, IconButton as BaseIconButton } from "@radix-ui/themes";

function IconButton({ tooltip, ...restOfProps }) {
  if (!tooltip) {
    return <BaseIconButton {...restOfProps} />;
  }
  return (
    <Tooltip content={tooltip}>
      <BaseIconButton {...restOfProps} />
    </Tooltip>
  );
}
IconButton.propTypes = {
  tooltip: PropTypes.string,
};

export default IconButton;
