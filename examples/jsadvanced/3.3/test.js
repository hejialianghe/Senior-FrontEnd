function ajax(url, callback) {
    // 实现省略
}
ajax("./test1.json", function(data) {
    console.log(data);
    ajax("./test2.json", function(data) {
        console.log(data);
        ajax("./test3.json", function(data) {
            console.log(data);
        });
    });
});

// 发布订阅应用
function ajax(url, callback) {
    // 实现省略
}

const pbb = new PubSub();
ajax("./test1.json", function(data) {
    pbb.publish("test1Success", data);
});
pbb.subscribe("test1Success", function(data) {
    console.log(data);
    ajax("./test2.json", function(data) {
        pbb.publish("test2Success", data);
    });
});
pbb.subscribe("test2Success", function(data) {
    console.log(data);
    ajax("./test3.json", function(data) {
        pbb.publish("test3Success", data);
    });
});
pbb.subscribe("test2Success", function(data) {
    console.log(data);
});

class PubSub {
    constructor() {
        this.events = {};
    }
    publish(eventName, data) {
        if(this.events[eventName]){
            this.events[eventName].forEach(cb => {
                cb.apply(this, data)
            });
        }
    }
    subscribe(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName].push(callback);
        } else {
            this.events[eventName] = [callback];
        }
    }
    unSubcribe(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(
                cb => cb !== callback
            );
        }
    }
}
