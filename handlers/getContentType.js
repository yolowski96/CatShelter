module.exports = function getContentType(url) {
    if (url.endsWith("css")) {
        return "text/css";
    } else if (url.endsWith("html")) {
        return "text/html";
    } else if (url.endsWith("png")) {
        return "image/png";
    } else if (url.endsWith("jpg")) {
        return "image/jpeg";
    } else if (url.endsWith("jpeg")) {
        return "image/jpeg";
    } else if (url.endsWith("bmp")) {
        return "image/bmp";
    } else if (url.endsWith("ico")) {
        return "image/ico";
    } else if (url.endsWith("js")) {
        return "text/javascript";
    } else if (url.endsWith("json")) {
        return "application/json";
    } else {
        return "text/plain";
    }
}