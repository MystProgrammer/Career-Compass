import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

export default function SearchButton({ className, userId, iconSize }) {
  return (
    <>
      <button className="flex flex-col items-center z-10 justify-center p-1.5 xs:p-2.5 text-xs rounded-sm mt-1 xs:mt-2.5 ml-2.5 xs:ml-5 transition-colors duration-700 hover:bg-white hover:text-primary general-btn">
        <FontAwesomeIcon icon={faMagnifyingGlass} size={iconSize} />
      </button>
    </>
  );
}
SearchButton.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.string,
  userId: PropTypes.string,
};
