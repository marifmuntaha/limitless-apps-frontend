import {toastError} from "../../components";

const HandleError = (error) => {
    if (error.response){
        const response = error.response;
        if (response.status === 403) {
            toastError('Anda tidak mempunyai akses pada halaman ini.');
        } else if (response.status === 401) {
            toastError('Sesi anda telah berakhir, silahkan masuk kembali.');
            // localStorage.removeItem('token');
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        } else {
            toastError(response.data.message);
        }
    }
    else {
        toastError(error.message);
    }
}
export default HandleError;