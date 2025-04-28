import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./Notify_style.css";

const toastMixin = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timerProgressBar: true,
    customClass: {
        popup: "swal2-popup",
        title: "swal2-title",
        icon: "swal2-icon"
    }
});

/**
 * Show an error notification as a toast
 * @param msg - Error message text
 */
export function notifyError(msg: string) {
    toastMixin.fire({
        icon: "error",
        title: "Error",
        text: msg,
        timer: 3000
    });
}

/**
 * Show a success notification as a toast
 * @param msg - Success message text
 */
export function notifySuccess(msg: string) {
    toastMixin.fire({
        icon: "success",
        title: msg,
        timer: 3000
    });
}

/**
 * Show a notification as a toast
 * @param msg - Success message text
 */
export function notifyMessage(msg: string) {
    toastMixin.fire({
        icon: "info",
        title: msg,
        timer: 3000
    });
}


