// 参考资料 https://github.com/yjhjstz/deep-into-node

function readFilesByCallback() {
    const fs = require("fs");
    const events = require("events");
    const emitter = new events.EventEmitter();
    const files = [
        "/Users/kitty/testgenerator/1.json",
        "/Users/kitty/testgenerator/2.json",
        "/Users/kitty/testgenerator/3.json"
    ];
    fs.readFile(files[0], function(err, data) {
        console.log(data.toString());
        console.log(emitter);
        fs.readFile(files[1], function(err, data) {
            console.log(data.toString());
            fs.readFile(files[2], function(err, data) {
                console.log(data.toString());
            });
        });
    });
}
//readFilesByCallback();

const fs = require("fs");

fs.readFile("/Users/kitty/test1.json", "utf8", function(err, data) {
    console.log(data.toString());
});

function readFile() {
    const fs = require("fs");
    const EventEmitter = require("events").EventEmitter;
    const emitter = new EventEmitter();
    fs.readFile("/Users/kitty/test.json", "utf8", function(err, data) {
        if (err) {
            emitter.emit("error");
            return;
        }
        emitter.emit("success", data.toString());
    });
    return emitter;
}

const emitter = readFile();
emitter.on("success", function(data) {
    console.log(data);
});
emitter.on("error", function(data) {
    console.log("error");
});

const { EventEmitter } = require("events");
// 省略部分代码
function FSWatcher() {
    EventEmitter.call(this);
    this._handle = new FSEvent();
    this._handle[owner_symbol] = this;
    this._handle.onchange = (status, eventType, filename) => {
        if (status < 0) {
            if (this._handle !== null) {
                this._handle.close();
                this._handle = null;
            }
            const error = errors.uvException({
                errno: status,
                syscall: "watch",
                path: filename
            });
            error.filename = filename;
            this.emit("error", error);
        } else {
            this.emit("change", eventType, filename);
        }
    };
}
ObjectSetPrototypeOf(FSWatcher.prototype, EventEmitter.prototype);
ObjectSetPrototypeOf(FSWatcher, EventEmitter);

// emit
EventEmitter.prototype.emit = function emit(type, ...args) {
    let doError = type === "error";

    const events = this._events;
    if (events !== undefined) {
        if (doError && events[kErrorMonitor] !== undefined)
            this.emit(kErrorMonitor, ...args);
        doError = doError && events.error === undefined;
    } else if (!doError) return false;

    if (doError) {
        let er;
        if (args.length > 0) er = args[0];
        if (er instanceof Error) {
            try {
                const capture = {};
                Error.captureStackTrace(capture, EventEmitter.prototype.emit);
                ObjectDefineProperty(er, kEnhanceStackBeforeInspector, {
                    value: enhanceStackTrace.bind(this, er, capture),
                    configurable: true
                });
            } catch {}
            throw er;
        }
        let stringifiedEr;
        const { inspect } = require("internal/util/inspect");
        try {
            stringifiedEr = inspect(er);
        } catch {
            stringifiedEr = er;
        }
        const err = new ERR_UNHANDLED_ERROR(stringifiedEr);
        err.context = er;
        throw err;
    }

    const handler = events[type];
    if (handler === undefined) return false;

    if (typeof handler === "function") {
        const result = ReflectApply(handler, this, args);
        if (result !== undefined && result !== null) {
            addCatch(this, result, type, args);
        }
    } else {
        const len = handler.length;
        const listeners = arrayClone(handler, len);
        for (let i = 0; i < len; ++i) {
            const result = ReflectApply(listeners[i], this, args);
            if (result !== undefined && result !== null) {
                addCatch(this, result, type, args);
            }
        }
    }
    return true;
};
