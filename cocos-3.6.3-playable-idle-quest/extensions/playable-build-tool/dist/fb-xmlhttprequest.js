var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class XMLFBHttpRequest {
    get status() {
        return this._status;
    }
    get response() {
        return this._response;
    }
    open(_method, _url, _async) {
        this.method = _method;
        this.url = _url;
        this.async = _async;
    }
    overrideMimeType(mime) { }
    setRequestHeader(name, value) { }
    send(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield window.fetch(this.url);
                /*const response = {
                  ok: true,
                  status: 200,
                  statusText: "ok",
                  blob() {
                    return new Blob();
                  },
                };*/
                if (!response.ok)
                    this.onerror(response.statusText);
                else {
                    this._status = response.status;
                    const blob = yield response.blob();
                    if (this.responseType === "blob") {
                        this._response = blob;
                    }
                    else {
                        const arrayBuffer = yield blob.arrayBuffer();
                        this._response = arrayBuffer;
                    }
                    this.onload();
                }
            }
            catch (e) {
                this.onerror(e);
            }
        });
    }
}
