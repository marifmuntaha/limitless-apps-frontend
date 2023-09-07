import {toast} from "react-toastify";
import Icon from "../icon";

const CloseButton = () => {
    return (
        <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
    );
};
const toastSuccess = (msg) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
    });
};

const toastWarning = (msg) => {
    toast.warning(msg, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
    });
};

const toastInfo = (msg) => {
    toast.info(msg, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
    });
};

const toastError = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
    });
};

export {toastSuccess, toastWarning, toastInfo, toastError}