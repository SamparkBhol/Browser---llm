import PropTypes from "prop-types";

function Loader({ isLoading }) {
  if (!isLoading) {
    return null;
  }
  return <div className="chat-loader" />;
}
Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loader;
