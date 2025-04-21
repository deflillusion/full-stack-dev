import emailjs from "@emailjs/browser";

export function sendEmail(formData) {
    return emailjs.send(
        "service_6ng6a6q",
        "template_l07tqfm",
        formData,
        "dMfX7rt2-tkN48we5"
    );
}
